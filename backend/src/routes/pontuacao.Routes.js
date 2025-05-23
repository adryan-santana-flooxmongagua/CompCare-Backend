const express = require('express');
const router = express.Router();
const { getPontuacao, adicionarPontuacao } = require('../controllers/pontuacaoController');
const { autenticarUsuario } = require('../middleware/authMiddleware');

router.get('/:userId', autenticarUsuario, getPontuacao);
router.patch('/:userId/add', autenticarUsuario, adicionarPontuacao);

module.exports = router;
