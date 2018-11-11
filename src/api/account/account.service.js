const _ = require('lodash')
const admin = require('firebase-admin')
const firebase = require('firebase')

const dictionary = require('../util/validations.dictionary')
const Usuario = require('../../infraestrutura/mongo/models/usuario.model')

// Realiza a ativação da conta do usuário
const activeAccount = (res, code) => {
    firebase.auth().checkActionCode(code)
        .then(function (response) {
            if (response.operation == 'VERIFY_EMAIL') {

                const usuario = response.data.email;
                admin.auth().getUserByEmail(usuario)
                    .then(function (userRecord) {
                        if (userRecord.emailVerified) {
                            return res.status(400).json({
                                errors: [{
                                    message: 'Email já foi verificado pelo usuário',
                                    code: 'emailIsActive'
                                }]
                            })
                        }
                        admin.auth().updateUser(userRecord.uid,
                            {
                                emailVerified: true
                            })
                            .then(function (user) {

                                Usuario.findOneAndUpdate({ email: response.data.email }, { emailVerified: true })
                                    .then(() => {
                                        return res.status(200).json(user)
                                    })
                                    .catch((error) => {
                                        return res.status(500).json({
                                            errors: [{
                                                message: error
                                            }]
                                        })
                                    });
                            })
                            .catch(function (error) {
                                return res.status(400).json(error)
                            })
                    })
            }
            else {
                return res.status(400).json({
                    errors: [{
                        message: 'Operação Inválida',
                        code: 'operationIsInvalid'
                    }]
                })
            }
        })
        .catch(function (error) {
            switch (error.code) {
                case 'auth/invalid-action-code': {
                    return res.status(400).json({
                        errors:
                            [{
                                message: 'O código de ação é inválido. Isso pode acontecer se o código estiver mal informado, expirado ou já tiver sido usado.',
                                code: 'operationIsInvalid'
                            }]
                    })
                }
            }
        })
}

// Cria um token para o usuário 
const createToken = (email, password, res) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (currentUser) {
            if (firebase.auth().currentUser.emailVerified) {
                const usuario = firebase.auth().currentUser.toJSON()
                return res.status(200).json({
                    id: usuario.uid,
                    email: usuario.email,
                    emailVerificado: usuario.emailVerified,
                    anonimo: usuario.isAnonymous,
                    MetodoLogin: usuario.providerData[0].providerId,
                    refreshToken: usuario.stsTokenManager.refreshToken,
                    Token: usuario.stsTokenManager.accessToken,
                    expiration: usuario.stsTokenManager.expirationTime,
                    ultimoLogin: usuario.lastLoginAt,
                    criado: usuario.createdAt
                })
            }
            else {
                return res.status(400).json({
                    errors: [{
                        message: 'Email não verificado pelo usuário'
                    }]
                })
            }

        })
        .catch(function (error) {
            switch (error.code) {
                case 'auth/wrong-password':
                    return res.status(400).json({
                        errors: [{
                            message: 'Senha do usuário está Inválida'
                        }]
                    })
                case 'auth/user-not-found':
                    return res.status(400).json({
                        errors: [{
                            message: 'Não existe usuário com esse endereço de email'
                        }]
                    })
                case 'auth/invalid-email':
                    return res.status(400).json({
                        errors: [{
                            message: 'O email informado está inválido'
                        }]
                    })
                default:
                    return res.status(400).json(error)
            }
        })
}

// Informações do usuário logado com base no email (Uso interno)
const getUserByEmail = (email, res) => {
    admin.auth().getUserByEmail(email)
        .then(function (userRecord) {
            return res.status(200).json(userRecord);
        })
        .catch(function (error) {
            return res.status(400).json({
                error: error
            })
        })
}

// Cadastro de um novo usuário
const signup = (res, usuario) => {

    const firebaseUser = {
        email: usuario.email,
        password: usuario.password,
        name: usuario.name
    }
    firebase.auth().createUserWithEmailAndPassword(firebaseUser.email, firebaseUser.password)
        .then(function (userRecord) {
            const userMongo = createMongoObject(
                {
                    ...firebaseUser,
                    userId: firebase.auth().currentUser.toJSON().uid,
                    genre: '',
                    country: '',
                    city: '',
                    photo: '',
                    emailVerified: false,
                });
            try {
                userMongo.save();
            } catch (error) {
                return res.status(500).json({
                    errors: [{
                        message: error
                    }]
                })
            }
            sendEmailActiveAccount(res);

        })
        .catch(function (error) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    return res.status(400).json({
                        errors: [{
                            ...dictionary.account.emailIsUsing
                        }]
                    })
                default:
                    return res.status(400).json({
                        errors: [{
                            message: error
                        }]
                    })
            }
        })
}

const createMongoObject = (usuario) => {
    const user = new Usuario(usuario)
    return user;
}

// Envio do email para ativação da conta 
const sendEmailActiveAccount = async (res) => {
    firebase.auth().currentUser.sendEmailVerification()
        .then(function () {
            return res.status(200).json({}
            );
        })
        .catch(function (error) {
            return res.status(400).json(error)
        })
}

// Login por email e senha de um usuário 
const login = (res, email, password) => {

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(async function () {
            if (firebase.auth().currentUser.emailVerified) {
                const usuario = firebase.auth().currentUser.toJSON()
                const user = await Usuario.findOne({ userId: usuario.uid });
                return res.status(200).json({
                    id: usuario.uid,
                    name: user.name,
                    photo: user.photo,
                    email: usuario.email,
                    emailVerificado: usuario.emailVerified,
                    anonimo: usuario.isAnonymous,
                    MetodoLogin: usuario.providerData[0].providerId,
                    refreshToken: usuario.stsTokenManager.refreshToken,
                    Token: usuario.stsTokenManager.accessToken,
                    expiration: usuario.stsTokenManager.expirationTime,
                    ultimoLogin: usuario.lastLoginAt,
                    criado: usuario.createdAt
                })
            }
            else {
                return res.status(400).json({
                    errors: [{
                        ...dictionary.account.emailIsNotActive
                    }]
                })
            }
        })
        .catch(function (error) {
            switch (error.code) {
                case 'auth/wrong-password':
                    return res.status(400).json({
                        errors: [{
                            ...dictionary.account.loginFailed
                        }]
                    })
                case 'auth/user-not-found':
                    return res.status(400).json({
                        errors: [{
                            ...dictionary.account.userIsEmpty
                        }]
                    })
                case 'auth/invalid-email':
                    return res.status(400).json({
                        errors: [{
                            ...dictionary.account.emailIsInvalid
                        }]
                    })
                case 'auth/too-many-requests':
                    return res.status(400).json({
                        errors: [{
                            ...dictionary.account.manyRequestsLogin
                        }]
                    })
                default:
                    return res.status(400).json(error)
            }
        })
}

// Informações do Usuário Logado (Aqui faz a verificação do Token)
const me = (res, token) => {
    admin.auth().verifyIdToken(token)
        .then(function (decodedToken) {
            return res.status(200).json(decodedToken)
        })
        .catch(function (error) {
            switch ((error.code)) {
                case 'auth/argument-error':
                    return res.status(400).json({
                        errors: [{
                            message: 'Token Inválido'
                        }]
                    })
                default:
                    return res.status(400).json(error);
            }
        })
}

// Devolve uma resposta para erros do banco de dados 
const sendErrorsFromDB = (res, dbErrors) => {
    const errors = []
    _.forIn(dbErrors.errors, error => errors.push(error.message))
    return res.status(400).json({ errors })
}

// Envio do email para recuperação da senha
const sendEmailPasswordRecovery = (usuario, res) => {

};

const passwordRecovery = (res, next, email) => {

}

const changePasswordPermition = (res, next, hash) => {

}

const findLogChangePassword = (ChangePasswordHash, res) => {

}

const updatePassword = (log, password, res) => {

}

const changePassword = (res, next, changePasswordHash, password) => {

}

module.exports =
    {
        changePasswordPermition,
        passwordRecovery,
        sendEmailPasswordRecovery,
        findLogChangePassword,
        updatePassword,
        signup,
        login,
        me,
        createToken,
        changePassword,
        activeAccount,
        getUserByEmail
    }
