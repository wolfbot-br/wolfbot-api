const express = require('express')
const auth = require('../../config/auth')

module.exports = function(server){

    const account_controller = require('../controllers/account-controller');
    const teste_controller = require('../controllers/teste-controller')

    // definindo as rotas protegidas e rotas abertas atraves de um Router
    const rotas_protegidas = express.Router()
    const rotas_abertas = express.Router()

    // Aplicando o filtro de autenticação nas rotas protegidas
    rotas_protegidas.use(auth)

    
    // todas as requisições que vierem de /auth vão cair dentro de rotas_protegidas
    server.use('/api', rotas_protegidas)
    rotas_protegidas.get('/teste', teste_controller.getTeste)
    

    // todas as rotas que vierem de /account são rotas abertas para requição
    server.use('/account', rotas_abertas)
    rotas_abertas.post('/login', account_controller.login)
    rotas_abertas.post('/signup', account_controller.signup)
    rotas_abertas.post('/validateToken', account_controller.validateToken)
    
}