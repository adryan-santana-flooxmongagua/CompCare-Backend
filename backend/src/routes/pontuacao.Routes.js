const express = require('express');
const router = express.Router();
const { getPontuacao, adicionarPontuacao, getRanking } = require('../controllers/pontuacaoController');
const { autenticarUsuario } = require('../middleware/authMiddleware');

// Pontuação de um usuário específico
router.get('/:userId', autenticarUsuario, getPontuacao);

// Adiciona pontos a um usuário
router.patch('/:userId/add', autenticarUsuario, adicionarPontuacao);

// Retorna o ranking geral de voluntários
router.get('/ranking/all', getRanking);

module.exports = router;
