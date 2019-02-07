import _ from 'lodash';
import bcrypt from 'bcrypt';

import validator from '../validators/account.validation';
import service from '../services/account.service';

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
    let errors = validator.changePasswordValidation(password, passwordConfirm, changePasswordHash);
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors: errors,
        });
    }
    service.changePassword(res, next, changePasswordHash, password);
};

// Ativa a conta do usuário
const activeAccount = (req, res) => {
    const code = req.headers['code'];
    if (!code) {
        return res.status(400).json({
            errors: [{ message: '"code" na requisição é obrigatório' }],
        });
    }
    service.activeAccount(res, code);
};

// Busca as informações do usuário pelo email
const getUserByEmail = (req, res) => {
    const email = req.headers['email'];
    service.getUserByEmail(email, res);
};

// Informações do usuário logado (Verificação se o token é válido)
const me = (req, res) => {
    const token = req.headers['authorization'];
    service.me(res, token);
};

// Cadastro de um novo usuário
const signup = async (req, res) => {
    const usuario = {
        nome: req.body.nome || '',
        email: req.body.email || '',
        password: req.body.password || '',
        confirm_password: req.body.confirm_password || '',
    };

    const errors = await validator.validSignup(usuario);

    if (errors.length) res.status(406).json({ errors });
    else await service.signup(res, usuario);
};

// Cria um novo token para um usuário
const createToken = (req, res) => {
    const email = req.body.email || '';
    const password = req.body.password || '';
    const errors = validator.validLogin(email, password);
    if (errors.length > 0) {
        res.status(406).json({ errors });
    } else {
        service.createToken(email, password, res);
    }
};

// Login por email e senha de um usuário
const login = (req, res) => {
    const { email, password } = req.body;
    const errors = validator.validLogin(email, password);
    if (errors.length) {
        res.status(406).json({ errors });
    } else {
        service.login(res, email, password);
    }
};

export default {
    login,
    createToken,
    signup,
    me,
    passwordRecovery,
    changePasswordPermition,
    changePassword,
    activeAccount,
    getUserByEmail,
};
