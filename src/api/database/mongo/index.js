import mongoose from 'mongoose';
import config from '../../config';

mongoose.Promise = global.Promise;

export default mongoose.connect(`mongodb://${config.mongo.connection}/${config.mongo.database}`, {
  auth: { authdb: 'admin' },
  user: `${config.mongo.username}`,
  pass: `${config.mongo.password}`,
  useMongoClient: true,
});
