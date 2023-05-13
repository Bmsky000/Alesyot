const fs = require("fs");
exports.run = {
  async: async (m, { client, body, chats, setting, isOwner }) => {
    try {
      //if (!m.fromMe && isOwner) return
      if (/(save|sv)/.test(body)) return client.reply(m.chat, `Males`, m);
      //with audio
      if (body.toLowerCase() == "assalamualaikum")return client.sendMessage(m.chat, { audio: { url: "./media/audio/waalaikumsalam.mp3" }, mimetype: "audio/mp4",ptt: true, });
      //1
      if (body.toLowerCase() == "assalamu'alaikum")return client.sendMessage(m.chat, { audio: { url: "./media/audio/waalaikumsalam.mp3" }, mimetype: "audio/mp4",ptt: true, });
      //2
      if (body.toLowerCase() == "alesya") return client.sendMessage(m.chat, {audio: { url: "./media/audio/song.mp3" }, mimetype: "audio/mp4",ptt: true, });
    } catch (e) {
      console.log(e);
    }
  },
  error: false,
  private: false,
  cache: false,
  location: __filename,
};