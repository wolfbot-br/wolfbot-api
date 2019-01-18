import express from 'express';
import auth from '../middlewares/auth';
import controller from '../controllers/backtest';

export default function(server) {
    const protectedRoutes = express.Router();

    //protectedRoutes.use(auth);
    server.use('/api', protectedRoutes);

    protectedRoutes.post('/backtest/testarConfiguracao', controller.testarConfiguracao);
}
