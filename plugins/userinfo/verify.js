const nodemailer = require('nodemailer')
exports.run = {
   usage: ['reg'],
   use: 'email',
   category: 'user info',
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      Func
   }) => {
      try {
         if (global.db.users.find(v => v.jid == m.sender).verified) return client.reply(m.chat, Func.texted('bold', `✅ Your number already verified.`), m)
      if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, 'emailmu@gmail.com'), m)
      if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ig.test(args[0])) return client.reply(m.chat, Func.texted('bold', '🚩 Invalid email.'), m)
      let emails = global.db.users.filter(v => v.email).map(v => v.email)
      if (emails.includes(args[0])) return client.reply(m.chat, Func.texted('bold', '🚩 Email already registered.'), m)
      client.sendReact(m.chat, '🕒', m.key)
      let code = `${Func.randomInt(100, 900)}-${Func.randomInt(100, 900)}`
      let users = global.db.users.find(v => v.jid == m.sender)
      users.codeExpire = new Date * 1
      users.code = code
      users.email = args[0]
      const transport = nodemailer.createTransport({
         service: 'osb35982@gmail.com',
         auth: {
            user: 'osb35982@gmail.com',
            pass: 'iufxkvgfkrporike'
         }
      })
      const mailOptions = {
         from: {
            name: 'Alesya Bot',
            address: 'osb35982@gmail.com'
         },
         to: args[0],
         subject: 'Email Verification',
         html: `<div style="padding:20px;border:1px dashed #222;font-size:15px"><tt>Hi <b>${m.pushName} </b><br><br>confirmasi email kamu untuk menggunakan alesya bot, kirimkan code itu kepada bot, code kadaluarsa dalam 3 menit.<br><center><h1>${code}</h1></center>atau copy link ini dan tempelka  di browser kamu :<a href="https://wa.me/${client.decodeJid(client.user.id).split('@')[0]}?text=${code}">https://wa.me/${client.decodeJid(client.user.id).split('@')[0]}?text=${code}</a><br><br><img src="https://telegra.ph/file/0acd56d1610d84e416720.jpg" alt="Gambar" width="300" height="200"><hr style="border:0px; border-top:1px dashed #222"><br>verifikasi By, <b>BimaSky & Alesya Bot</b></tt></div>`
      }
transport.sendMail(mailOptions, function(err, data) {
         if (err) return m.reply(Func.texted('bold', `❌ SMTP Error !!`))
         return client.reply(m.chat, Func.texted('bold', `✅ Check your mailbox to get a verification code.`), m)
      })
      } catch (e) {
         client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   private: true
}