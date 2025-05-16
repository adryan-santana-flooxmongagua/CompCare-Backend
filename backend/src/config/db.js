require("dotenv").config();
const mongoose = require("mongoose");

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const localUri = "mongodb://localhost:27017/compcare";
const remoteUri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.iek65xy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const conn = async () => {
    try {
        // Tenta conexão local primeiro
        const localConn = await mongoose.connect(localUri);
        console.log("Conectado ao banco: local");
        return localConn;
    } catch (localError) {
        console.warn("Falha ao conectar ao MongoDB local. Tentando remoto...");

        try {
            const remoteConn = await mongoose.connect(remoteUri);
            console.log("Conectado ao banco: remoto (Atlas)");
            return remoteConn;
        } catch (remoteError) {
            console.error("Falha ao conectar ao MongoDB remoto também.");
            console.error(remoteError);
        }
    }
};

conn();

module.exports = conn;
