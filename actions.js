const utils = require('./utils');

const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

// Respond to the pick button
exports.pickRandomDev = (payload, respond) => {
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

  const newSlackMessage = utils.createPickerMessage(available, unavailable, `:game_die: *<@${payload.user.id}> picked ${randomName}*`);
  Promise.resolve()
    .then(() =>
      utils.postMessage(payload.channel.id, newSlackMessage.text, newSlackMessage.attachments));

  return updatedSlackMessage;
};
