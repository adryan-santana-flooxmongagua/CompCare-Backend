const express = require('express');
const router = express.Router();

const vagaRoutes = require('./vagaRoutes');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const candidaturaRoutes = require('./candidaturaRoutes');

// Rota de teste
router.get('/', (req, res) => {
  res.send('API Working!');
});

// Outras rotas
router.use('/vagas', vagaRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/candidaturas', candidaturaRoutes);

module.exports = router;
