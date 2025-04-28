const admin = require('../services/firebaseAdmin');

// Valida se o token do Firebase é verdadeiro
const validateFirebaseToken = async (req, res) => {
  const token = req.body.token || '';

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return res.status(200).send({ valid: true, uid: decoded.uid, email: decoded.email });
  } catch (error) {
    console.error('Erro ao validar token:', error);
    return res.status(401).send({ valid: false });
  }
};

module.exports = { validateFirebaseToken };
