const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');

// ==================== CONFIG ====================
const USNDEV = "@mtrixman";
const IDDEV = 7010528303;
const BOTNAME = "JASHARE BY MTRIXMAN";

const JSON_DB_URL = "https://api.jsonstorage.net/v1/YOUR-JSON-ID/YOUR-SUB-ID";
const JSON_API_KEY = "JSONSTORAGE-API-KEY";
// ================================================

const startTime = Date.now();

async function getDB() {
  try {
    const res = await axios.get(JSON_DB_URL, { timeout: 4000 });
    const data = res.data;
    
    return {
      users: Array.isArray(data?.users) ? data.users : [],
      groups: Array.isArray(data?.groups) ? data.groups : [],
      roles: (typeof data?.roles === 'object' && data?.roles !== null) ? data.roles : {}
    };
  } catch (e) {
    console.error("Gagal get DB, pake default fallback:", e.message);
    return { users: [], groups: [], roles: {} };
  }
}

async function saveDB(data) {
  try {
    await axios.put(`${JSON_DB_URL}?apiKey=${JSON_API_KEY}`, data, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 4000
    });
  } catch (e) {
    console.error("Gagal simpan DB:", e.message);
  }
}

function getUptime() {
  const diff = Math.floor((Date.now() - startTime) / 1000);
  const m = Math.floor(diff / 60);
  const s = diff % 60;
  return `${m}m ${s}s`;
}

function getUserRole(db, userId) {
  if (userId === IDDEV) return 'CEO';
  return db.roles[userId] || 'FREE';
}

function createBot(token) {
  const bot = new Telegraf(token);
  bot.use(async (ctx, next) => {
    try {
      const db = await getDB();
      let updated = false;

      if (ctx.from && !db.users.includes(ctx.from.id)) {
        db.users.push(ctx.from.id);
        updated = true;
      }

      if (ctx.chat && (ctx.chat.type === 'group' || ctx.chat.type === 'supergroup')) {
        if (!db.groups.includes(ctx.chat.id)) {
          db.groups.push(ctx.chat.id);
          updated = true;
        }
      }

      if (updated) await saveDB(db);
    } catch (err) {
      console.error("Middleware Error:", err.message);
    }
    return next();
  });
  bot.command('start', async (ctx) => {
    const db = await getDB();
    const username = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;

    const text = 
`halloo ${username} yang start
  𝚆𝙴𝙻𝙲𝙾𝙼𝙴 𝚃𝙾 𝙹𝙰𝚂𝙷𝙴𝚁 𝙱𝙾𝚃 🎉
𝙷𝙰𝙿𝙿𝚈 𝚄𝚂𝙸𝙽𝙶 𝙰𝙽𝙳 𝙷𝙰𝚅𝙴 𝙵𝚄𝙽 🥳
━━━━━━━━━━━━━━━━━━━━━
⧼ 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 ☇ 𝐁𝐎𝐓 ⧽
├─ 𝘿𝙚𝙫𝙚𝙡𝙤𝙥𝙚𝙧 : ${USNDEV}
├─ 𝘽𝙤𝙩 𝙉𝙖𝙢𝙚 : ${BOTNAME}
├─ 𝙑𝙚𝙧𝙨𝙞𝙤𝙣 : 1.0
└─ 𝙋𝙧𝙚𝙛𝙞𝙭   : /

⧼ 𝐁𝐎𝐓 ☇ 𝐒𝐓𝐀𝐓𝐈𝐒𝐓𝐈𝐂𝐒 ⧽
├─ 𝙋𝙚𝙣𝙜𝙜𝙪𝙣𝙖 : ${username}
├─ 𝙂𝙧𝙤𝙪𝙥𝙨 : ${db.groups.length}
├─ 𝙐𝙨𝙚𝙧𝙨 : ${db.users.length}
└─ 𝙐𝙥𝙏𝙞𝙢𝙚 : ${getUptime()}
━━━━━━━━━━━━━━━━━━━━━━
✨ Developer ${USNDEV}`;

    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('📜 Price List', 'pricelist'), Markup.button.callback('📊 Stat Bot', 'stats')],
      [Markup.button.callback('⚙️ Owner Menu', 'owner_menu')],
      [Markup.button.url('💬 Developer', `https://t.me/${USNDEV.replace('@', '')}`)]
    ]);

    return ctx.reply(text, keyboard);
  });

  // BUTTON HANDLERS
  bot.action('pricelist', (ctx) => {
    const priceText = 
`📋 **LIST HARGA AKSES JASHARE**
━━━━━━━━━━━━━━━━━━━━━
🔹 FREE     : GRATIS
🔹 PREM     : Rp 2.000
🔹 SUPREM   : Rp 4.000
🔹 OWNER    : Rp 6.000

Hubungi Developer ${USNDEV} untuk upgrade akses!`;
    
    return ctx.reply(priceText, Markup.inlineKeyboard([
      [Markup.button.callback('⬅️ Kembali', 'main_menu')]
    ]));
  });

  bot.action('owner_menu', async (ctx) => {
    const db = await getDB();
    const role = getUserRole(db, ctx.from.id);

    if (!['OWNER', 'SUPREM', 'CEO'].includes(role)) {
      return ctx.answerCbQuery('❌ Khusus Akses Owner/Suprem/CEO!', { show_alert: true });
    }

    const menuText = 
`👑 **MENU MANAGEMENT OWNER**
━━━━━━━━━━━━━━━━━━━━━
Akses Kamu: *${role}*

Command Tambah Akses:
• \`/addprem <user_id>\`
• \`/addsuprem <user_id>\`
• \`/addowner <user_id>\`
• \`/addceo <user_id>\` (Khusus CEO)`;

    return ctx.reply(menuText, Markup.inlineKeyboard([
      [Markup.button.callback('⬅️ Kembali', 'main_menu')]
    ]));
  });
  const handleAddRole = async (ctx, targetRole, allowedRoles) => {
    const db = await getDB();
    const myRole = getUserRole(db, ctx.from.id);

    if (!allowedRoles.includes(myRole)) {
      return ctx.reply('❌ Kamu gak punya akses buat command ini!');
    }

    const args = ctx.message.text.split(' ');
    if (args.length < 2) return ctx.reply(`Gunakan format: /add${targetRole.toLowerCase()} <user_id>`);

    const targetId = parseInt(args[1]);
    if (isNaN(targetId)) return ctx.reply('❌ ID User harus berupa angka!');

    db.roles[targetId] = targetRole;
    await saveDB(db);

    return ctx.reply(`✅ Berhasil menambahkan akses **${targetRole}** ke User ID: \`${targetId}\``);
  };

  bot.command('addprem', (ctx) => handleAddRole(ctx, 'PREM', ['OWNER', 'SUPREM', 'CEO']));
  bot.command('addsuprem', (ctx) => handleAddRole(ctx, 'SUPREM', ['SUPREM', 'CEO']));
  bot.command('addowner', (ctx) => handleAddRole(ctx, 'OWNER', ['SUPREM', 'CEO']));
  bot.command('addceo', (ctx) => {
    if (ctx.from.id !== IDDEV) return ctx.reply(`❌ Cuma CEO asli ( ID: ${IDDEV} ) yang bisa add CEO!`);
    return handleAddRole(ctx, 'CEO', ['CEO']);
  });
  const handleBcGrup = async (ctx) => {
    const db = await getDB();
    const role = getUserRole(db, ctx.from.id);

    if (role === 'FREE') {
      return ctx.reply('⚠️ User FREE wajib memasukkan bot ke minimal 2 grup dengan spek masing-masing 15 member!');
    }
    if (!ctx.message.reply_to_message) {
      return ctx.reply('⚠️ **Harap reply pesan** yang ingin kamu broadcast ke grup!');
    }

    const msgToCopy = ctx.message.reply_to_message;
    let sukses = 0;
    let gagal = 0;

    for (const groupId of db.groups) {
      try {
        await ctx.telegram.copyMessage(groupId, ctx.chat.id, msgToCopy.message_id);
        sukses++;
      } catch (e) {
        gagal++;
      }
    }

    const resultText = 
`SUKSES BROADCAST GRUP
━━━━━━━━━━━━━━━━━━━━━
⧼ 𝐒𝐓𝐀𝐓𝐈𝐒𝐓𝐈𝐊 𝐁𝐑𝐎𝐀𝐃𝐂𝐀𝐒𝐓 ⧽
├─ 🟢 Sukses : ${sukses} Grup
├─ 🔴 Gagal  : ${gagal} Grup
└─ 📊 Total  : ${db.groups.length} Grup
━━━━━━━━━━━━━━━━━━━━━
🤖 ${BOTNAME}`;

    return ctx.reply(resultText);
  };
  bot.command('bcgrup', handleBcGrup);
  bot.command('bcgc', handleBcGrup); 
  bot.command('broadcast', async (ctx) => {
    const db = await getDB();
    const role = getUserRole(db, ctx.from.id);

    if (role === 'FREE') {
      return ctx.reply('❌ Akses FREE gak bisa kirim /broadcast user! Silakan upgrade ke PREM.');
    }
    if (!ctx.message.reply_to_message) {
      return ctx.reply('⚠️ **Harap reply pesan** yang ingin kamu broadcast ke semua user!');
    }

    const msgToCopy = ctx.message.reply_to_message;
    let sukses = 0;
    let gagal = 0;

    for (const userId of db.users) {
      try {
        await ctx.telegram.copyMessage(userId, ctx.chat.id, msgToCopy.message_id);
        sukses++;
      } catch (e) {
        gagal++;
      }
    }

    const resultText = 
`SUKSES /broadcast
━━━━━━━━━━━━━━━━━━━━━
⧼ 𝐒𝐓𝐀𝐓𝐈𝐒𝐓𝐈𝐊 𝐁𝐑𝐎𝐀𝐃𝐂𝐀𝐒𝐓 ⧽
├─ 🟢 Sukses : ${sukses} User
├─ 🔴 Gagal  : ${gagal} User
└─ 📊 Total  : ${db.users.length} User
━━━━━━━━━━━━━━━━━━━━━
🤖 ${BOTNAME}`;

    return ctx.reply(resultText);
  });

  return bot;
}

// HANDLER NETLIFY SERVERLESS
exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'POST') {
      const token = event.queryStringParameters ? event.queryStringParameters.token : null;

      if (!token) {
        return { statusCode: 400, body: 'Bot token missing in query parameters' };
      }

      const bot = createBot(token);
      const body = JSON.parse(event.body);

      await bot.handleUpdate(body);

      return { statusCode: 200, body: 'OK' };
    }
    return { statusCode: 200, body: 'Jashare Bot Webhook Server Active' };
  } catch (err) {
    console.error("Fatal Handler Error:", err.message);
    return { statusCode: 200, body: 'OK with Error' };
  }
};
