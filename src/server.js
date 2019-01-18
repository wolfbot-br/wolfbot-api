const bodyParser = require('body-parser');
const express = require('express');
const allowCors = require('./cors');
const consign = require('consign');
const helmet = require('helmet');
const admin = require('firebase-admin');
const firebase = require('firebase');

const adminAccount = require('./certificates/firebase.admin.development.json');
const firebaseAccount = require('./certificates/firebase.development.json');

const app = express();

//middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(allowCors);
app.use(helmet());

//firebase
const config = {
  apiKey: firebaseAccount.apiKey,
  authDomain: firebaseAccount.authDomain,
  databaseURL: firebaseAccount.databaseURL,
};

admin.initializeApp({
  credential: admin.credential.cert(adminAccount),
  databaseURL: 'https://wolfbot-development-firebase.firebaseio.com',
});

firebase.initializeApp(config);

consign()
  .include('/src/infraestrutura/mongo/index.js')
  .then('/src/api/account')
  .then('/src/api/historico')
  .then('/src/api/exchanges')
  .then('/src/api/index')
  .then('/src/api/util')
  .then('/src/api/configuracao')
  .then('/src/api/bot')
  .then('/src/api/backtest')
  .then('/src/api/order')
  .into(app);

app.listen(process.env.PORT || port, function() {
  console.log(`Wofboot API - Executando na porta ${port}`);
});
