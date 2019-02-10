import bodyParser from 'body-parser';
import express from 'express';
import consign from 'consign';
import helmet from 'helmet';
import admin from 'firebase-admin';
import firebase from 'firebase';
import chalk from 'chalk';

import mongoose from './database/mongo';
import adminAccount from './certificates/firebase.admin.development.json';
import firebaseAccount from './certificates/firebase.development.json';
import config from './config';
import allowCors from './middlewares/cors';

const app = express();
mongoose.createConnection();

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(allowCors);
app.use(helmet());

// firebase
const firebaseConfig = {
    apiKey: firebaseAccount.apiKey,
    authDomain: firebaseAccount.authDomain,
    databaseURL: firebaseAccount.databaseURL,
};

admin.initializeApp({
    credential: admin.credential.cert(adminAccount),
    databaseURL: 'https://wolfbot-development-firebase.firebaseio.com',
});

firebase.initializeApp(firebaseConfig);

consign()
    .include('src/api/database')
    .then('src/api/routes')
    .then('src/api/controllers')
    .then('src/api/validators')
    .then('src/api/services')
    .then('src/api/certificates')
    .then('src/api/config')
    .then('src/api/middlewares')
    .into(app);

app.listen(config.port, () =>
    console.log(`\n API: ${chalk.blue('Wolfbot API')}
 Running on port: ${chalk.blue(config.port)} 
 Environment: ${chalk.blue(config.environment)}`)
);
