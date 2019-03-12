
const Bot = require('telegram-api').default;
const Message = require('telegram-api/types/Message');
const telegramAccessToken = require('../credentials/telegram').accessToken;

let bot = null;

const chats = { };
let lastContent = null;

async function advisor(content) {
  if (!bot) start(content);
  //

  if (isContentChanged(content)) {
    console.log('Changes was found for object: ', content);
    const chatsToAdvise = findChatsTrackingObject(content.trakcingObject);
    console.log('Advising chats: ', chatsToAdvise);
    chatsToAdvise.forEach(chat => advise(chat, content));
    updateLastContent(content);
  } else {
    console.log('Not changes was found for object: ', content);
  }

  function start(content) {
    bot = new Bot({
      token: telegramAccessToken
    });
    
    bot.start();

    bot.command('track <object>', function (message) {
      console.log('New chat to listen changes. Chat: ', message.chat);
      addChat(message);
      addTrackingObject(message);
      const answer = new Message()
        .text('I\'m trakcing your object and I\'ll tell you when it chenges.')
        .to(message.chat.id);
      bot.send(answer);
    });
  }

  function advise(chat, content) {
    const objectId = content.trakcingObject;
    const location = content.track[0].text;
    const text = `Your object ${objectId} are in ${location}`;
    const advice = new Message()
      .text(text)
      .to(chat.id);
    bot.send(advice);
  }

  function addChat(message) {
    chats[message.chat.id] = {
      ...message.chat,
      objects: []
    };
  }

  function addTrackingObject(message) {
    chats[message.chat.id].objects = [
      ...chats[message.chat.id].objects,
      message.args.object
    ];
  }

  function findChatsTrackingObject(trakcingObject) {
    return Object.values(chats).filter(chat => chat.objects.contains(trakcingObject));
  }

  function isContentChanged(content) {
    if (!lastContent) return true;
    if (lastContent.track.length < content.track.length) return true;
    return false;
  }

  function updateLastContent(content) {
    lastContent = content;
  }

}




module.exports = advisor;
