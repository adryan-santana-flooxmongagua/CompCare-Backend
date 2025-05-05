const User = require('../models/User');
const mongoose = require('mongoose');

// Listar usuários (sem retornar a senha)
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find({ role: 'volunteer' }, '-password');
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

// Deletar usuário por ID
exports.deletarUsuario = async (req, res) => {
  const { id } = req.params;

  // Checar se o ID é válido
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    // Verificar se o usuário está tentando excluir a si mesmo
    if (req.user._id.toString() === id) {
      return res.status(403).json({ error: 'Você não pode excluir seu próprio usuário.' });
    }

    const usuario = await User.findByIdAndDelete(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ message: 'Usuário deletado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
};
