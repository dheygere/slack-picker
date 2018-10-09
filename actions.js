const utils = require('./utils');

const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

exports.pickRandomDev = (payload, respond) => {
  const message = payload.original_message;

  let available = message.attachments[0].text.substr('Available: '.length).split(',').map(s => s.trim()).filter(s => s);
  let unavailable = message.attachments[1].text.substr('Unavailable: '.length).split(',').map(s => s.trim()).filter(s => s);

  // TODO: make sure that you cannot pick yourself
  const randomIndex = getRandomInt(available.length);
  const randomName = available[randomIndex];

  available.splice(randomIndex, 1);
  unavailable.push(randomName);

  if (available.length === 0) {
    available = unavailable.slice(0);
    unavailable = [];
  }

  return utils.createMessage(available, unavailable);
};
