const Discord = require ('discord.js');
const logger = require('winston');
const auth = require('./auth.json');

// login to client
const bot = new Discord.Client();
bot.login(auth.token);

let isReady = false;

bot.on('ready', function (evt) {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.username + ' - (' + bot.id + ')');
  isReady = true;
});

const soundboard = {
  ah: './sounds/ahhh.mp3',
  ahh: './sounds/ahhh.mp3',
  ahhh: './sounds/ahhh.mp3',
  ahhhh: './sounds/ahhh.mp3',
  oof: './sounds/oof.mp3',
  ooof: './sounds/oof.mp3',
  fart: './sounds/fart.mp3',
  toot: './sounds/toot.mp3',
  haha: './sounds/haha.mp3',
  hahaha: './sounds/haha.mp3',
  hehe: './sounds/haha.mp3',
  strong: './sounds/strong.mp3',
  stable: './sounds/strong.mp3',
}

// when client receives message
bot.on("message", async message => {
  if(isReady) { // check bot is not handling existing command
    isReady = false;
    
    // parse message and take first command only
    const command = message.content.toLowerCase();

    if (soundboard[command]) { // only handle "ahhh"
      const voiceChannel = message.member.voiceChannel;

      if (!voiceChannel) { // if not voice channel, fail
        isReady = true;
        return message.reply("User was not in a voice channel")
      }

      if (voiceChannel.joinable) {
        const connection = await voiceChannel.join();
        const dispatcher = connection.playFile(soundboard[command]);

        dispatcher.on('finish', () => {
          console.log('Finished playing!');
        });
        dispatcher.on("end", end => {voiceChannel.leave()});
      } else {
        console.log("VC not joinable")
      }
    }

    isReady = true;
  }
})