const User = require('../models/User');

/**
 * Retorna a pontuação e nome de um usuário específico.
 */
const getPontuacao = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('pontos name');

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({ nome: user.name, pontuacao: user.pontos || 0 });
  } catch (error) {
    console.error('Erro ao obter pontuação:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Adiciona pontos à pontuação de um usuário.
 */
const adicionarPontuacao = async (req, res) => {
  try {
    const { userId } = req.params;
    const { pontos } = req.body;

    if (typeof pontos !== 'number') {
      return res.status(400).json({ message: 'Pontos inválidos' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    user.pontos = (user.pontos || 0) + pontos;
    await user.save();

    res.json({ message: 'Pontuação atualizada', pontuacao: user.pontos });
  } catch (error) {
    console.error('Erro ao atualizar pontuação:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Retorna o ranking de voluntários ordenado pela pontuação (maior para menor).
 */
const getRanking = async (req, res) => {
  try {
    const ranking = await User.find({ role: 'volunteer' })
      .select('name pontos')
      .sort({ pontos: -1 });

    res.json(ranking);
  } catch (error) {
    console.error('Erro ao obter ranking:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

module.exports = {
  getPontuacao,
  adicionarPontuacao,
  getRanking,
};
