const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '../../uploads');

const getFiles = (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    res.json({ total: files.length, files });
  } catch(e) {
    res.json({ total: 0, files: [] });
  }
};

const createFile = (req, res) => {
  if (!req.file) return res.status(400).send('No file <a href="/">Wapas</a>');
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    return res.redirect('/');
  }
  res.status(201).json({ message: 'File created', file: req.file });
};

const deleteFile = (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(uploadsDir, fileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      return res.redirect('/');
    }
    return res.json({ message: 'Deleted', fileName });
  } else {
    return res.status(404).json({ error: 'File nahi mili' });
  }
};

const updateFile = (req, res) => {
  const oldName = req.params.filename;
  const { newName } = req.body;
  const oldPath = path.join(uploadsDir, oldName);
  const newPath = path.join(uploadsDir, newName);

  if (!fs.existsSync(oldPath)) return res.status(404).send('File nahi mili');
  if (!newName) return res.status(400).send('Naya naam likho');

  fs.renameSync(oldPath, newPath);
  
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    return res.redirect('/');
  }
  res.json({ message: 'Updated', oldName, newName });
};

module.exports = { getFiles, createFile, deleteFile, updateFile };