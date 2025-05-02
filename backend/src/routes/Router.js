const express = require("express");
const router = express.Router(); 

const vagaRoutes = require("./vagaRoutes");

// test route
router.get("/", (req, res) => {
  res.send("API Working!");
});

// usar as rotas de vagas
router.use("/", vagaRoutes);

module.exports = router;
