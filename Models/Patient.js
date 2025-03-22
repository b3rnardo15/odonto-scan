// models/Patient.js
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String // pode ser null para não identificados
  },
  identifierCode: {
    type: String,
    required: true,
    unique: true
  },
  isIdentified: {
    type: Boolean,
    default: false
  },
  gender: {
    type: String
  },
  estimatedAgeMin: {
    type: Number
  },
  estimatedAgeMax: {
    type: Number
  },
  exactAge: {
    type: Number
  },
  additionalInfo: {
    type: String
  },
  dentalRecords: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DentalRecord'
  }]
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;