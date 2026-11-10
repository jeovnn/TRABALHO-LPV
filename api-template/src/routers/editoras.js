const controller = require('../controllers/editoras');

module.exports = (app) => {
  app.get('/editoras', controller.listar);
  app.get('/editoras/:id', controller.buscarPorId);
  app.post('/editoras', controller.criar);
  app.put('/editoras/:id', controller.atualizar);
  app.delete('/editoras/:id', controller.excluir);
};
