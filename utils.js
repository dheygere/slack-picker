const {WebClient} = require('@slack/client');
const HttpsProxyAgent = require('https-proxy-agent');

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

// Get the full user list
exports.getAllUsers = () => web.users.list();

exports.postMessage = (channel, text, attachments) => {
  return web.chat.postMessage({channel: channel, text: text, attachments: attachments});
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

