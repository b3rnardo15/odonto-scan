// models/Case.js
const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['em_andamento', 'finalizado', 'arquivado'],
    default: 'em_andamento'
  },
  caseType: {
    type: String,
    required: true // acidente, identificação, etc.
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  patients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  }],
  evidences: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evidence'
  }],
  reports: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report'
  }]
}, { timestamps: true });

const Case = mongoose.model('Case', caseSchema);
module.exports = Case;