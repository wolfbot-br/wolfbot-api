const jwt = require('jsonwebtoken')
const env = require('../../.env')

// middleware que irá interceptar uma requisição fazendo um filtro para verificar se foi um token gerado pela propria aplicação
module.exports = (req, res, next) => {

    // caso seja um método "OPTIONS" segue o fluxo normal da requisição
    if(req.method === 'OPTIONS') {
        next()
    }
    else{
    
       // busca o token somente se ele foi enviado no header da requisição
       const token = req.headers['authorization']

       // caso o token não seja passado
       if(!token){
           return res.status(403).send({ errors: ['Token não enviado']})
       }

       // realiza a verificação do Token
       jwt.verify(token, env.authSecret, function(err, decoded){
           if(err){
               return res.status(403).send({ errors: ['Falha ao autenticar o token'] })
           }
           else{
               // envia o token decodificado na request e segue o fluxo normal da requisição
               //req.decoded = decoded
               next();
           }
       })
    }
}