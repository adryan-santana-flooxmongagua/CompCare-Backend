const mongoose = require('mongoose');
const Candidatura = require('../models/Candidatura');

// Criar uma candidatura
exports.criarCandidatura = async (req, res) => {
  const { vagaId } = req.body;
  const userId = req.user.id; // do token JWT

  try {
    // Verifica se já existe
    const existente = await Candidatura.findOne({ vagaId, userId });
    if (existente) {
      return res.status(400).json({ message: 'Você já se candidatou a esta vaga.' });
    }

    const novaCandidatura = new Candidatura({ vagaId, userId });
    await novaCandidatura.save();

    res.status(201).json({ message: 'Candidatura enviada com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao enviar candidatura.' });
  }
};

// Listar candidaturas do usuário logado
exports.listarMinhasCandidaturas = async (req, res) => {
  try {
    const candidaturas = await Candidatura.find({ userId: req.user._id }).populate('vagaId');

    const resultado = candidaturas.map(c => ({
      _id: c._id,
      status: c.status,
      vagaId: c.vagaId?._id,
      vaga: {
        titulodavaga: c.vagaId?.titulodavaga,
        descricao: c.vagaId?.descricao,
      },
    }));

    res.json(resultado);
  } catch (error) {
    console.error('Erro ao buscar candidaturas do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar candidaturas.' });
  }
};

// Aprovar uma candidatura
exports.aprovarCandidatura = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido.' });
  }

  try {
    const candidatura = await Candidatura.findByIdAndUpdate(
      id,
      { status: 'aprovado' },
      { new: true }
    );

    if (!candidatura) {
      return res.status(404).json({ message: 'Candidatura não encontrada.' });
    }

    res.json({ message: 'Candidatura aprovada com sucesso.', candidatura });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao aprovar candidatura.' });
  }
};

// Recusar uma candidatura
exports.recusarCandidatura = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido.' });
  }

  try {
    const candidatura = await Candidatura.findByIdAndUpdate(
      id,
      { status: 'recusada', updatedAt: new Date() },
      { new: true }
    );

    if (!candidatura) {
      return res.status(404).json({ message: 'Candidatura não encontrada.' });
    }

    res.json({ message: 'Candidatura recusada com sucesso.', candidatura });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao recusar candidatura.' });
  }
};

// Listar candidaturas com status "pendente"
exports.listarPendentes = async (req, res) => {
  try {
    const pendentes = await Candidatura.find({ status: 'pendente' }).populate('userId vagaId');
    res.json(pendentes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar candidaturas pendentes.' });
  }
};

// Confirmar participação após aprovação e atribuir pontos
exports.confirmarParticipacao = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido.' });
  }

  try {
    const candidatura = await Candidatura.findOne({ _id: id, userId: req.user.id });

    if (!candidatura) {
      return res.status(404).json({ message: 'Candidatura não encontrada.' });
    }

    if (candidatura.status !== 'aprovado') {
      return res.status(400).json({ message: 'Apenas candidaturas aceitas podem ser confirmadas.' });
    }

    // Buscar a vaga para pegar os pontos
    const Vaga = require('../models/Vaga');
    const vaga = await Vaga.findById(candidatura.vagaId);
    if (!vaga) {
      return res.status(404).json({ message: 'Vaga não encontrada.' });
    }

    // Atualizar o status da candidatura
    candidatura.status = 'confirmado';
    candidatura.updatedAt = new Date();
    await candidatura.save();

    // Atribuir os pontos ao usuário
    const User = require('../models/User');
    const usuario = await User.findById(req.user.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    usuario.pontos = (usuario.pontos || 0) + vaga.vl_pontos;
    await usuario.save();

    res.json({
      message: 'Participação confirmada e pontos atribuídos com sucesso.',
      candidatura,
      pontosTotais: usuario.pontos
    });

  } catch (error) {
    console.error('Erro ao confirmar participação:', error);
    res.status(500).json({ message: 'Erro ao confirmar participação.' });
  }
};


// Excluir candidatura recusada
exports.excluirCandidatura = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido.' });
  }

  try {
    const candidatura = await Candidatura.findById(id);

    if (!candidatura) {
      return res.status(404).json({ message: 'Candidatura não encontrada.' });
    }

    if (candidatura.status !== 'recusada') {
      return res.status(400).json({ message: 'Apenas candidaturas recusadas podem ser excluídas.' });
    }

    await Candidatura.findByIdAndDelete(id);

    res.json({ message: 'Candidatura excluída com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir candidatura:', error);
    res.status(500).json({ message: 'Erro ao excluir candidatura.' });
  }
};

// Listar candidatos com status "confirmado"
exports.listarConfirmados = async (req, res) => {
  try {
    const confirmados = await Candidatura.find({ status: "confirmado" })
      .populate("userId", "name email")
      .populate("vagaId", "titulodavaga tipo_vaga")
      .sort({ updatedAt: -1 });

    const confirmadosValidos = confirmados.filter(c => c.userId);

    const resultado = confirmadosValidos.map((c) => ({
      nome: c.userId.name,
      email: c.userId.email,
      vaga: c.vagaId?.titulodavaga || "Não informado",
      fonte: c.vagaId?.tipo_vaga || "Tipo não informado",
      timestamp: c.updatedAt,
      erros: c.erros || 0,
    }));

    res.json(resultado);
  } catch (error) {
    console.error("Erro ao buscar candidatos confirmados:", error);
    res.status(500).json({ message: "Erro ao buscar candidatos confirmados." });
  }
};
