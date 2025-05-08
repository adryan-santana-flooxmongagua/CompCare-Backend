const express = require('express');
const router = express.Router();
const {
  criarCandidatura,
  listarMinhasCandidaturas,
  aprovarCandidatura,
  listarPendentes,
  recusarCandidatura,
  confirmarParticipacao,
  excluirCandidatura,
  listarConfirmados,
} = require('../controllers/candidaturaController');
const { autenticarUsuario, verificarAdmin } = require('../middleware/authMiddleware');


router.post('/', autenticarUsuario, criarCandidatura);

router.get('/minhas', autenticarUsuario, listarMinhasCandidaturas);

// Listar candidaturas pendentes (apenas admins)
router.get('/pendentes', autenticarUsuario, verificarAdmin, listarPendentes);

// Aprovar uma candidatura (apenas admins)
router.patch('/aprovar/:id', autenticarUsuario, verificarAdmin, aprovarCandidatura);

// Recusar uma candidatura (apenas admins)
router.patch('/recusar/:id', autenticarUsuario, verificarAdmin, recusarCandidatura);

// Confirmar participação (usuário comum)
router.patch('/confirmar/:id', autenticarUsuario, confirmarParticipacao);

// Excluir candidatura recusada (usuário comum)
router.delete('/:id', autenticarUsuario, excluirCandidatura);

// Listar candidatos confirmados (somente admins)
router.get('/confirmados', autenticarUsuario, verificarAdmin, listarConfirmados);

module.exports = router;
