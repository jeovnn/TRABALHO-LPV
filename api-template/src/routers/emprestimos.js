const controller = require('../controllers/emprestimos');

module.exports = (app) => {
  app.get('/emprestimos', controller.listar);
  app.get('/emprestimos/:id', controller.buscarPorId);
  app.post('/emprestimos', controller.criar);
  app.put('/emprestimos/:id', controller.atualizar);
  app.delete('/emprestimos/:id', controller.excluir);
};
