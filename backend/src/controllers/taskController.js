const Task = require('../models/task');
const User = require('../models/User');
const Candidatura = require('../models/Candidatura');

exports.criarTarefa = async (req, res) => {
  const { vagaId, descricao, frequencia } = req.body;

  try {
    const confirmados = await Candidatura.find({ vagaId, status: 'confirmado' });

    if (!confirmados.length) {
      return res.status(400).json({ message: 'Nenhum voluntário confirmado para esta vaga.' });
    }

    const atribuicoes = confirmados.map(c => ({
      userId: c.userId,
      status: 'pendente'
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

    const candidaturasConfirmadas = await Candidatura.find({ userId, status: 'confirmado' });
    const vagaIdsConfirmadas = candidaturasConfirmadas.map(c => c.vagaId);

    const tarefas = await Task.find({ vagaId: { $in: vagaIdsConfirmadas } });

    const tarefasAtualizadas = await Promise.all(
      tarefas.map(async tarefa => {
        const jaAtribuido = tarefa.atribuicoes.some(a => a.userId.toString() === userId.toString());

        if (!jaAtribuido) {
          tarefa.atribuicoes.push({ userId, status: 'pendente' });
          await tarefa.save();
        }

        return tarefa;
      })
    );

    const tarefasCompletas = await Task.find({
      vagaId: { $in: vagaIdsConfirmadas },
      "atribuicoes.userId": userId
    })
      .populate("vagaId")
      .populate("atribuicoes.userId", "name email");

    res.json(tarefasCompletas);
  } catch (error) {
    console.error("Erro ao buscar suas tarefas:", error);
    res.status(500).json({ message: "Erro ao buscar suas tarefas." });
  }
};

exports.concluirTarefa = async (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;

  try {
    console.log("Tentando concluir tarefa:", taskId, "por usuário:", userId);

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Tarefa não encontrada" });

    const atribuicao = task.atribuicoes.find(
      (a) => a.userId.toString() === userId.toString()
    );

    if (!atribuicao) {
      return res.status(403).json({ message: "Você não está atribuído a esta tarefa" });
    }

    if (atribuicao.status === "concluida") {
      return res.status(400).json({ message: "Tarefa já concluída anteriormente" });
    }

    atribuicao.status = "concluida";
    await task.save();

    let pontos = 15;
    if (task.frequencia === 'diaria') pontos = 15;
    else if (task.frequencia === 'semanal') pontos = 20;
    else if (task.frequencia === 'mensal') pontos = 25;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    user.pontos = (user.pontos || 0) + pontos;
    await user.save();

    res.json({
      message: `Tarefa marcada como concluída. ${pontos} pontos adicionados ao seu perfil.`,
      pontosAtuais: user.pontos
    });

  } catch (err) {
    console.error("Erro ao concluir tarefa:", err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

exports.deletarTarefa = async (req, res) => {
  const { id } = req.params;

  try {
    const tarefa = await Task.findByIdAndDelete(id);

    if (!tarefa) {
      return res.status(404).json({ message: "Tarefa não encontrada" });
    }

    res.json({ message: "Tarefa excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error);
    res.status(500).json({ message: "Erro ao excluir tarefa" });
  }
};
