const express = require('express');
const router = express.Router();

const vagaRoutes = require('./vaga.Routes');
const authRoutes = require('./auth.Routes');
const userRoutes = require('./user.Routes');
const candidaturaRoutes = require('./candidatura.Routes');
const taskRoutes = require('./task.Routes');

// Rota de teste
router.get('/', (req, res) => {
  res.send('API Working!');
});

// Outras rotas
router.use('/vagas', vagaRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/candidaturas', candidaturaRoutes);
router.use('/tasks', taskRoutes);


module.exports = router;
