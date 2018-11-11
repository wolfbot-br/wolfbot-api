const service = require('./perfil.service');

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

const getCountries = async (req, res) => {
    const countries = await service.getCountries();
    return res.status(200).json(countries);
}

module.exports = {
    profile,
    updateProfile,
    getCountries
}