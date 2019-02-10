import mongoose from 'mongoose';
import chalk from 'chalk';
import config from '../../config';

mongoose.Promise = global.Promise;

const createConnection = () => {
    mongoose.connect(config.mongo.connection, { useNewUrlParser: true });
    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', () => console.log(` Connected to dabase: ${chalk.blue('Mongodb')} \n`));
};

export default { createConnection };
