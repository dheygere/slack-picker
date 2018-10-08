const answerToCommands = (req, res) => {
  const message = {
    "response_type": "in_channel",
    "text": "Randomly pick a dev to perform a review",
    "attachments": [
      {
        "text": "Dispo: " + req.body.text ,
        "callback_id": "pick-a-dev",
        "color": "#3AA3E3",
        "attachment_type": "default",
        "actions": [
          {
            "name": "pick",
            "text": "Pick a dev",
            "type": "button",
            "value": "pick"
          }
        ]
      },
      {
        "text": "Unavailable: ",
        "color": "#33E33A",
        "attachment_type": "default",
        "actions": []
      },
      {
        "text": "Untouchable: ",
        "color": "#E3333A",
        "attachment_type": "default",
        "actions": []
      }
    ]
  };
  res.send(message);
};

module.exports = answerToCommands;
