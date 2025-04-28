const auth = require('./auth');
const openApi = require('../api/common/openApi');

module.exports = (server) => {
  // Apenas rotas públicas
  server.post('/validateFirebaseToken', auth.validateFirebaseToken);

  openApi.publishRoutes(server);

 //adicionar Rotas protegidas 
};
