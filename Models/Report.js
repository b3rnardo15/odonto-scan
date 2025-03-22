// models/Report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  templateUsed: {
    type: String
  },
  status: {
    type: String,
    enum: ['rascunho', 'finalizado', 'aprovado'],
    default: 'rascunho'
  },
  pdfPath: {
    type: String
  },
  signatures: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    signedAt: {
      type: Date,
      default: Date.now
    },
    signatureHash: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;