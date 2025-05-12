const express = require('express');
const router = express.Router();
const { autenticarUsuario, verificarAdmin } = require('../middleware/authMiddleware');
const { listarUsuarios, deletarUsuario } = require('../controllers/userController');

// Listar e deletar usuários — apenas para admins
router.get('/', autenticarUsuario, verificarAdmin, listarUsuarios);
router.delete('/:id', autenticarUsuario, verificarAdmin, deletarUsuario);

module.exports = router;
