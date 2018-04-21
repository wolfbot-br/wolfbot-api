const Teste = require('../models/teste')

const getTeste = (req, res, next) => {

    Teste.find({}, (err, teste) => {
        if(err){
            return res.status(400)
        }
        else{
            return res.send(teste)
        }
    })
}

module.exports = {getTeste}
