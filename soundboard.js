const Discord = require ('discord.js');
const logger = require('winston');
require('dotenv').config()

// login to client
const bot = new Discord.Client();
bot.login(process.env.AUTH_TOKEN);

let isReady = false;

bot.on('ready', function (evt) {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.username + ' - (' + bot.id + ')');
  isReady = true;
});

const soundboard = [
  ['fart', './sounds/fart.mp3'],
  ['toot', './sounds/toot.mp3'],
  ['hahahahaha', './sounds/haha.mp3'],
  ['hehehehehe', './sounds/haha.mp3'],
  ['strong', './sounds/strong.mp3'],
  ['stable', './sounds/strong.mp3'],
  ['ahh', './sounds/ahhh.mp3'],
  ['oof', './sounds/oof.mp3'],
]

const playSound = async (sound, voiceChannel) => {
  const connection = await voiceChannel.join();

  const dispatcher = connection.playFile(sound[1]);

  dispatcher.on("end", end => {
    setTimeout(() => {voiceChannel.leave()}, 1000);
    return;
  });
}

// when client receives message
bot.on("message", async message => {
  if(isReady === true) { // check bot is not handling existing command
    const voiceChannel = message.member.voiceChannel;
    if (voiceChannel && voiceChannel.joinable) {
      const command = message.content.toLowerCase();

      for(let i = 0; i < soundboard.length; i++) {
        const sound = soundboard[i];

        if (isReady === true && command.match(new RegExp(`${sound[0]}`))) { // only handle "ahhh"
          isReady = false;
          await playSound(sound, voiceChannel);
        }
      }
    } else { // if not voice channel, fail
      isReady = true;
      return;
    }

    isReady = true;
  }
})