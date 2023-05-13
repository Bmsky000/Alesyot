module.exports = (m) => {
   const isNumber = x => typeof x === 'number' && !isNaN(x)
   let user = global.db.users.find(v => v.jid == m.sender)
   if (user) {
      if (!isNumber(user.afk)) user.afk = -1
      if (!('afkReason' in user)) user.afkReason = ''
      if (!('name' in user)) user.name= m.sender
      if (!('banned' in user)) user.banned = false
      if (!isNumber(user.banTemp)) user.banTemp = 0
      if (!isNumber(user.banTimes)) user.banTimes = 0
      if (!isNumber(user.limit)) user.limit = global.limit
      if (!('premium' in user)) user.premium = false
      if (!isNumber(user.expired)) user.expired = 0
      if (!isNumber(user.lastseen)) user.lastseen = 0
      if (!isNumber(user.hit)) user.hit = 0
      if (!isNumber(user.spam)) user.spam = 0
      if (!isNumber(user.warning)) user.warning = 0
   } else {
      global.db.users.push({
         jid: m.sender,
     	afk: -1,
         afkReason: '',
         name: m.sender,
         banned: false,
         banTemp: 0,
         banTimes: 0,
         limit: global.limit,
         premium: false,
         expired: 0,
         lastseen: 0,
         hit: 0,
         spam: 0,
         warning: 0
      })
   }

   if (m.isGroup) {
      let group = global.db.groups.find(v => v.jid == m.chat)
      if (group) {
         if (!isNumber(group.activity)) group.activity = 0
         if (!('autoread' in group)) group.autoread = false
         if (!('antidelete' in group)) group.antidelete = false
         if (!('antilink' in group)) group.antilink = true
         if (!('antivirtex' in group)) group.antivirtex = true
         if (!('filter' in group)) group.filter = false
         if (!('left' in group)) group.left = false
         if (!('localonly' in group)) group.localonly = false
         if (!('mute' in group)) group.mute = false
         if (!('member' in group)) group.member = {}
         if (!('text_left' in group)) group.text_left = ''
         if (!('text_welcome' in group)) group.text_welcome = ''
         if (!('welcome' in group)) group.welcome = true
         if (!isNumber(group.expired)) group.expired = 0
         if (!('stay' in group)) group.stay = false
      } else {
         global.db.groups.push({
            jid: m.chat,
            activity: 0,
            autoread: false,
            antidelete: false,
            antilink: true,
            antivirtex: true,
            filter: false,
            left: false,
            localonly: false,
            mute: false,
            member: {},
            text_left: '',
            text_welcome: '',
            welcome: true,
            expired: 0,
            stay: false
         })
      }
   }

   let chat = global.db.chats.find(v => v.jid == m.chat)
   if (chat) {
      if (!isNumber(chat.chat)) chat.chat = 0
      if (!isNumber(chat.lastchat)) chat.lastchat = 0
      if (!isNumber(chat.lastseen)) chat.lastseen = 0
      if (!isNumber(chat.command)) chat.command = 0
   } else {
      global.db.chats.push({
         jid: m.chat,
         chat: 0,
         lastchat: 0,
         lastseen: 0,
         command: 0
      })
   }

   let setting = global.db.setting
   if (setting) {
  	if (!('autodownload' in setting)) setting.autodownload = false
  	if (!('debug' in setting)) setting.debug = false
      if (!('chatbot' in setting)) setting.chatbot = false
      if (!('error' in setting)) setting.error = []
      if (!('pluginDisable' in setting)) setting.pluginDisable = []
      if (!('groupmode' in setting)) setting.groupmode = true
      if (!('sk_pack' in setting)) setting.sk_pack = 'Alesya'
      if (!('sk_author' in setting)) setting.sk_author = '@Bm-Sky_'
      if (!('self' in setting)) setting.self = false
      if (!('mimic' in setting)) setting.mimic = []
      if (!('noprefix' in setting)) setting.noprefix = true
      if (!('multiprefix' in setting)) setting.multiprefix = true
      if (!('prefix' in setting)) setting.prefix = ['.', '/', '!', '#']
      if (!('toxic' in setting)) setting.toxic = ["yatim", "piatu"]
      if (!('online' in setting)) setting.online = true
      if (!('onlyprefix' in setting)) setting.onlyprefix = '+'
      if (!('owners' in setting)) setting.owners = ['6283899188204']
      if (!isNumber(setting.lastReset)) setting.lastReset = new Date * 1
      if (!('msg' in setting)) setting.msg = '*hallo* _+tag_ *saya alesya system otomatis yang dapat melakukan segala tugas di whatsapp,*\n\n*𓆩♡𓆪* *_Database_* : Local (5.9 GB)\n*𓆩♡𓆪* _*Libary*_ : *Baileys* V6.0.1\n*𓆩♡𓆪* _*Name*_ : _*ᴀʟᴇꜱʏᴀ*_ \n*𓆩♡𓆪* *_Source Code_* :\n*𓆩♡𓆪* *_Version_*: V3.4\n\n"jika ada yang error segera hubungi owner ya"'
      if (!isNumber(setting.menuStyle)) setting.menuStyle = 4
      if (!('cover' in setting)) setting.cover = 'https://telegra.ph/file/ff1fc88dac62e1908b46a.jpg'
      if (!('link' in setting)) setting.link = 'https://chat.whatsapp.com/Gpa5B6ifuV6C11JLXJiLsX'
   } else {
      global.db.setting = {
         autodownload: false,
         chatbot: false,
         debug: false,
         error: [],
         pluginDisable: [],
         groupmode: false,
         sk_pack: 'Aalesya',
         sk_author: '@Bm-Sky_',
         self: false,
         mimic: [],
         noprefix: false,
         multiprefix: true,
         prefix: ['.', '#', '!', '/'],
         toxic: ["yatim", "piatu"],
         online: true,
         onlyprefix: '+',
         owners: ['6283899188204'],
         lastReset: new Date * 1,
         msg: '*ʜᴀʟʟᴏ* _+tag_ *ꜱᴀʏᴀ ᴀʟᴇꜱʏᴀ ꜱɪꜱᴛᴇᴍ ᴏᴛᴏᴍᴀᴛɪꜱ ʏᴀɴɢ ᴅᴀᴘᴀᴛ ᴍᴇʟᴀᴋᴜᴋᴀɴ ꜱᴇɢᴀʟᴀ ᴛᴜɢᴀꜱ ᴅɪ ᴡʜᴀᴛꜱᴀᴘᴘ,*\n\n*𓆩♡𓆪* *_Database_* : Local (5.5 KB)\n*𓆩♡𓆪* _*Libary*_ : *Baileys* V6.0.1\n*𓆩♡𓆪* _*Name*_ : _*ᴀʟᴇꜱʏᴀ*_ \n*𓆩♡𓆪* *_Source Code_* :\n*𓆩♡𓆪* *_Version_*: V3.4\n\n“𝚒𝚏 𝚝𝚑𝚎𝚛𝚎 𝚊𝚛𝚎 𝚙𝚛𝚘𝚋𝚕𝚎𝚖𝚜 𝚌𝚘𝚗𝚝𝚊𝚌𝚝 𝚝𝚑𝚎 𝚘𝚠𝚗𝚎𝚛”',
         menuStyle: 4,
         cover: 'https://telegra.ph/file/ff1fc88dac62e1908b46a.jpg',
         link: 'https://chat.whatsapp.com/Gpa5B6ifuV6C11JLXJiLsX'
      }
   }
}
