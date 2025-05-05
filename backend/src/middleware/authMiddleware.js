require('dotenv').config(); // Garante que as variáveis do .env sejam carregadas
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'seuSegredoAqui';

// Middleware para verificar se o usuário está autenticado (qualquer tipo)
const autenticarUsuario = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Token não encontrado. Acesso negado.' });
  }

  try {
    // Verifica se o token é válido
    const decoded = jwt.verify(token, JWT_SECRET);

    // Busca o usuário com base no ID presente no token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    req.user = user; // Adiciona o usuário à requisição para uso posterior
    next();
  } catch (error) {
    console.error('Erro ao verificar token:', error.message);
    return res.status(401).json({ message: 'Token inválido. Acesso negado.' });
  }
};

// Middleware para verificar se o usuário é admin
const verificarAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
  }
  next();
};

module.exports = {
  autenticarUsuario,
  verificarAdmin,
};
