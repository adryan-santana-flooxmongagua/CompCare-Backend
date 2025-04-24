const { db } = require('./admin');

async function testFirestore() {
  try {
    const snapshot = await db.collection("testes").add({ createdAt: new Date() });
    console.log("Firestore funcionando! Doc ID:", snapshot.id);
  } catch (error) {
    console.error("Erro ao conectar com Firestore:", error);
  }
}

testFirestore();
