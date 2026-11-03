const express = require('express');
const app = express();
const fileRoutes = require('./routes/fileRoutes');
const fs = require('fs');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Vercel vs Local ke liye alag folder
const uploadsDir = process.env.VERCEL ? '/tmp/uploads' : path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use('/uploads', express.static(uploadsDir));

app.get('/', (req, res) => {
  let files = [];
  try { files = fs.readdirSync(uploadsDir); } catch(e) {}
  let cards = files.map(f => `
    <div style="border:1px solid #ccc; padding:10px; margin:10px; border-radius:8px;">
      <b>${f}</b><br/><br/>
      <a href="/uploads/${f}" target="_blank"><button>GET</button></a>
      <a href="/delete/${f}"><button style="background:red;color:white;">DELETE</button></a>
      <form onsubmit="event.preventDefault(); fetch('/api/files/${f}', {method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({newName: this.newName.value})}).then(()=>location.reload())" style="display:inline;">
        <input name="newName" placeholder="Naya naam" required style="width:100px"/>
        <button style="background:orange;color:white;">UPDATE</button>
      </form>
    </div>`).join('') || '<p>Koi file nahi</p>';
  res.send(`<body style="font-family:sans-serif;padding:20px;"><h1>🛒 Dukaan CRUD</h1><form action="/api/files" method="post" enctype="multipart/form-data"><input type="file" name="file" required/><button style="background:green;color:white;">Upload</button></form><div style="display:flex;flex-wrap:wrap;">${cards}</div></body>`);
});

app.get('/delete/:filename', (req, res) => {
  const p = path.join(uploadsDir, req.params.filename);
  if (fs.existsSync(p)) fs.unlinkSync(p);
  res.redirect('/');
});

app.use('/api/files', fileRoutes);
module.exports = app;