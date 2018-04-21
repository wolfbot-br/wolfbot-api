module.exports = function(app){

    const usuario = require('../controllers/account.controller-test');

    app.post('/usuario', usuario.salvar);
    app.post('/authenticate', usuario.autenticar)
    app.get('/dashboard')
    app.get('/usuarios', usuario.listar);

}