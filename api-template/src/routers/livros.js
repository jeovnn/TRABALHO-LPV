const controller = require('../controllers/livros');

module.exports = (app) => {
  app.get('/livros', controller.listar);
  app.get('/livros/:id', controller.buscarPorId);
  app.post('/livros', controller.criar);
  app.put('/livros/:id', controller.atualizar);
  app.delete('/livros/:id', controller.excluir);
};
