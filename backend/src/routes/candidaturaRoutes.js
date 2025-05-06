const express = require('express');
const router = express.Router();
const {
  criarCandidatura,
  listarMinhasCandidaturas,
  aprovarCandidatura,
  listarPendentes
} = require('../controllers/candidaturaController');
const { autenticarUsuario, verificarAdmin } = require('../middleware/authMiddleware');


router.post('/', autenticarUsuario, criarCandidatura);

router.get('/minhas', autenticarUsuario, listarMinhasCandidaturas);

// Listar candidaturas pendentes (apenas admins)
router.get('/pendentes', autenticarUsuario, verificarAdmin, listarPendentes);

// Aprovar uma candidatura (apenas admins)
router.patch('/aprovar/:id', autenticarUsuario, verificarAdmin, aprovarCandidatura);

module.exports = router;
