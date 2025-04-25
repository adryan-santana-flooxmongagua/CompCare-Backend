const express = require('express');
const router = express.Router();

router.get('/teste', (req, res) => {
  res.json({ mensagem: 'Rota de teste funcionando!' });
});

module.exports = router;
