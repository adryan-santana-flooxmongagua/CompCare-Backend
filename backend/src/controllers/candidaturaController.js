const mongoose = require('mongoose');
const Candidatura = require('../models/Candidatura');

exports.criarCandidatura = async (req, res) => {
  const { vagaId } = req.body;
  const userId = req.user.id; // extraído do token JWT

  try {
    // Verifica duplicidade
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

exports.listarMinhasCandidaturas = async (req, res) => {
    try {
      const candidaturas = await Candidatura.find({ userId: req.user._id }).populate('vagaId');
  
      const resultado = candidaturas.map(c => ({
        _id: c._id,
        status: c.status,
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
      { status: 'aprovado', updatedAt: new Date() },
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

// Listar todas as candidaturas pendentes
exports.listarPendentes = async (req, res) => {
  try {
    const pendentes = await Candidatura.find({ status: 'pendente' }).populate('userId vagaId');
    res.json(pendentes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar candidaturas pendentes.' });
  }
};