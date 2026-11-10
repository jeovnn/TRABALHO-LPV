const controller = require('../controllers/categorias');

module.exports = (app) => {
  app.get('/categorias', controller.listar);
  app.get('/categorias/:id', controller.buscarPorId);
  app.post('/categorias', controller.criar);
  app.put('/categorias/:id', controller.atualizar);
  app.delete('/categorias/:id', controller.excluir);
};
