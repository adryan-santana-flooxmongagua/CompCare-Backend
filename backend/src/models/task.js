const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  vagaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vaga',
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  frequencia: {
    type: String,
    enum: ['diaria', 'semanal', 'mensal'],
    default: 'diaria',
  },
  atribuicoes: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: { type: String, enum: ['pendente', 'concluida'], default: 'pendente' },
      createdAt: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
