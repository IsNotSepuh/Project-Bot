# 🤖 JASHARE MATRIX TELEGRAM BOT (NETLIFY SERVERLESS)

Script Bot Telegram Jashare (Jasa Share) multi-bot berbasis Node.js yang dirancang khusus untuk dideploy secara gratis dan fast-response di **Netlify Functions (Serverless)** menggunakan Webhook.

---

## 🚀 FITUR UTAMA

- **Multi-Bot Support:** 1 codebase bisa dipakai buat banyak bot Telegram sekaligus tanpa perlu hardcode token di script.
- **Role System:** CEO, OWNER, SUPREM, PREM, & FREE.
- **Multi-Type Broadcast:** Mendukung pesan teks, gambar, dokumen, teks kustom, hingga pesan terusan (forwarded message).
- **Database Online:** Terintegrasi langsung dengan `jsonstorage.net` (real-time sync).
- **Full Interactive Inline Buttons:** Menu interaktif untuk Price List dan Owner Management.
- **Live Statistics:** Laporan statistik total user, grup, uptime, dan laporan sukses/gagal secara mendetail setelah melakukan broadcast.

---

## 📁 STRUKTUR FOLDER

```text
jashare-bot/
├── netlify/
│   └── functions/
│       └── bot.js      # Core Logic Bot
├── netlify.toml        # Konfigurasi Routing Netlify
├── package.json        # Dependencies Node.js
└── README.md           # Dokumentasi Project
```

---

## 🛠️ CARA MENGUBAH CONFIG & KREDENSIAL

Buka file `netlify/functions/bot.js`, lalu sesuaikan variabel di bagian atas sesuai dengan data kamu:

```javascript
// ==================== CONFIG ====================
const USNDEV = "@mtrixman"; // Username Telegram Developer
const IDDEV = 7010528303; // ID Telegram CEO/Developer Utama
const BOTNAME = "JASHARE BY MTRIXMAN"; // Nama Bot Kamu

// URL & API Key JSONStorage untuk Database
const JSON_DB_URL = "https://api.jsonstorage.net/v1/json/YOUR-JSON-ID/YOUR-SUB-ID";
const JSON_API_KEY = "YOUR-JSONSTORAGE-API-KEY";
// ================================================
```

### 💡 Cara Mengubah Fitur Lainnya:
1. **Harga / Price List:** Ubah teks di dalam blok `bot.action('pricelist', ...)` di `bot.js`.
2. **Syarat User FREE:** Edit logika pada handler `bot.command('bcgrup', ...)` di `bot.js`.

---

## ⚙️ SPESIFIKASI FILE KONFIGURASI

### 📄 `package.json`
```json
{
  "name": "jashare-matrix-bot",
  "version": "1.0.0",
  "description": "Bot Telegram Jashare untuk Netlify",
  "main": "netlify/functions/bot.js",
  "dependencies": {
    "axios": "^1.6.8",
    "telegraf": "^4.15.3"
  }
}
```

### 📄 `netlify.toml`
```toml
[build]
  functions = "netlify/functions"

[[redirects]]
  from = "/api/bot"
  to = "/.netlify/functions/bot"
  status = 200
```

---

## 📦 CARA DEPLOY KE NETLIFY

1. Upload seluruh project ini ke repository **GitHub** kamu.
2. Buka [Netlify Dashboard](https://app.netlify.com/) dan pilih **Add new site** > **Import an existing project**.
3. Sambungkan ke GitHub dan pilih repository bot kamu.
4. Klik **Deploy Site** (tidak perlu setting build command khusus).
5. Salin URL Domain Netlify kamu (contoh: `https://namasitekamu.netlify.app`).

---

## 🔗 CARA SET WEBHOOK (MULTI-BOT DYNAMIC TOKEN)

Karena bot ini menggunakan sistem deteksi token otomatis lewat Query URL, kamu tinggal memasang webhook ke Telegram dengan format berikut:

```text
https://api.telegram.org/bot<TOKEN_BOT_KAMU>/setWebhook?url=https://<NAMA_SITE_NETLIFY_KAMU>.netlify.app/api/bot?token=<TOKEN_BOT_KAMU>
```

### 📝 Contoh Pemasangan Multi-Bot:
Ganti `<NAMA_SITE_NETLIFY_KAMU>` dengan subdomain Netlify kamu, lalu buka link-link berikut di browser:

* **Pemasangan:**
  `https://api.telegram.org/bot<TOKENBOT>/setWebhook?url=https://namasitekamu.netlify.app/api/bot?token=<TOKENBOT>`

---

## 👨‍💻 DEVELOPER

- **Developer:** [@mtrixman](https://t.me/mtrixman)
