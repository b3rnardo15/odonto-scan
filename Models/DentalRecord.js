// models/DentalRecord.js
const mongoose = require('mongoose');

const dentalRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  recordDate: {
    type: Date,
    default: Date.now
  },
  // Odontograma como objeto JSON
  odontogram: {
    type: Map,
    of: {
      status: String,
      treatments: [String],
      notes: String
    }
  },
  notes: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const DentalRecord = mongoose.model('DentalRecord', dentalRecordSchema);
module.exports = DentalRecord;