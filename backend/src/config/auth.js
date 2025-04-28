const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../api/user/userModel');
const env = require('../../env_file');

const generateToken = (user) => {
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  return jwt.sign(payload, env.authSecret, { expiresIn: '7d' });
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).send({ errors: ['Usuário já registrado.'] });

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).send({ message: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    res.status(500).send({ errors: ['Erro ao cadastrar usuário.'] });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ errors: ['Usuário não encontrado.'] });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).send({ errors: ['Senha inválida.'] });

    const token = generateToken(user);
    res.send({ user: { name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    res.status(500).send({ errors: ['Erro no login.'] });
  }
};

const validateToken = (req, res) => {
  const token = req.body.token || '';

  jwt.verify(token, env.authSecret, (err, decoded) => {
    return res.status(200).send({ valid: !err });
  });
};

module.exports = { signup, login, validateToken };
