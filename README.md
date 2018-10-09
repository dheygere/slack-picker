# Slack Picker

This slack app purpose is to pick a random team member (in order to review someone's code for example). When a member has been picked, he/she cannot be picked again until everybody has been chosen.

Required env variables:
- ```HTTPS_PROXY```: only useful when developping behind a corporate proxy
- ```SLACK_SIGNING_SECRET```: [Settings / Basic Information / Signing Secret](https://api.slack.com/apps/AD69EDESU/general?)
- ```SLACK_TOKEN```: [Features / OAuth & Permissions / OAuth Access Token](https://api.slack.com/apps/AD69EDESU/oauth?)

Slack app scopes necessary for the app:
- users:read

How to start the app in debug mode: ```npm run debug```


## TODO:
- ~~npm package to use: https://github.com/slackapi/node-slack-interactive-messages~~ 
- ~~populate initial list with slack users~~
- users should not be able to pick themselves
- display a notification when a user picks someone
- it should be possible to move users from a list to another

*Ccl FTW*
