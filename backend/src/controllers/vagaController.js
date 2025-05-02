const Vaga = require("../models/Vaga");
const crypto = require("crypto");

// POST - Criar nova vaga
const createVaga = async (req, res) => {
  try {
    const {
      titulodavaga, descricao, tipo_vaga,
      vl_pontos, id_hospital, status, qtd_vagas
    } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const novaVaga = new Vaga({
      titulodavaga,
      descricao,
      tipo_vaga,
      vl_pontos: Number(vl_pontos),
      id_hospital,
      status,
      qtd_vagas: Number(qtd_vagas),
      iddavaga: crypto.randomUUID(),
      imageUrl,
    });

    await novaVaga.save();
    res.status(201).json({ message: "Vaga criada com sucesso", vaga: novaVaga });
  } catch (error) {
    console.error("Erro ao criar vaga:", error);
    res.status(500).json({ error: "Erro ao criar vaga" });
  }
};

// GET - Listar todas as vagas
const listarVagas = async (req, res) => {
  try {
    const vagas = await Vaga.find().sort({ createdAt: -1 });
    res.status(200).json(vagas);
  } catch (error) {
    console.error("Erro ao listar vagas:", error);
    res.status(500).json({ error: "Erro ao listar vagas" });
  }
};

// PUT - Editar vaga por ID
const editarVaga = async (req, res) => {
  try {
    const vagaId = req.params.id;
    const updateData = req.body;

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const vagaAtualizada = await Vaga.findByIdAndUpdate(vagaId, updateData, { new: true });

    if (!vagaAtualizada) {
      return res.status(404).json({ error: "Vaga não encontrada" });
    }

    res.status(200).json({ message: "Vaga atualizada com sucesso", vaga: vagaAtualizada });
  } catch (error) {
    console.error("Erro ao editar vaga:", error);
    res.status(500).json({ error: "Erro ao editar vaga" });
  }
};

module.exports = {
  createVaga,
  listarVagas,
  editarVaga
};
