const port = 3003
const bodyParser = require('body-parser') 
const express = require('express')

const app = express();
require('../infrastructure/mongoose/index')

// Middlewares da Aplicação

// body-parser faz a interpretação 
app.use(bodyParser.urlencoded({extended: true})) // irá fazer o parse das requisoções via formuário
app.use(bodyParser.json()) // irá fazer o parse das requisições via Json

app.get('/', (req, res) => {
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});

require('../api/routes/test.routes')(app);
require('../api/routes/account.routes')(app);

app.listen(port, function(){
    console.log(`Application is running on port ${port}`)
})

module.exports = app