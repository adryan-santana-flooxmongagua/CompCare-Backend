const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  endereco: { type: String },
  telefone: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Hospital', hospitalSchema);
