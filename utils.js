const {WebClient} = require('@slack/client');
const HttpsProxyAgent = require('https-proxy-agent');
const MongoClient = require('mongodb').MongoClient;
const _ = require('lodash');

const uri = process.env.MONGO_URI || '';
if (!uri) {
  console.log('Env variable MONGO_URI is not set');
  process.exitCode = 1;
  return;
}

// TODO see https://github.com/floatdrop/express-mongo-db#readme
const mongo = new MongoClient(uri);
let _db;

// An access token (from your Slack app or custom integration - xoxa, xoxp, or xoxb)
const token = process.env.SLACK_TOKEN || '';
if (!token) {
  console.log('Env variable SLACK_TOKEN is not set');
  process.exitCode = 1;
  return;
}

const proxyUrl = process.env.HTTPS_PROXY || '';
const webClientOptions = proxyUrl ? {agent: new HttpsProxyAgent(proxyUrl)} : {};
const web = new WebClient(token, webClientOptions);


const insertUserInDb = (slackUser) => {
  const userCollection = this.getMongoDb().collection('user');
  slackUser.then(users => {
    let batch = userCollection.initializeUnorderedBulkOp();
    _.each(users.members, (user) => {
      user.is_available = true;
      batch.insert(user);
    });
    batch.execute()
      .then(value => {
        return slackUser
      })
      .catch(reason => {
        console.log(reason);
        process.exitCode = 1;
        return Promise.reject(reason);
      });
  })
};

// Get the full user list
exports.getAllUsers = async () => {
  return this.getMongoDb()
    .listCollections({name: "user"})
    .toArray()
    .then(collection => {
      if (collection.length >= 1) {
        const userCollection = this.getMongoDb().collection('user');
        return userCollection.find().toArray()
      } else {
        let slackUser = web.users.list();
        insertUserInDb(slackUser);
        return slackUser.then(users => {
          return Promise.resolve(users.members);
        });
      }
    });
};

exports.postMessage = (channel, text, attachments) => {
  return web.chat.postMessage({channel: channel, text: text, attachments: attachments});
};

exports.startMongoConnection = () => {
  return mongo.connect()
    .then(value => _db = value)
    .catch(reason => Promise.reject(reason));
};

exports.getMongoDb = () => {
  if (_db === null) {
    this.startMongoConnection();
  }
  return _db.db("slack-picker");
};

exports.stopMongoConnection = () => {
  mongo.close(false).then(value => _db = null)
};

exports.createPickerMessage = (available, unavailable, message) => {
  const slackMessage = {
    response_type: 'in_channel',
    text: message || 'Randomly pick a dev to perform a review',
    attachments: [
      {
        text: 'Available: ' + available.join(', '),
        callback_id: 'pick-a-dev',
        //color: '#3AA3E3',
        attachment_type: 'default',
        actions: [
          {
            name: 'pick',
            text: 'Pick a dev',
            type: 'button',
            value: 'pick'
          },
          {
            name: 'set_unavailable',
            text: 'Add user to unavailable',
            type: 'button',
            value: 'set_unavailable'
          }]
      }, {
        text: 'Unavailable: ' + unavailable.join(', '),
        //color: '#2b608e',
        attachment_type: 'default',
        actions: []
      }]
  };
  return slackMessage;
};

