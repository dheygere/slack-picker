function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const pickRandomDev = (payload, respond) => {
  const message = payload.original_message;

  let dispo = message.attachments[0].text.substr('Dispo: '.length).split(',').map(s => s.trim()).filter(s => s);
  let indispo = message.attachments[1].text.substr('Indispo: '.length).split(',').map(s => s.trim()).filter(s => s);

  const randomIndex = getRandomInt(dispo.length);
  const randomName = dispo[randomIndex];

  dispo.splice(randomIndex, 1);
  indispo.push(randomName);

  if (dispo.length === 0) {
    dispo = indispo.slice(0);
    indispo = [];
  }

  const reply = {
    "response_type": "in_channel",
    "text": "Randomly pick a dev to perform a review",
    "attachments": [
      {
        "text": "Dispo: " + dispo.join(', ') ,
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
        "text": "Indispo: " + indispo.join(', '),
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
