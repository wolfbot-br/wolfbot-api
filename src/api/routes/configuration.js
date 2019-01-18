import express from 'express';
import auth from '../middlewares/auth';
import controller from '../controllers/configuration';

export default function(server) {
    const protectedRoutes = express.Router();

    //protectedRoutes.use(auth)
    server.use('/api/configuracao', protectedRoutes);

    protectedRoutes.get('/carregar', controller.get);
    protectedRoutes.post('/salvar', controller.post);
    protectedRoutes.put('/alterar', controller.put);
    protectedRoutes.delete('/deletar', controller.exclusao);
}
