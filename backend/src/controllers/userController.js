const User = require('../models/User');
const Candidatura = require("../models/Candidatura");
const mongoose = require('mongoose');

// Lista todos os usuários (sem senha)
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find({}, '-password');
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

// Deleta um usuário por ID
exports.deletarUsuario = async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    // Impede autoexclusão
    if (req.user._id.toString() === id) {
      return res.status(403).json({ error: 'Você não pode excluir seu próprio usuário.' });
    }

    const usuario = await User.findByIdAndDelete(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Remove candidaturas vinculadas
    await Candidatura.deleteMany({ userId: id });

    res.json({ message: 'Usuário deletado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
};
