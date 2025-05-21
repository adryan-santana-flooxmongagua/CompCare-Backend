require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const port = process.env.PORT || 5000;
const app = express();

// Configurar JSON e formulário
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS com variável de ambiente
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:3000';
app.use(cors({ credentials: true, origin: allowedOrigin }));



app.use('/public', express.static(path.resolve(__dirname, 'public')));



// Conexão com o banco
require('./src/config/db.js');

// Rotas
const router = require('./src/routes/Router.js');
app.use('/api', router);

// Iniciar servidor
app.listen(port, () => {
  console.log(`App rodando na porta ${port}`);
});
