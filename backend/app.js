require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const port = process.env.PORT || 5000;

const app = express();

// Configurar JSON e formulário
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conexão com o banco
require('./src/config/db.js');

// Rotas
const router = require('./src/routes/Router.js');
app.use('/api', router);

// Iniciar servidor
app.listen(port, () => {
  console.log(`App rodando na porta ${port}`);
});
