const test = require('../models/test')

// criando métodos da nossa API Rest relacionados ao nosso Schema
test.methods(['get', 'post', 'put', 'delete'])

module.exports = test