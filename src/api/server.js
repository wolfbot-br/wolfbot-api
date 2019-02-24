import admin from "firebase-admin";
import firebase from "firebase";
import chalk from "chalk";
import Koa from "koa";
import respond from "koa-respond";
import bodyParser from "koa-bodyparser";
import logger from "koa-logger";

import mongoose from "./database/mongo";
import adminAccount from "./certificates/firebase.admin.development.json";
import firebaseAccount from "./certificates/firebase.development.json";
import config from "./config";
import routes from "./routes";

const app = new Koa();
mongoose.createConnection();

// middlewares
app.use(bodyParser());
app.use(logger());
app.use(respond());
app.use(routes);

// firebase integration
const firebaseConfig = {
    apiKey: firebaseAccount.apiKey,
    authDomain: firebaseAccount.authDomain,
    databaseURL: firebaseAccount.databaseURL,
};

admin.initializeApp({
    credential: admin.credential.cert(adminAccount),
    databaseURL: "https://wolfbot-development-firebase.firebaseio.com",
});

firebase.initializeApp(firebaseConfig);

app.listen(Number(config.port), () =>
    console.log(`\n API: ${chalk.blue("Wolfbot API")}
 Running on port: ${chalk.blue(config.port)} 
 Environment: ${chalk.blue(config.environment)}`)
);
