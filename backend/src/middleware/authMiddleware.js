require('dotenv').config(); // Carrega variáveis de ambiente do .env
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'seuSegredoAqui';

// Middleware - Verifica se o usuário está autenticado (qualquer tipo)
const autenticarUsuario = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Token não encontrado. Acesso negado.' });
  }

  try {
    // Decodifica o token e valida com a chave secreta
    const decoded = jwt.verify(token, JWT_SECRET);

    // Busca o usuário no banco de dados
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Anexa o usuário à requisição
    req.user = user;
    next();
  } catch (error) {
    console.error('Erro ao verificar token:', error.message);
    return res.status(401).json({ message: 'Token inválido. Acesso negado.' });
  }
};

// Middleware - Verifica se o usuário autenticado é um administrador
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
