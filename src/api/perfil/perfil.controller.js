const service = require('./perfil.service');

// Retorna os dados do perfil do usuário
const profile = async (req, res) => {

    const userId = req.user.user_id;
    const user = await service.getPerfil(userId);
    return res.status(200).json(user);
}

const updateProfile = async (req, res) => {
    const userId = req.user.user_id;
    const user = await service.updateProfile(userId, req.body)
    return res.status(200).json(user);
}

module.exports = {
    profile,
    updateProfile
}