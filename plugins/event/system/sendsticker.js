exports.run = {
   usage: [`v`],
   hidden: ['pantek', 'memek', 'kntolodon', 'pilat', 'seak', 'bajingan', 'jing', 'setan', 'suram', 'miris', 'rasis', 'fuck', 'bitch', 'fuckyou', 'mek', 'asyu', 'cuy', 'coy'],
   category: 'group',
   async: async (m, {
      client
   }) => {
client.sendMessage(m.chat, {sticker: { url: "./media/sticker/hoi.webp" }, sendMediaAsSticker: true });
   },
   error: false
}