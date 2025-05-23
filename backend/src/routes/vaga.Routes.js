const express = require("express");
const router = express.Router();

const {
  createVaga,
  listarVagas,
  editarVaga,
  deletarVaga,
  listarVagasComConfirmados,
} = require("../controllers/vagaController");

// Rotas (sem upload de imagem)
router.post("/vagas", createVaga);
router.get("/vagas", listarVagas);
router.put("/vagas/:id", editarVaga);
router.delete("/vagas/:id", deletarVaga);
router.get('/com-confirmados', listarVagasComConfirmados);

module.exports = router;
