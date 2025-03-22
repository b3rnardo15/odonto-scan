// config/multer.js - Configuração para upload de arquivos
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Armazenamento no disco
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    // Gerar nome único para o arquivo
    crypto.randomBytes(16, (err, buf) => {
      if (err) return cb(err);
      
      const filename = buf.toString('hex') + path.extname(file.originalname);
      cb(null, filename);
    });
  }
});

// Filtro de arquivos
const fileFilter = (req, file, cb) => {
  // Verificar tipos de arquivo aceitos
  const fileTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  const mimetype = fileTypes.test(file.mimetype);
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  
  if (mimetype && extname) {
    return cb(null, true);
  }
  
  cb(new Error('Tipo de arquivo não suportado'));
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter
});

module.exports = upload;

// Alternative GridFS Storage for MongoDB
const { GridFsStorage } = require('multer-gridfs-storage');

// Create GridFS storage
const gridFsStorage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads' // Nome da coleção no MongoDB
        };
        resolve(fileInfo);
      });
    });
  }
});

exports.uploadGridFS = multer({ storage: gridFsStorage });