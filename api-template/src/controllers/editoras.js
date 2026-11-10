const service = require('../services/editoras');
const crud = require('./crud');

module.exports = crud(service, ['nome']);
