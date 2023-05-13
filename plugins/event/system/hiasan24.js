exports.run = {
   usage: [`j`],
   hidden: ['p', 'pp', 'ppp', 'pppp', 'pe', 'pepe', 'pepek', 'pee', 'peee'],
   category: 'group',
   async: async (m, {
      client
   }) => {
      client.sendMessage(m.chat, {audio: { url: "./media/audio/pepe.mp3" }, mimetype: "audio/mp4",ptt: true, });
   },
   error: false
}