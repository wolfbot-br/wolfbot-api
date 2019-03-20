const _ = require("lodash");
const admin = require("firebase-admin");
const firebase = require("firebase");

const User = require("../../../models/userModel");
const AccountLog = require("../../../models/accountsLogModel");
const response = require("./accountsResponse");
const dateFunctions = require("../../../utils/functions/dates");
const enumerator = require("../../../utils/enumerators/accounts");

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
        response.constructionErrorMessage(res, error);
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
                return response.constructionErrorMessage(res, {
                    code: "auth/email-is-active",
                });

            if (
                !Object.keys(log || {}).length ||
                dateFunctions.createMomentDate() > log.expirationDate
            ) {
                return response.constructionErrorMessage(res, {
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
        return response.constructionErrorMessage(res, error);
    }
};

const login = async (res, email, password) => {
    try {
        await firebase.auth().signInWithEmailAndPassword(email, password);

        const currentUser = firebase.auth().currentUser.toJSON();

        authenticatedUser = {
            uid: currentUser.uid,
            email: currentUser.email,
            emailVerified: currentUser.emailVerified,
            isAnonymous: currentUser.isAnonymous,
            refreshToken: currentUser.stsTokenManager.refreshToken,
            accessToken: currentUser.stsTokenManager.accessToken,
            expirationTime: dateFunctions.convertTimeStampToHours(
                currentUser.stsTokenManager.expirationTime
            ),
            lastLoginAt: dateFunctions.createMomentDate(),
        };

        if (!authenticatedUser.emailVerified) {
            return response.constructionErrorMessage(res, {
                code: "auth/email-is-not-active",
            });
        }

        return res.status(200).json(authenticatedUser);
    } catch (error) {
        return response.constructionErrorMessage(res, error);
    }
};

const userInfo = async (req, res) => {
    const { user } = req;
    return res.status(400).json(user);
};

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
    userInfo,
    createToken,
    changePassword,
    activeAccount,
    getUserByEmail,
};
