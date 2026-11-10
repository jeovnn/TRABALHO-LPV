const controller = require('../controllers/usuarios');

module.exports = (app) => {
  app.get('/usuarios', controller.listar);
  app.get('/usuarios/:id', controller.buscarPorId);
  app.post('/usuarios', controller.criar);
  app.put('/usuarios/:id', controller.atualizar);
  app.delete('/usuarios/:id', controller.excluir);
};
