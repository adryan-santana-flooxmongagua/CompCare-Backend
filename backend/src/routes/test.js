const express = require("express");
const router = express.Router();
const { db } = require("../firebase/admin"); // importa a instância do Firestore

// Rota de teste para verificar conexão com Firebase
router.get("/ping", async (req, res) => {
  try {
    const testDoc = await db.collection("test").doc("ping").get();

    if (!testDoc.exists) {
      res.status(200).json({ message: "🔥 Firebase conectado, mas documento não existe." });
    } else {
      res.status(200).json({ message: "✅ Firebase funcionando!", data: testDoc.data() });
    }
  } catch (err) {
    console.error("Erro ao conectar com Firebase:", err);
    res.status(500).json({ message: "❌ Erro ao conectar com Firebase", error: err.message });
  }
});

module.exports = router;
