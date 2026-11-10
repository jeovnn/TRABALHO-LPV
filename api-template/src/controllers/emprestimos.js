const service = require('../services/emprestimos');
const crud = require('./crud');

module.exports = crud(service, ['usuario_id', 'livro_id', 'data_prevista_devolucao']);
