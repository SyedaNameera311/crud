const express = require('express');
const app = express();
const fileRoutes = require('./routes/fileRoutes');
const fs = require('fs');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.get('/', (req, res) => {
  let files = [];
  try { files = fs.readdirSync(uploadsDir); } catch(e) {}
  let cards = files.map(f => `
    <div style="border:1px solid #ccc; padding:10px; margin:10px; border-radius:8px;">
      <b>${f}</b><br/><br/>
      <a href="/uploads/${f}" target="_blank"><button>GET</button></a>
      <a href="/delete/${f}"><button style="background:red;color:white;">DELETE</button></a>
      <form onsubmit="event.preventDefault(); fetch('/api/files/${f}', {method:'PUT', headers:{'Content-Type':'application/json','Accept':'text/html'}, body: JSON.stringify({newName: this.newName.value})}).then(()=>location.reload())" style="display:inline;">
        <input type="text" name="newName" placeholder="Naya naam.jpg" required style="width:120px"/>
        <button type="submit" style="background:orange;color:white;">UPDATE</button>
      </form>
    </div>
  `).join('') || '<p>Koi file nahi</p>';

  res.send(`
    <body style="font-family:sans-serif; padding:20px;">
      <h1>🛒 Dukaan CRUD Pura</h1>
      <div style="background:#f0f0f0; padding:20px; border-radius:10px;">
        <h3>CREATE (PUSH)</h3>
        <form action="/api/files" method="post" enctype="multipart/form-data">
          <input type="file" name="file" required />
          <button type="submit" style="background:green;color:white;">Upload</button>
        </form>
      </div>
      <h3>READ / UPDATE / DELETE</h3>
      ${cards}
    </body>
  `);
});

app.get('/delete/:filename', (req, res) => {
  const p = path.join(uploadsDir, req.params.filename);
  if (fs.existsSync(p)) fs.unlinkSync(p);
  res.redirect('/');
});

app.use('/api/files', fileRoutes);
module.exports = app;