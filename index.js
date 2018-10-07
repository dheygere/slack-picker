// Import dependencies
const { createMessageAdapter } = require('@slack/interactive-messages');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

// Create the adapter using the app's signing secret, read from environment variable
const slackInteractions = createMessageAdapter(process.env.SLACK_SIGNING_SECRET);

// Initialize an Express application
const app = express();

// Create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Attach the adapter to the Express application as a middleware
// NOTE: The path must match the Request URL and/or Options URL configured in Slack
app.use('/slack/commands', urlencodedParser, require('./commands'));
app.use('/slack/actions', slackInteractions.expressMiddleware());

// Run handlerFunction for the dialog submission with callback_id of 'welcome'
slackInteractions.action({ callbackId: 'pick-a-dev' }, require('./actions').pickRandomDev);

// Select a port for the server to listen on.
// NOTE: When using ngrok or localtunnel locally, choose the same port it was started with.
const port = process.env.PORT || 3000;

// Start the express application server
http.createServer(app).listen(port, () => {
  console.log(`server listening on port ${port}`);
});
