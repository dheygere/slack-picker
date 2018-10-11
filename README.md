# Slack Picker

This slack app purpose is to pick a random team member (in order to review someone's code for example). When a member has been picked, he/she cannot be picked again until everybody has been chosen.


Clone the repo : 
```git clone https://github.com/dheygere/slack-picker.git```

Install npm dependency :
```npm install```

Install Ngrok for loal devlopement : 
- Create an Ngrok account : ```https://dashboard.ngrok.com/user/signup```
- Download the exe into ```C:\dev\```
- Run the command ```C:\dev\ngrok.exe authtoken [the token given after the singUp]```
- edit the file ngrok.yml in C:\Users\[User]\.ngrok2 to add : ```http_proxy: http://gateway.zscaler.net:80```

Start your Ngrok in a terminal :  ```npm run ngrok```


Create a new Slack APP with your custom / commande  ```/[name]_pick```

Configure the new APP to talk to ngrock   

Create an intelij run configuration for npm for runnig the debug commend with the folowing env variables:
- ```HTTPS_PROXY```: only useful when developping behind a corporate proxy
- ```SLACK_SIGNING_SECRET```: [Settings / Basic Information / Signing Secret](https://api.slack.com/apps/AD69EDESU/general?)
- ```SLACK_TOKEN```: [Features / OAuth & Permissions / OAuth Access Token](https://api.slack.com/apps/AD69EDESU/oauth?)
- ```MONGO_URI```: your local mongo URI 

Slack app scopes necessary for the app:
- users:read
- chatbot:write 


Run the inielij configuration in debug 


## TODO:
- ~~npm package to use: https://github.com/slackapi/node-slack-interactive-messages~~ 
- ~~populate initial list with slack users~~
- users should not be able to pick themselves
- ~~display a notification when a user picks someone~~
- it should be possible to move users from a list to another
- Restric the usage of the bot to a specific channel 

*Ccl FTW*
