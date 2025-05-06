const mongoose = require('mongoose');

const CandidaturaSchema = new mongoose.Schema({
  vagaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vaga',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pendente', 'aceita', 'recusada'],
    default: 'pendente',
  },
}, { timestamps: true });

module.exports = mongoose.model('Candidatura', CandidaturaSchema);
