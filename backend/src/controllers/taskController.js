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


exports.listarMinhasTarefas = async (req, res) => {
  try {
    const userId = req.user.id;

    const tarefas = await Task.find({ "atribuicoes.userId": userId })
      .populate("vagaId")
      .populate("atribuicoes.userId", "name email");

    res.json(tarefas);
  } catch (error) {
    console.error("Erro ao buscar suas tarefas:", error);
    res.status(500).json({ message: "Erro ao buscar suas tarefas." });
  }
};


exports.concluirTarefa = async (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Tarefa não encontrada" });

    const atribuicao = task.atribuicoes.find(
      (a) => a.userId.toString() === userId
    );

    if (!atribuicao) {
      return res.status(403).json({ message: "Você não está atribuído a esta tarefa" });
    }

    atribuicao.status = "concluida";
    await task.save();

    res.json({ message: "Tarefa marcada como concluída com sucesso" });
  } catch (err) {
    console.error("Erro ao concluir tarefa:", err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};
