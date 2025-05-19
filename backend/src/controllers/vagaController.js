const Candidatura = require("../models/Candidatura");
const Task = require("../models/task");
const Vaga = require("../models/Vaga");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// POST - Cria uma nova vaga
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

// GET - Lista todas as vagas
const listarVagas = async (req, res) => {
  try {
    const vagas = await Vaga.find().sort({ createdAt: -1 });
    res.status(200).json(vagas);
  } catch (error) {
    console.error("Erro ao listar vagas:", error);
    res.status(500).json({ error: "Erro ao listar vagas" });
  }
};

// PUT - Edita uma vaga pelo ID
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

// DELETE - Remove uma vaga e seus dados relacionados
const deletarVaga = async (req, res) => {
  try {
    const vagaId = req.params.id;

    const vaga = await Vaga.findById(vagaId);
    if (!vaga) {
      return res.status(404).json({ message: "Vaga não encontrada." });
    }

    // Remove imagem associada (se existir)
    if (vaga.imageUrl) {
      const imagePath = path.join(__dirname, "../../", vaga.imageUrl);
      fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (!err) {
          fs.unlink(imagePath, (err) => {
            if (err) console.warn("Erro ao excluir imagem:", err.message);
          });
        }
      });
    }

    // Remove candidaturas e tarefas vinculadas
    await Candidatura.deleteMany({ vagaId: vaga._id });
    await Task.deleteMany({ vagaId: vaga._id });

    // Remove a vaga
    await Vaga.findByIdAndDelete(vagaId);

    res.status(200).json({ message: "Vaga excluída com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir vaga:", error);
    res.status(500).json({ message: "Erro ao excluir a vaga." });
  }
};

module.exports = {
  createVaga,
  listarVagas,
  editarVaga,
  deletarVaga,
};
