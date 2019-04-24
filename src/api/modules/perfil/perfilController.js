const service = require("./perfilService");
const validator = require("./perfilValidator");

const savePerfilUser = async (req, res) => {
    const user = req.body;

    const userValidated = validator.validSavePerfilUser(user);

    const userData = req.user;

    await service.savePerfilUser(res, {
        ...userValidated,
        ...userData,
    });
};

const getPerfiUser = async (req, res) => {
    const { uid } = req.user;
    await service.getPerfilUser(res, uid);
};

const changePassword = async (req, res) => {
    const { password, new_password } = req.body;

    const { uid } = req.user;

    const errors = validator.validChangePassword(password, new_password);

    if (errors.length) {
        return res.status(400).json({
            success: false,
            errors,
        });
    }

    await service.changePassword(res, { uid, password, new_password });
};

module.exports = {
    savePerfilUser,
    getPerfiUser,
    changePassword,
};
