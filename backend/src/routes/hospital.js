const express = require("express");
const router = express.Router();
const { db } = require("../firebase/admin");

// Rota GET para listar hospitais
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("hospitais").get();
    const hospitais = [];

    snapshot.forEach(doc => {
      hospitais.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(hospitais);
  } catch (err) {
    console.error("Erro ao buscar hospitais:", err);
    res.status(500).json({ message: "Erro ao buscar hospitais", error: err.message });
  }
});

module.exports = router;
