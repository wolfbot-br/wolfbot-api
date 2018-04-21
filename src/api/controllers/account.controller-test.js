const Usuario = require('../models/usuario')

module.exports.salvar = (req, res) => {
   
    let usuario = new Usuario({
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha
    });
    
    usuario.save().then(data => 
        res.send(data));
};

module.exports.listar = (req, res) => {

    Usuario.find().then(data =>
        res.send(data));
};

module.exports.autenticar = (req, res) =>  {

    var jwt = require('jsonwebtoken');

    Usuario.findOne({
        email: req.body.email
    }, function(err, usuario){

        if(err)
            throw err;

        if(!usuario){
            res.send({sucess: false, message: 'Usuário não existe'})
        } 
        else if(usuario){

            if(usuario.senha != req.body.senha){

                res.send({sucess: false, message: 'Senha Incorreta'})
            }
            else{
                var token = jwt.sign(usuario,'node-auth',{
                    expiresInMinutes: 2
                });

                res.send({
                    sucess: true,
                    message: 'Token Criado',
                    token: token
                });
            }
        }
    })
}