import express from 'express';
import auth from '../middlewares/auth';
import controller from '../controllers/util';

export default function(server) {
    const protectedRoutes = express.Router();
    const openRoutes = express.Router();

    protectedRoutes.use(auth);

    server.use('/api', protectedRoutes);

    server.use('/util', openRoutes);

    openRoutes.get('/exchanges/all', controller.listAllExchanges);
}
