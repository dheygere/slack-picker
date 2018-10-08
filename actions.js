function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const pickRandomDev = (payload, respond) => {
  const message = payload.original_message;

  let available = message.attachments[0].text.substr('Available: '.length).split(',').map(s => s.trim()).filter(s => s);
  let unavailable = message.attachments[1].text.substr('Unavailable: '.length).split(',').map(s => s.trim()).filter(s => s);

  const randomIndex = getRandomInt(available.length);
  const randomName = available[randomIndex];

  available.splice(randomIndex, 1);
  unavailable.push(randomName);

  if (available.length === 0) {
    available = unavailable.slice(0);
    unavailable = [];
  }

  const reply = {
    "response_type": "in_channel",
    "text": "Randomly pick a dev to perform a review",
    "attachments": [
      {
        "text": "Available: " + available.join(', ') ,
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
        "text": "Unavailable: " + unavailable.join(', '),
        "color": "#33E33A",
        "attachment_type": "default",
        "actions": []
      },
      {
        "text": "Intouchables: ",
        "color": "#E3333A",
        "attachment_type": "default",
        "actions": []
      }
    ]
  };

  return reply;
};

module.exports = {
  pickRandomDev: pickRandomDev
};
