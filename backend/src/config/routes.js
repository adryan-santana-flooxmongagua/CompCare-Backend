const auth = require('./auth');
const openApi = require('../api/common/openApi');

module.exports = (server) => {
  // Rotas abertas
  server.post('/signup', auth.signup);
  server.post('/login', auth.login);
  server.post('/validateToken', auth.validateToken);


  openApi.publishRoutes(server);

  // Rotas protegidas
 
};
