const utils = require('./utils');

const answerToCommands = (req, res) => {
  utils.getAllUsers()
    .then(users => {
      const userList = users.members.map(u => `<@${u.id}>`);
      const message = utils.createMessage(userList, []);
      res.send(message);
    });
};

module.exports = answerToCommands;
