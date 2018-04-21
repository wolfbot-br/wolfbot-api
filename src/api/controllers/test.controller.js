const TesteModel = require('../models/test')

module.exports.listar = (req, res) => {
    
    TesteModel.find().then(teste => 
       
        res.send(teste)
    );
};