const User = require('../models/User');

// GET: /pontuacao/:userId
const getPontuacao = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('pontuacao nome');

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({ nome: user.nome, pontuacao: user.pontuacao || 0 });
  } catch (error) {
    console.error('Erro ao obter pontuação:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// PATCH: /pontuacao/:userId/add
const adicionarPontuacao = async (req, res) => {
  try {
    const { userId } = req.params;
    const { pontos } = req.body;

    if (!pontos || typeof pontos !== 'number') {
      return res.status(400).json({ message: 'Pontos inválidos' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    user.pontuacao = (user.pontuacao || 0) + pontos;
    await user.save();

    res.json({ message: 'Pontuação atualizada', pontuacao: user.pontuacao });
  } catch (error) {
    console.error('Erro ao atualizar pontuação:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

module.exports = {
  getPontuacao,
  adicionarPontuacao,
};
