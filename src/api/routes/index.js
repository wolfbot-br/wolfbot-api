import express from 'express';
import auth from '../middlewares/auth';
import controller from '../controllers/index';

export default function(server) {
    const protectedRoutes = express.Router();
    const openRoutes = express.Router();

    server.use('/', openRoutes);

    openRoutes.get('/', controller.index);
}
