const { admin } = require("../firebase/admin");

async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) return res.status(401).send("Token ausente");

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).send("Token inválido");
  }
}

module.exports = verifyToken;
