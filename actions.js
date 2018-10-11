const utils = require('./utils');

const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

const pickRandomDev = (payload) => {
  const message = payload.original_message;

  const availableIndex = 0;
  const unavailableIndex = 1;
  let available = message.attachments[availableIndex].text.substr('Available: '.length).split(',').map(s => s.trim()).filter(s => s);
  let unavailable = message.attachments[unavailableIndex].text.substr('Unavailable: '.length).split(',').map(s => s.trim()).filter(s => s);

  const randomIndex = getRandomInt(available.length);
  const randomName = available[randomIndex];

  available.splice(randomIndex, 1);
  unavailable.push(randomName);

  if (available.length === 0) {
    available = unavailable.slice(0);
    unavailable = [];
  }

  const updatedSlackMessage = message;
  updatedSlackMessage.attachments.forEach(a => a.actions = []);


  const query = {name: randomName};
  return utils.getMongoDb()
    .collection('user')
    .findOne(query).then(value => {
      return utils.getMongoDb()
        .collection('user')
        .updateOne({id: value.id}, {$set: {is_available: false}})
        .then(updated => {
          const newSlackMessage = utils.createPickerMessage(available, unavailable, `:game_die: *<@${payload.user.id}> picked <@${value.id}>*`);
          Promise.resolve()
            .then(() =>
              utils.postMessage(payload.channel.id, newSlackMessage.text, newSlackMessage.attachments));
          return updatedSlackMessage;
        })


    })

};

const setUnavailable = (payload) => {
  const message = payload.original_message;
  const updatedSlackMessage = message;
  updatedSlackMessage.attachments.forEach(a => a.actions = []);
  const userCollection = utils.getMongoDb().collection('user');
  return userCollection.find({is_available: true}).toArray().then(users => {

    const action = users.map((user) => {
      return {
        "text": user.name,
        "value": user.id
      }
    });

    const newAttachment = {
      "text": "Choose an unavailable user ",
      "fallback": "If you could read this message, you'd be choosing something fun to do right now.",
      "color": "#3AA3E3",
      "attachment_type": "default",
      "callback_id": "user_unavailable_selection",
      "actions": [
        {
          "name": "games_list",
          "text": "Pick a user...",
          "type": "select",
          "options": action
        }
      ]
    };


    updatedSlackMessage.attachments.push(newAttachment);
    return updatedSlackMessage;

  });
};

// Respond to the pick button
exports.handleAction = (payload, respond) => {
  switch (payload.actions[0].name) {
    case 'pick':
      return pickRandomDev(payload);
      break;
    case 'set_unavailable':
      return setUnavailable(payload);
      break;
  }
};
exports.setUserUnavailable = (payload, respond) => {
  const selectedUserId = payload.actions[0].selected_options[0].value;
  return utils.getMongoDb()
    .collection('user')
    .updateOne({id: selectedUserId}, {$set: {is_available: false}})
    .then(value => {
      return utils.getMongoDb()
        .collection('user')
        .find().toArray().then(users => {
          let availableUser = users.filter((user) => user.is_available === true);
          let unAvailableUser = users.filter((user) => user.is_available === false);
          availableUser = availableUser.map(u => `${u.name}`);
          unAvailableUser = unAvailableUser.map(u => `${u.name}`);
          let updatedMessage = payload.original_message;
          updatedMessage.attachments = utils.createPickerMessage(availableUser, unAvailableUser).attachments;
          return updatedMessage
        })
    });
};
