const bodyParser = require('body-parser') 
const express = require('express')
const morgan = require('morgan')
const development = require('../config/development')
const consign = require('consign')

const app = express();
var jwt = require('jsonwebtoken');
var rotas_autenticadas = express.Router();


app.use(bodyParser.urlencoded({extended: true})) 
app.use(bodyParser.json()) 
app.set('superNode-auth', development.mongo.configName)
app.use(morgan('dev'));


rotas_autenticadas.use(function(req, res, next) {
    console.log('teste')
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token) {
        jwt.verify(token, app.get('superNode-auth'), function(err, decoded) {      
            if (err) {
                return res.json({ success: false, message: 'Falha ao tentar autenticar o token!' });    
            } else {
            //se tudo correr bem, salver a requisição para o uso em outras rotas
            req.decoded = decoded;    
            next();
            }
        });

        } else {
        // se não tiver o token, retornar o erro 403
        return res.status(403).send({ 
            success: false, 
            message: 'Não há token.' 
        });       
    }
});

app.use('/usuarios', rotas_autenticadas);

consign()
    .include('/src/api/routes')
    .then('/src/infrastructure')
    .then('/src/api/controllers')
    .into(app)

require('../api/routes/account.routes')(app);

module.exports = app