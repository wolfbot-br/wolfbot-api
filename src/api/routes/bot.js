import express from 'express';
import auth from '../middlewares/auth';
import controller from '../controllers/bot';

export default function(server) {
    const protectedRoutes = express.Router();

    // protectedRoutes.use(auth)
    server.use('/bot', protectedRoutes);

    protectedRoutes.post('/acionarRobo', controller.acionarRobo);
}
