import bodyParser from 'body-parser';
import express from 'express';
import consign from 'consign';
import helmet from 'helmet';
import admin from 'firebase-admin';
import firebase from 'firebase';
import chalk from 'chalk';

import adminAccount from './certificates/firebase.admin.development.json';
import firebaseAccount from './certificates/firebase.development.json';
import config from './config';
import allowCors from './middlewares/cors';

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
  .include('/api/database')
  .then('/api/routes')
  .then('/api/controllers')
  .then('/api/validators')
  .then('/api/services')
  .then('/api/certificates')
  .then('/api/config')
  .then('/api/middleware')
  .into(app);

app.listen(config.port, () =>
  console.log(`\n API: ${chalk.blue('Wofboot')}
    Running on port ${chalk.blue(config.port)}
    Environment: ${chalk.blue(config.environment)}`)
);
