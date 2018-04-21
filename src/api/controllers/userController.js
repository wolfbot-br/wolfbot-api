const user = require('../models/user')

//cria api rest para o schema do mongo
user.methods(['get', 'post', 'put', 'delete'])

//em uma atualização retorna o objeto atualizado, e valida os campos antes de atualizar
user.updateOptions({new: true, runValidators: true})

module.exports = user