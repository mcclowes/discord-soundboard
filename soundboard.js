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

const soundboard = [
  ['ah', './sounds/ahhh.mp3'],
  ['oof', './sounds/oof.mp3'],
  ['ooof', './sounds/oof.mp3'],
  ['fart', './sounds/fart.mp3'],
  ['toot', './sounds/toot.mp3'],
  ['haha', './sounds/haha.mp3'],
  ['hehe', './sounds/haha.mp3'],
  ['strong', './sounds/strong.mp3'],
  ['stable', './sounds/strong.mp3'],
]

const playSound = async (sound, voiceChannel) => {
  const connection = await voiceChannel.join();
  const dispatcher = connection.playFile(sound[1]);

  dispatcher.on('finish', () => {
    console.log('Finished playing!');
  });
  dispatcher.on("end", end => {voiceChannel.leave()});

  return;
}

// when client receives message
bot.on("message", message => {
  if(isReady === true) { // check bot is not handling existing command
    isReady = false;

    const voiceChannel = message.member.voiceChannel;
    if (voiceChannel && voiceChannel.joinable) {
      const command = message.content.toLowerCase();

      for(let i = 0; i < soundboard.length; i++) {
        const sound = soundboard[i];

        if (command.match(new RegExp(`${sound[0]}`))) { // only handle "ahhh"
          playSound(sound, voiceChannel);
        }
      }
    } else { // if not voice channel, fail
      isReady = true;
      return;
    }

    isReady = true;
  }
})