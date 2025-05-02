const mongoose = require("mongoose");

const VagaSchema = new mongoose.Schema({
  titulodavaga: { type: String, required: true },
  descricao: { type: String, required: true },
  tipo_vaga: { type: String, required: true },
  vl_pontos: { type: Number, required: true },
  id_hospital: { type: String, required: true },
  status: { type: String, default: "ativa" },
  qtd_vagas: { type: Number, required: true },
  iddavaga: { type: String, required: true, unique: true },
  imageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Vaga", VagaSchema);
