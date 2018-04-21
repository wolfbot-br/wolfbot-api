const Usuario = require('../models/usuario')

module.exports.salvarUsuario = (req, res) => {
   
    let usuario = new Usuario({
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha
    });
    
    usuario.save().then(data => 
        res.send(data));
};