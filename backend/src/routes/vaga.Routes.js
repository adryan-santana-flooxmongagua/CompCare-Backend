const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  createVaga,
  listarVagas,
  editarVaga,
  deletarVaga,
  listarVagasComConfirmados,
} = require("../controllers/vagaController");

// Cria a pasta uploads se não existir
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();

    // Nome original do arquivo sem extensão
    const nameWithoutExt = path.parse(file.originalname).name;

    // Extensão original (ex: .jpg, .png)
    const ext = path.extname(file.originalname);

    // Sanitiza o nome removendo acentos e caracteres especiais
    const sanitized = nameWithoutExt
      .normalize("NFD")                     // separa letras de acentos
      .replace(/[\u0300-\u036f]/g, "")     // remove acentos
      .replace(/[^a-zA-Z0-9_-]/g, "")      // remove caracteres especiais
      .toLowerCase();                      // tudo minúsculo (opcional)

    cb(null, `${timestamp}_${sanitized}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo inválido.'));
    }
  }
});

// Rotas
router.post("/vagas", upload.single("image"), createVaga);
router.get("/vagas", listarVagas);
router.put("/vagas/:id", upload.single("image"), editarVaga);
router.delete("/vagas/:id", deletarVaga);
router.get('/com-confirmados', listarVagasComConfirmados);

module.exports = router;
