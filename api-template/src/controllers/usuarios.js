const service = require('../services/usuarios');
const crud = require('./crud');

module.exports = crud(service, ['nome', 'cpf']);
