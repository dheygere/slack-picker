const utils = require('./utils');

// Respond to slash commands
const answerToCommands = (req, res) => {
  utils.getAllUsers()
    .then(users => {
      let availableUser = users.filter((user) => user.is_available === true);
      let unAvailableUser = users.filter((user) => user.is_available === false);
      availableUser = availableUser.map(u => `${u.name}`);
      unAvailableUser = unAvailableUser.map(u => `${u.name}`);
      const message = utils.createPickerMessage(availableUser, unAvailableUser);
      res.send(message);
    });
};

module.exports = answerToCommands;
