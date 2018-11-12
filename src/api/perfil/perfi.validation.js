const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/;
const dictionary = require('../util/validations.dictionary');

const Usuario = require('../../infraestrutura/mongo/models/usuario.model');

const validChangePassword = async (data, userId) => {
    const errors = [];
    const userByPassword = await Usuario.findOne({ password: data.password })
    if (!userByPassword && data.password) {
        errors.push(Object.assign({}, { ...dictionary.account.userByPasswordIsEmpty }));
    }

    if (errors.length) return errors;

    if (!data.password) {
        errors.push(Object.assign({}, { ...dictionary.account.passwordIsEmpty }));
    }
    if (!data.newPassword) {
        errors.push(Object.assign({}, { ...dictionary.account.newPasswordIsEmpty }));
    }
    if (!data.confirmNewPassword) {
        errors.push(Object.assign({}, { ...dictionary.account.passwordConfirmIsEmpty }));
    }
    if (errors.length) return errors;

    if (!data.newPassword.match(passwordRegex) && !data.confirmNewPassword.match(passwordRegex)) {
        errors.push(Object.assign({}, { ...dictionary.account.passwordIsInvalid }));
    }
    if (data.confirmNewPassword !== data.newPassword) {
        errors.push(Object.assign({}, { ...dictionary.account.passwordDiferentIsConfirm }));
    }
    return errors;
};

const validSaveDadosPessoais = async (data) => {
    const errors = [];
    if (!data.name) {
        errors.push(Object.assign({}, { ...dictionary.account.nameIsEmpty }));
    }
    return errors;
}

module.exports = {
    validChangePassword,
    validSaveDadosPessoais
}