const service = require('./perfil.service');

const profileValidation = require('./perfi.validation');

const profile = async (req, res) => {

    const userId = req.user.user_id;
    const user = await service.getPerfil(userId);
    return res.status(200).json(user);
}

const updateProfile = async (req, res) => {
    const userId = req.user.user_id;
    const errors = await profileValidation.validSaveDadosPessoais(req.body);
    if (!errors.length) {
        const user = await service.updateProfile(userId, req.body)
        return res.status(200).json(user);
    }
    else return res.status(400).json({ errors: errors })
}

const getCountries = async (req, res) => {
    const countries = await service.getCountries();
    return res.status(200).json(countries);
}

const changePassword = async (req, res) => {
    const userId = req.user.user_id;
    const data = req.body;
    const errors = await profileValidation.validChangePassword(data, userId);
    if (!errors.length) {
        await service.changePassword(userId, data.newPassword);
        return res.status(200).json('Ok');
    }
    else {
        return res.status(400).json({ errors: errors })
    }
}

module.exports = {
    profile,
    updateProfile,
    getCountries,
    changePassword
}