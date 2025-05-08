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
    enum: ['pendente', 'aprovado', 'recusada', 'confirmado'],
    default: 'pendente',
  },
  erros: {
    type: Number,
    default: 0,
  },
  
}, { timestamps: true });

module.exports = mongoose.model('Candidatura', CandidaturaSchema);
