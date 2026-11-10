const controller = require('../controllers/autores');

module.exports = (app) => {
  app.get('/autores', controller.listar);
  app.get('/autores/:id', controller.buscarPorId);
  app.post('/autores', controller.criar);
  app.put('/autores/:id', controller.atualizar);
  app.delete('/autores/:id', controller.excluir);
};
