const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('CompCare API rodando!');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
