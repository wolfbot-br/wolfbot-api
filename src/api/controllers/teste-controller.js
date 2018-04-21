const Teste = require('../models/teste')

const getTeste = (req, res, next) => {

    Teste.find({} , (err, data) => {
        if(err){
            return res.send({error});
        }
        else{
            return res.send(data)
        }
    })
}

const saveTeste = (req, res, next) => {

    var data = new Teste({
        nome: req.body.nome
    })

    Teste.save((err) => {
        if(err){
            return res.send({error});
        }
        else{
            return res.send({msg: ['Ok']})
        }
    })
}

