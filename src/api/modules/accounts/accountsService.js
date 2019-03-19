const _ = require("lodash");
const admin = require("firebase-admin");
const firebase = require("firebase");

const dictionary = require("../../utils/dictionaries/accountDictionary");
const User = require("../../models/userModel");
const AccountLog = require("../../models/accountsLogModel");
const applicationFunctions = require("../../utils/functions/application");
const dateFunctions = require("../../utils/functions/dates");
const enumerator = require("../../utils/enumerators/accounts");

const signup = async (res, user) => {
    const { name, email, password } = user;

    try {
        const userCreated = await firebase.auth().createUserWithEmailAndPassword(email, password);

        const userMongo = await new User({
            name,
            email,
            password,
            uid: userCreated.user.uid,
        }).save();

        const log = new AccountLog({
            user: userMongo._id,
            verifiedEmail: false,
            expirationDate: dateFunctions.createMomentDate().add(1, "days"),
            verificationDate: null,
            logType: enumerator.accountLogTypes.emailActivation,
            pending: true,
            uid: userCreated.user.uid,
        });

        await Promise.all([userCreated.user.sendEmailVerification(), log.save()]);

        return res.status(201).json();
    } catch (error) {
        console.error(error);
        applicationFunctions.constructionErrorMessage(res, error);
    }
};

const activeAccount = async (res, code) => {
    try {
        const resultActiveAccount = await firebase.auth().checkActionCode(code);

        if (resultActiveAccount.operation === "VERIFY_EMAIL") {
            const { email } = resultActiveAccount.data;

            const firebaseUser = await admin.auth().getUserByEmail(email);
            const log = await AccountLog.findOne({
                uid: firebaseUser.uid,
                logType: enumerator.accountLogTypes.emailActivation,
                pending: true,
                expirationDate: { $gt: dateFunctions.createMomentDate() },
            })
                .sort({ createdAt: -1 })
                .lean();

            if (firebaseUser.emailVerified)
                return applicationFunctions.constructionErrorMessage(res, {
                    code: "auth/email-is-active",
                });

            if (
                !Object.keys(log || {}).length ||
                dateFunctions.createMomentDate() > log.expirationDate
            ) {
                return applicationFunctions.constructionErrorMessage(res, {
                    code: "auth/invalid-action-code",
                });
            }

            await admin.auth().updateUser(firebaseUser.uid, { emailVerified: true });
            await AccountLog.updateOne(
                { _id: log._id },
                {
                    verifiedEmail: true,
                    verificationDate: dateFunctions.createMomentDate(),
                    pending: false,
                }
            );

            return res.status(200).json({});
        } else {
            return res.status(400).json({});
        }
    } catch (error) {
        return applicationFunctions.constructionErrorMessage(res, error);
    }
};

// Cria um token para o usuário
const createToken = (email, password, res) => {
    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(function(currentUser) {
            if (firebase.auth().currentUser.emailVerified) {
                const usuario = firebase.auth().currentUser.toJSON();
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
                    criado: usuario.createdAt,
                });
            } else {
                return res.status(400).json({
                    errors: [
                        {
                            message: "Email não verificado pelo usuário",
                        },
                    ],
                });
            }
        })
        .catch(function(error) {
            switch (error.code) {
                case "auth/wrong-password":
                    return res.status(400).json({
                        errors: [
                            {
                                message: "Senha do usuário está Inválida",
                            },
                        ],
                    });
                case "auth/user-not-found":
                    return res.status(400).json({
                        errors: [
                            {
                                message: "Não existe usuário com esse endereço de email",
                            },
                        ],
                    });
                case "auth/invalid-email":
                    return res.status(400).json({
                        errors: [
                            {
                                message: "O email informado está inválido",
                            },
                        ],
                    });
                default:
                    return res.status(400).json(error);
            }
        });
};

// Informações do usuário logado com base no email (Uso interno)
const getUserByEmail = (email, res) => {
    admin
        .auth()
        .getUserByEmail(email)
        .then(function(userRecord) {
            return res.status(200).json(userRecord);
        })
        .catch(function(error) {
            return res.status(400).json({
                error: error,
            });
        });
};

// Login por email e senha de um usuário
const login = (res, email, password) => {
    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(function() {
            if (firebase.auth().currentUser.emailVerified) {
                const usuario = firebase.auth().currentUser.toJSON();
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
                    criado: usuario.createdAt,
                });
            } else {
                return res.status(400).json({
                    errors: [
                        {
                            ...dictionary.account.emailIsNotActive,
                        },
                    ],
                });
            }
        })
        .catch(function(error) {
            switch (error.code) {
                case "auth/wrong-password":
                    return res.status(400).json({
                        errors: [
                            {
                                ...dictionary.account.loginFailed,
                            },
                        ],
                    });
                case "auth/user-not-found":
                    return res.status(400).json({
                        errors: [
                            {
                                ...dictionary.account.userIsEmpty,
                            },
                        ],
                    });
                case "auth/invalid-email":
                    return res.status(400).json({
                        errors: [
                            {
                                ...dictionary.account.emailIsInvalid,
                            },
                        ],
                    });
                case "auth/too-many-requests":
                    return res.status(400).json({
                        errors: [
                            {
                                ...dictionary.account.manyRequestsLogin,
                            },
                        ],
                    });
                default:
                    return res.status(400).json(error);
            }
        });
};

// Informações do Usuário Logado (Aqui faz a verificação do Token)
const me = (res, token) => {
    admin
        .auth()
        .verifyIdToken(token)
        .then(function(decodedToken) {
            return res.status(200).json(decodedToken);
        })
        .catch(function(error) {
            switch (error.code) {
                case "auth/argument-error":
                    return res.status(400).json({
                        errors: [
                            {
                                message: "Token Inválido",
                            },
                        ],
                    });
                default:
                    return res.status(400).json(error);
            }
        });
};

// Devolve uma resposta para erros do banco de dados
const sendErrorsFromDB = (res, dbErrors) => {
    const errors = [];
    _.forIn(dbErrors.errors, (error) => errors.push(error.message));
    return res.status(400).json({ errors });
};

const sendEmailPasswordRecovery = (usuario, res) => {};

const passwordRecovery = (res, next, email) => {};

const changePasswordPermition = (res, next, hash) => {};

const findLogChangePassword = (ChangePasswordHash, res) => {};

const updatePassword = (log, password, res) => {};

const changePassword = (res, next, changePasswordHash, password) => {};

module.exports = {
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
    getUserByEmail,
};
