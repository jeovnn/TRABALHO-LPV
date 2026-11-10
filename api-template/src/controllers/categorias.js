const service = require('../services/categorias');
const crud = require('./crud');

module.exports = crud(service, ['nome']);
