const _ = require("lodash");

const validator = require("./accountsValidation");
const service = require("./services/accountsService");

const signup = async (req, res) => {
    const { name, email, password, passwordConfirm } = req.body;

    const errors = await validator.validSignup({ name, email, password, passwordConfirm });

    return errors.length
        ? res.status(400).json({ errors })
        : service.signup(res, { name, email, password });
};

const activeAccount = async (req, res) => {
    const { code } = req.headers;
    if (!code) {
        return res.status(400).json({
            errors: [{ message: '"code" na requisição é obrigatório' }],
        });
    }
    await service.activeAccount(res, code);
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const errors = validator.validLogin(email, password);
    return errors.length ? res.status(406).json({ errors }) : service.login(res, email, password);
};

const userInfo = async (req, res) => await service.userInfo(req, res);

const passwordRecovery = (req, res, next) => {
    const email = req.body.email;
    service.passwordRecovery(res, next, email);
};

const changePasswordPermition = (req, res, next) => {
    const hash = req.body.changepasswordhash;
    service.changePasswordPermition(res, next, hash);
};

const changePassword = (req, res, next) => {
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;
    const changePasswordHash = req.body.changePasswordHash;
    const errors = validator.changePasswordValidation(
        password,
        passwordConfirm,
        changePasswordHash
    );
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors,
        });
    }
    service.changePassword(res, next, changePasswordHash, password);
};

// Busca as informações do usuário pelo email
const getUserByEmail = (req, res) => {
    const email = req.headers.email;
    service.getUserByEmail(email, res);
};

// Cria um novo token para um usuário
const createToken = (req, res) => {
    const email = req.body.email || "";
    const password = req.body.password || "";
    const errors = validator.validLogin(email, password);
    if (errors.length > 0) {
        res.status(406).json({ errors });
    } else {
        service.createToken(email, password, res);
    }
};

module.exports = {
    login,
    createToken,
    signup,
    userInfo,
    passwordRecovery,
    changePasswordPermition,
    changePassword,
    activeAccount,
    getUserByEmail,
};
