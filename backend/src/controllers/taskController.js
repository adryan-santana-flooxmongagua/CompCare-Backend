const Task = require('../models/task');
const Candidatura = require('../models/Candidatura');

exports.criarTarefa = async (req, res) => {
  const { vagaId, descricao, frequencia } = req.body;

  try {
    // Busca voluntários confirmados para a vaga
    const confirmados = await Candidatura.find({ vagaId, status: 'confirmado' });

    if (!confirmados.length) {
      return res.status(400).json({ message: 'Nenhum voluntário confirmado para esta vaga.' });
    }

    const atribuicoes = confirmados.map(c => ({
      userId: c.userId,
    }));

    const novaTarefa = new Task({
      vagaId,
      descricao,
      frequencia,
      atribuicoes,
    });

    await novaTarefa.save();

    res.status(201).json({ message: 'Tarefa criada com sucesso.', tarefa: novaTarefa });
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(500).json({ message: 'Erro ao criar tarefa.' });
  }
};

exports.listarTarefasPorVaga = async (req, res) => {
  try {
    const { vagaId } = req.params;
    const tarefas = await Task.find({ vagaId }).populate('atribuicoes.userId', 'name email');
    res.json(tarefas);
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    res.status(500).json({ message: 'Erro ao buscar tarefas.' });
  }
};
