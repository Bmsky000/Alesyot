const { Function: Func, Logs, Scraper } = new(require('@neoxr/wb'))
const env = require('./config.json')
const fs = require('fs')
const cron = require('node-cron')
const cache = new(require('node-cache'))({
   stdTTL: env.cooldown
})
module.exports = async (client, ctx) => {
   const { store, m, body, prefix, plugins, commands, args, command, text, prefixes } = ctx
   try {
//=================================================/
      require('./lib/system/schema')(m, env) /* input database */
      const isOwner = [client.decodeJid(client.user.id).split`@` [0], env.owner, ...global.db.setting.owners].map(v => v + '@s.whatsapp.net').includes(m.sender)
      const isPrem = (global.db.users.some(v => v.jid == m.sender) && global.db.users.find(v => v.jid == m.sender).premium) || isOwner
      const isAuth = (global.db.users.some(v => v.jid == m.sender) && global.db.users.find(v => v.jid == m.sender).authentication) || isOwner
      const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat) : {}
      const participants = m.isGroup ? groupMetadata.participants : [] || []
      const adminList = m.isGroup ? await client.groupAdmin(m.chat) : [] || []
      const isAdmin = m.isGroup ? adminList.includes(m.sender) : false
      const isBotAdmin = m.isGroup ? adminList.includes((client.user.id.split`:` [0]) + '@s.whatsapp.net') : false
      const blockList = typeof await (await client.fetchBlocklist()) != 'undefined' ? await (await client.fetchBlocklist()) : []
      const groupSet = global.db.groups.find(v => v.jid == m.chat),
         chats = global.db.chats.find(v => v.jid == m.chat),
         users = global.db.users.find(v => v.jid == m.sender),
         setting = global.db.setting
      Logs(client, m, false, 1) /* 1 = print all message, 0 = print only cmd message */
      if (!setting.online) client.sendPresenceUpdate('unavailable', m.chat)
      if (setting.online) {
         client.sendPresenceUpdate('available', m.chat)
         client.readMessages([m.key])
      }
      if (m.isGroup && !isBotAdmin) {
         groupSet.localonly = false
      }
      if (!users) global.db.users.push({
         jid: m.sender,
         banned: false,
         limit: env.limit,
         hit: 0,
         spam: 0
      })
      if (setting.debug && !m.fromMe && isOwner) client.reply(m.chat, Func.jsonFormat(m), m)
      if (!m.fromMe && m.isGroup && groupSet.antibot && m.isBot && isBotAdmin && (!isOwner || !isAdmin)) return m.reply(Func.texted('bold', `🚩 Bot lain adalah musuhku kamu Tidak Di Perbolehkan Di wilayahku maaf.`)).then(async () => await client.groupParticipantsUpdate(m.chat, [m.sender], 'remove'))
      if (m.isGroup && !isBotAdmin) {
         groupSet.captcha = true
         groupSet.localonly = false
      }
      if (m.isGroup && !groupSet.stay && (new Date * 1) >= groupSet.expired && groupSet.expired != 0) {
         return client.reply(m.chat, Func.texted('italic', '🚩 Waktu Bot Telah Habis Untuk Grup Ini,Terima Kasih.', null, {
            mentions: participants.map(v => v.id)
         })).then(async () => {
            groupSet.expired = 0
            await Func.delay(2000).then(() => client.groupLeave(m.chat))
         })
      }
      if (users && (new Date * 1) >= users.expired && users.expired != 0) {
         return client.reply(users.jid, Func.texted('italic', '🚩 Premium Mu Sudah Habis,Langganan Premium Kembali Untuk Menikmati Fitur.')).then(async () => {
            users.premium = false
            users.expired = 0
            users.limit = env.limit
         })
      }
      if (m.isGroup) groupSet.activity = new Date() * 1
      if (users) users.lastseen = new Date() * 1
      if (chats) {
         chats.chat += 1
         chats.lastseen = new Date * 1
      }
      if (m.isGroup && !m.isBot && users && users.afk > -1) {
client.sendMessageModify(m.chat, `gerak gerik seperti habis maling selama: ${Func.texted('bold', Func.toTime(new Date - users.afk))}\n\n• ${Func.texted('bold', 'Alasan')}: ${users.afkReason ? users.afkReason : '-'}`, m, {
   title: '© AFK',
   largeThumb: true,
   ads: true,
   /* can buffer or url */
   thumbnail: setting.cover
})
         users.afk = -1
         users.afkReason = ''
      }
      cron.schedule('00 00 * * *', () => {
         setting.lastReset = new Date * 1
         global.db.users.filter(v => v.limit < env.limit && !v.premium).map(v => v.limit = env.limit)
         Object.entries(global.db.statistic).map(([_, prop]) => prop.today = 0)
      }, {
         scheduled: true,
         timezone: process.env.TZ
      })
      if (m.isGroup && !m.fromMe) {
         let now = new Date() * 1
         if (!groupSet.member[m.sender]) {
            groupSet.member[m.sender] = {
               lastseen: now,
               warning: 0
            }
         } else {
            groupSet.member[m.sender].lastseen = now
         }
      }
      const matcher = Func.matcher(command, commands).filter(v => v.accuracy >= 60)
      if (prefix && !commands.includes(command) && matcher.length > 0 && !setting.self) {
         if (!m.isGroup || (m.isGroup && !groupSet.mute)) return client.reply(m.chat, `🚩 kalo itu salah mungkin ini :\n\n${matcher.map(v => '➠ *' + (prefix ? prefix : '') + v.string + '* (' + v.accuracy + '%)').join('\n')}`, m)
      }
      if (body && prefix && commands.includes(command) || body && !prefix && commands.includes(command) && setting.noprefix || body && !prefix && commands.includes(command) && env.evaluate_chars.includes(command)) {
         if (setting.error.includes(command)) return client.reply(m.chat, Func.texted('bold', `🚩 Command _${(prefix ? prefix : '') + command}_ disabled.`), m)
         if (!m.isGroup && env.blocks.some(no => m.sender.startsWith(no))) return client.updateBlockStatus(m.sender, 'block')
         if (cache.has(m.sender) && cache.get(m.sender) == 'on_hold' && !isOwner) return
         cache.set(m.sender, 'on_hold')
         if (commands.includes(command)) {
            users.hit += 1
            users.usebot = new Date() * 1
            Func.hitstat(command, m.sender)
         }
         const is_commands = Object.fromEntries(Object.entries(plugins).filter(([name, prop]) => prop.run.usage))
         for (let name in is_commands) {
            const cmd = is_commands[name].run
            const turn = cmd.usage instanceof Array ? cmd.usage.includes(command) : cmd.usage instanceof String ? cmd.usage == command : false
            const turn_hidden = cmd.hidden instanceof Array ? cmd.hidden.includes(command) : cmd.hidden instanceof String ? cmd.hidden == command : false
            if (!turn && !turn_hidden) continue
            if (m.isBot || m.chat.endsWith('broadcast') || /edit/.test(m.mtype)) continue
            if (setting.self && !isOwner && !m.fromMe) continue
            if (!m.isGroup && !['owner'].includes(name) && chats && !isPrem && !users.banned && new Date() * 1 - chats.lastchat < env.timeout) continue
            if (!m.isGroup && !['owner', 'menfess', 'verify'].includes(name) && chats && !isPrem && !users.banned && setting.groupmode) {
               client.sendMessageModify(m.chat, `⚠️ Bot sedang dalam mode khusus group, kalo mau pake join group dulu https://chat.whatsapp.com/EG0AFDSWMgMCxGZ2EU3SjA\n atau tanya owner dengan cara ketik *${prefixes[0]}owner*.`, m, {
                  largeThumb: true,
                  thumbnail: 'https://telegra.ph/file/0acd56d1610d84e416720.jpg',
                  url: setting.link
               }).then(() => chats.lastchat = new Date() * 1)
               continue
            }
            if (!['me', 'owner', 'exec'].includes(name) && users && (users.banned || new Date - users.banTemp < env.timeout)) continue
            if (!['verify', 'exec'].includes(name) && !m.isGroup && users && !users.banned && !users.verified && setting.verify) users.attempt += 1
            let teks = `🚩 *[ ${users.attempt} / 5 ]* Verifikasi nomor dengan menggunakan email, 1 email untuk memverifikasi 1 nomor WhatsApp. Silahkan ikuti step by step berikut :\n\n– *STEP 1*\nGunakan perintah *reg <email>* untuk mendapatkan kode verifikasi melalui email.\nContoh : *reg doraemon@gmail.com*\n\n– *STEP 2*\nBuka email dan cek pesan masuk atau di folder spam, setelah kamu mendapat kode verifikasi silahkan kirim kode tersebut kepada Alesya bot.\n\n*Note* :\nMengabaikan pesan ini sebanyak *5x* kamu akan di banned dan di blokir, untuk membuka banned dan blokir dikenai biaya sebesar Rp. 2,000\n\njika sudah menggunakan command tetapi code tidak ada di gmail kalian, silakan hubungi owner ketik *.owner*`
            if (users && !users.banned && !users.verified && users.attempt >= 5 && setting.verify) return client.reply(m.isGroup ? m.sender : m.chat, Func.texted('bold', `🚩 [ ${users.attempt} / 5 ] : Kamu mengabaikan pesan verifikasi tapi tenang masih ada bot lain kok, banned thanks. (^_^)`), m).then(() => {
               users.banned = true
               users.attempt = 0
               users.code = ''
               users.codeExpire = 0
               users.email = ''
               client.updateBlockStatus(m.sender, 'block')
            })
            if (!['verify', 'exec'].includes(name) && !m.isGroup && users && !users.banned && !users.verified && setting.verify) return client.sendMessageModify(m.chat, teks, m, {
               largeThumb: true,
               thumbnail: await Func.fetchBuffer('https://telegra.ph/file/ef18b1c12bc3778804fb5.jpg')
            })
            if (!['verify', 'exec'].includes(name) && m.isGroup && users && !users.banned && !users.verified && setting.verify) return client.reply(m.chat, `🚩 Nomormu Belum Di Verifikasi, Verifikasi Dengan Perintah *reg <email>* Di Chat Pribadi.`, m)
            if (m.isGroup && !['activation', 'groupinfo'].includes(name) && groupSet.mute) continue
            if (cmd.cache && cmd.location) {
               let file = require.resolve(cmd.location)
               Func.reload(file)
            }
            if (cmd.owner && !isOwner) {
               client.reply(m.chat, global.status.owner, m)
               continue
            }
            if (cmd.auth && !isAuth) {
               client.reply(m.chat, global.status.auth, m)
               continue
            }
            if (cmd.restrict && !isPrem && !isOwner && text && new RegExp('\\b' + setting.toxic.join('\\b|\\b') + '\\b').test(text.toLowerCase())) {
               client.reply(m.chat, `⚠️ Ups kamu melanggar kebijakan saya,  kamu saya banned selamt tinggal, mwuah🍁`, m).then(() => {
                  users.banned = true
                  client.updateBlockStatus(m.sender, 'block')
               })
               continue
            }
            if (cmd.premium && !isPrem) {
               client.reply(m.chat, global.status.premium, m)
               continue
            }
            if (cmd.limit && users.limit < 1) {
               client.reply(m.chat, `⚠️ Kamu Mencapai Limit ,Akan Reset Pukul 00.00\n\nLebih Banyak Limit?,Beralih Ke Premium.`, m).then(() => users.premium = false)
               continue
            }
            if (cmd.limit && users.limit > 0) {
               const limit = cmd.limit.constructor.name == 'Boolean' ? 1 : cmd.limit
               if (users.limit >= limit) {
                  users.limit -= limit
               } else {
                  client.reply(m.chat, Func.texted('bold', `⚠️ Limitmu Tidak Cukup Untuk Fitur Ini.`), m)
                  continue
               }
            }
            if (cmd.group && !m.isGroup) {
               client.reply(m.chat, global.status.group, m)
               continue
            } else if (cmd.botAdmin && !isBotAdmin) {
               client.reply(m.chat, global.status.botAdmin, m)
               continue
            } else if (cmd.admin && !isAdmin) {
               client.reply(m.chat, global.status.admin, m)
               continue
            }
            if (cmd.private && m.isGroup) {
               client.reply(m.chat, global.status.private, m)
               continue
            }
            if (cmd.game && !setting.games) {
               client.reply(m.chat, global.status.gameSystem, m)
               continue
            }
            if (cmd.game && Func.level(users.point)[0] >= 50) {
               client.reply(m.chat, global.status.gameLevel, m)
               continue
            }
            if (cmd.game && m.isGroup && !groupSet.game) {
               client.reply(m.chat, global.status.gameInGroup, m)
               continue
            }

            cmd.async(m, { client, args, text, isPrefix: prefix, prefixes, command, groupMetadata, participants, users, chats, groupSet, setting, isOwner, isAdmin, isBotAdmin, plugins, blockList, env, ctx, store, Func, Scraper })
            break
         }
      } else {
         const is_events = Object.fromEntries(Object.entries(plugins).filter(([name, prop]) => !prop.run.usage))
         for (let name in is_events) {
            let event = is_events[name].run
            if (m.fromMe || m.chat.endsWith('broadcast') || /pollUpdate/.test(m.mtype)) continue
            if (!m.isGroup && env.blocks.some(no => m.sender.startsWith(no))) return client.updateBlockStatus(m.sender, 'block')
            if (setting.self && !['menfess_ev', 'anti_link', 'anti_tagall', 'anti_virtex', 'filter'].includes(event.pluginName) && !isOwner && !m.fromMe) continue
            if (!['anti_link', 'anti_tagall', 'anti_virtex', 'filter'].includes(name) && users && (users.banned || new Date - users.banTemp < env.timeout)) continue
            if (!['anti_link', 'anti_tagall', 'anti_virtex', 'filter'].includes(name) && groupSet && groupSet.mute) continue
            if (!m.isGroup && !['menfess_ev', 'chatbot', 'auto_download'].includes(name) && chats && !isPrem && !users.banned && new Date() * 1 - chats.lastchat < env.timeout) continue
            if (!m.isGroup && setting.groupmode && !['system_ev', 'menfess_ev', 'chatbot', 'auto_download'].includes(name) && !isPrem) return client.sendMessageModify(m.chat, `⚠️ Bot sedang dalam mode khusus group, kalo mau pake join group dulu https://chat.whatsapp.com/EG0AFDSWMgMCxGZ2EU3SjA\n atau tanya owner dengan cara ketik *${prefixes[0]}owner*`, m, {
               largeThumb: true,
               thumbnail: await Func.fetchBuffer('https://telegra.ph/file/0b32e0a0bb3b81fef9838.jpg'),
               url: setting.link
            }).then(() => chats.lastchat = new Date() * 1)
            if (event.cache && event.location) {
               let file = require.resolve(event.location)
               Func.reload(file)
            }
            if (event.error) continue
            if (event.owner && !isOwner) continue
            if (event.group && !m.isGroup) continue
            if (event.limit && !event.game && users.limit < 1 && body && Func.generateLink(body) && Func.generateLink(body).some(v => Func.socmed(v))) return client.reply(m.chat, `⚠️ Kamu Mencapai Limit ,Akan Reset Pukul 00.00\n\nLebih Banyak Limit?,Beralih Ke Premium.`, m).then(() => {
               users.premium = false
               users.expired = 0
            })
            if (event.botAdmin && !isBotAdmin) continue
            if (event.admin && !isAdmin) continue
            if (event.private && m.isGroup) continue
            if (event.download && users && !users.verified && body && Func.socmed(body) && setting.verify) return client.reply(m.chat, `🚩 Nomormu Belum Di Verifikasi, Verifikasi Dengan Perintah *reg <email>* Di Chat Pribadi.`, m)
            if (event.download && (!setting.autodownload || (body && env.evaluate_chars.some(v => body.startsWith(v))))) continue
            if (event.premium && !isPrem && body && Func.socmed(body)) return client.reply(m.chat, global.status.premium, m)
            if (event.game && !setting.games) continue
            if (event.game && Func.level(users.point)[0] >= 50) continue
            if (event.game && m.isGroup && !groupSet.game) continue

            event.async(m, { client, body, prefixes, groupMetadata, participants, users, chats, groupSet, setting, isOwner, isAdmin, isBotAdmin, plugins, blockList, env, ctx, store, Func, Scraper })
         }
      }
   } catch (e) {
      if (/(undefined|overlimit|timed|timeout|users|item|time)/ig.test(e.message)) return
      console.log(e)
      if (!m.fromMe) return m.reply(Func.jsonFormat(new Error('Alesya encountered an error :' + e)))
   }
   Func.reload(require.resolve(__filename))
}