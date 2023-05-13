exports.run = {
   usage: [`j`],
   hidden: ['bot', 'botnya'],
   category: 'group',
   async: async (m, {
      client
   }) => {
      client.sendMessage(m.chat, {audio: { url: "./media/audio/niinii.mp3" }, mimetype: "audio/mp4",ptt: true, });
   },
   error: false
}