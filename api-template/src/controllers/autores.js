const service = require('../services/autores');
const crud = require('./crud');

module.exports = crud(service, ['nome']);
