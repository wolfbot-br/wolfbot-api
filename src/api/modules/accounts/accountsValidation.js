const dictionary = require("../../utils/dictionaries/accountDictionary");

const emailRegex = /\S+@\S+\.\S+/;
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/;

const validSignup = (user) => {
    const errors = [];

    if (!user.email) errors.push(dictionary.account.emailIsEmpty);

    if (user.email && !user.email.match(emailRegex)) errors.push(dictionary.account.emailIsInvalid);

    if (!user.password) errors.push(dictionary.account.passwordIsEmpty);

    if (user.password && !user.password.match(passwordRegex))
        errors.push(dictionary.account.passwordIsInvalid);

    if (!user.passwordConfirm) errors.push(dictionary.account.passwordConfirmIsEmpty);

    if (user.password && user.passwordConfirm && user.passwordConfirm !== user.password)
        errors.push(dictionary.account.passwordDiferentIsConfirm);

    if (!user.name) errors.push(dictionary.account.nameIsEmpty);

    return errors;
};

const validLogin = (email, password) => {
    const errors = [];

    if (!email) errors.push(dictionary.account.emailIsEmpty);
    else if (!email.match(emailRegex)) errors.push(dictionary.account.emailIsInvalid);

    if (!password) errors.push(dictionary.account.passwordIsEmpty);

    return errors;
};

const changePasswordValidation = (password, passwordConfirm, changePasswordHash) => {
    const errors = [];
    if (
        changePasswordHash === "" ||
        changePasswordHash == null ||
        changePasswordHash === undefined
    ) {
        errors.push(Object.assign({}, { message: "Solicitação Inválida." }));
        return errors;
    }
    if (password === "" || password === undefined) {
        errors.push(Object.assign({}, { ...dictionary.account.passwordIsEmpty }));
    }
    if (passwordConfirm === "" || passwordConfirm === undefined) {
        errors.push(Object.assign({}, { ...dictionary.account.passwordConfirmIsEmpty }));
        return errors;
    }
    if (password !== passwordConfirm) {
        errors.push(Object.assign({}, { ...dictionary.account.passwordDiferentIsConfirm }));
        return errors;
    }
    if (!password.match(passwordRegex)) {
        errors.push(Object.assign({}, { ...dictionary.account.passwordIsEmpty }));
    }
    return errors;
};

module.exports = {
    validSignup,
    changePasswordValidation,
    validLogin,
};
