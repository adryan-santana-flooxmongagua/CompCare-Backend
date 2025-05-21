const Candidatura = require("../models/Candidatura");
const Task = require("../models/task");
const Vaga = require("../models/Vaga");
const crypto = require("crypto");

// POST - Cria uma nova vaga
const createVaga = async (req, res) => {
  try {
    const {
      titulodavaga, descricao, tipo_vaga,
      vl_pontos, id_hospital, status, qtd_vagas
    } = req.body;

    const novaVaga = new Vaga({
      titulodavaga,
      descricao,
      tipo_vaga,
      vl_pontos: Number(vl_pontos),
      id_hospital,
      status,
      qtd_vagas: Number(qtd_vagas),
      iddavaga: crypto.randomUUID(),
      imageUrl: "", // Opcional: pode ser removido se o campo não for mais necessário no schema
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


const listarVagasComConfirmados = async (req, res) => {
  try {
    // Encontra todos os IDs de vagas com pelo menos um candidato confirmado
    const confirmadas = await Candidatura.find({ status: "confirmado" }).distinct("vagaId");

    // Busca vagas que têm pelo menos um confirmado
    const vagas = await Vaga.find({ _id: { $in: confirmadas } }).sort({ createdAt: -1 });

    res.status(200).json(vagas);
  } catch (error) {
    console.error("Erro ao listar vagas com confirmados:", error);
    res.status(500).json({ error: "Erro ao listar vagas com confirmados" });
  }
};


module.exports = {
  createVaga,
  listarVagas,
  editarVaga,
  deletarVaga,
  listarVagasComConfirmados,
};
