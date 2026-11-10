const categoriasRoute = require('./categorias');
const editorasRoute = require('./editoras');
const autoresRoute = require('./autores');
const usuariosRoute = require('./usuarios');
const livrosRoute = require('./livros');
const emprestimosRoute = require('./emprestimos');

module.exports = (app) => {
  categoriasRoute(app);
  editorasRoute(app);
  autoresRoute(app);
  usuariosRoute(app);
  livrosRoute(app);
  emprestimosRoute(app);
}
