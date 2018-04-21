module.exports = function(app){

    const teste_controller = require('../controllers/account.controller');

    app.post('/usuario', teste_controller.salvarUsuario);

}