const utils = require('./utils');

// Respond to slash commands
const answerToCommands = (req, res) => {
  utils.getAllUsers()
    .then(users => {
      const userList = users.members.map(u => `<@${u.id}>`);
      const message = utils.createPickerMessage(userList, []);
      res.send(message);
    });
};

module.exports = answerToCommands;
