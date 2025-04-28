const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'O nome é obrigatório.']
  },
  email: {
    type: String,
    required: [true, 'O e-mail é obrigatório.'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'A senha é obrigatória.']
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: false // só se o usuário estiver associado a um hospital
  },
  role: {
    type: String,
    enum: ['voluntario', 'admin_hospital', 'admin_plataforma'],
    default: 'voluntario'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Antes de salvar o usuário, criptografa a senha
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compara senha digitada com a senha criptografada
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
