const express = require('express');
const cors = require('cors');

const hospitaisRoutes = require('../src/routes/hospital');
const testRoutes = require('../src/routes/test');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas

app.use("/hospitais", hospitaisRoutes);
app.use("/", testRoutes);

module.exports = app;
