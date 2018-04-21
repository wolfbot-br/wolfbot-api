
module.exports = function(app){

    const teste_controller = require('../controllers/test.controller');

    app.get('/teste', teste_controller.listar);

}