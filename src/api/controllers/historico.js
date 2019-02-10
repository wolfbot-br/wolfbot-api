import service from '../services/historico.service';

const historicos = (req, res, next) => {
    service.historicos(res, req.user);
};

export default {
    historicos,
};
