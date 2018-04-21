const port = 3003
const bodyParser = require('body-parser') 
const express = require('express')
const morgan = require('morgan')
const development = require('../config/development')

const app = express();
require('../infrastructure/mongoose/index')

// Middlewares da Aplicação

var jwt = require('jsonwebtoken');
var apiRoutes = express.Router();


// body-parser faz a interpretação 
app.use(bodyParser.urlencoded({extended: true})) // irá fazer o parse das requisoções via formuário
app.use(bodyParser.json()) // irá fazer o parse das requisições via Json
app.set('superNode-auth', development.mongo.configName)
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.json({"message": "Index"});
});

apiRoutes.use(function(req, res, next) {

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

app.use('/usuarios', apiRoutes);

require('../api/routes/test.routes')(app);
require('../api/routes/account.routes')(app);

app.listen(port, function(){
    console.log(`Application is running on port ${port}`)
})

module.exports = app