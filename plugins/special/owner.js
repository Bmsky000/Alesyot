exports.run = {
   usage: ['owner'],
   category: 'special',
   async: async (m, {
      client
   }) => {
      client.sendContact(m.chat, [{
         name: global.owner_name,
         number: global.owner,
         about: 'Owner & Creator'
      }], m, {
         org: 'Bm-Sky',
         website: 'https://BmSky.co.id',
         email: 'cyberindonesia582@gmail.com'
      })
 client.sendMessage(m.chat, {audio: { url: "./media/audio/hihi.mp3" }, mimetype: "audio/mp4",ptt: true, });
   },
   error: false,
   cache: true,
   location: __filename
}