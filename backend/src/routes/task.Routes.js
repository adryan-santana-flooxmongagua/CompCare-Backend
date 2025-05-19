const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { autenticarUsuario } = require('../middleware/authMiddleware');

router.post('/criar', autenticarUsuario, taskController.criarTarefa);
router.get('/vaga/:vagaId', autenticarUsuario, taskController.listarTarefasPorVaga);
router.get('/minhas', autenticarUsuario, taskController.listarMinhasTarefas);
router.patch('/:id/concluir', autenticarUsuario, taskController.concluirTarefa);

module.exports = router;
