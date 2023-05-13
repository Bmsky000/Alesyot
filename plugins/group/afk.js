exports.run = {
   usage: ['afk'],
   use: 'reason (optional)',
   category: 'group',
   async: async (m, {
      client,
      text
   }) => {
      try {
         let user = global.db.users.find(v => v.jid == m.sender)
         user.afk = +new Date
         user.afkReason = text
         let tag = m.sender.split`@` [0]
         return client.reply(m.chat, Func.texted('bold', `🚩 @${tag} is now AFK!`), m)
      } catch {
         client.reply(m.chat, global.status.error, m)
      }
      client.sendMessage(m.chat, {audio: { url: "./media/audio/menu.mp3" }, mimetype: "audio/mp4",ptt: true, });
   },
   error: false,
   group: true
}