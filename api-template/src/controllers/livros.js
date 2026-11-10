const service = require('../services/livros');
const crud = require('./crud');

module.exports = crud(service, ['titulo']);
