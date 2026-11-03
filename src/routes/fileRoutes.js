const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { getFiles, createFile, deleteFile, updateFile } = require('../controllers/fileController');

router.get('/', getFiles);
router.post('/', upload.single('file'), createFile);
router.delete('/:filename', deleteFile);
router.put('/:filename', updateFile); // UPDATE wala

module.exports = router;