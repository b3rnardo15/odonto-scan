// models/Evidence.js
const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  category: {
    type: String,
    required: true // radiografia, foto, documento, etc.
  },
  filePath: {
    type: String // URL ou caminho para o arquivo
  },
  fileType: {
    type: String // MIME type
  },
  fileSize: {
    type: Number
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Evidence = mongoose.model('Evidence', evidenceSchema);
module.exports = Evidence;