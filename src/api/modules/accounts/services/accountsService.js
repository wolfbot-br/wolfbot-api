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

        return res.status(201).json({
            success: true,
        });
    } catch (error) {
        console.error(error);
        response.constructionErrorMessage(res, error);
    }
};

const activeAccount = async (res, code) => {
    try {
        const resultActiveAccount = await firebase.auth().checkActionCode(code);

        if (resultActiveAccount.operation == "VERIFY_EMAIL") {
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

const authenticate = async (email, password) => {
    try {
        await firebase.auth().signInWithEmailAndPassword(email, password);

        const currentUser = firebase.auth().currentUser.toJSON();

        return {
            sucess: true,
            authenticatedUser: {
                uid: currentUser.uid,
                email: currentUser.email,
                emailVerified: currentUser.emailVerified,
                isAnonymous: currentUser.isAnonymous,
                refreshToken: currentUser.stsTokenManager.refreshToken,
                accessToken: currentUser.stsTokenManager.accessToken,
                expirationTime: dateFunctions.convertTimeStampToHours(
                    currentUser.stsTokenManager.expirationTime
                ),
                createdAt: dateFunctions.convertTimeStampToHours(Number(currentUser.createdAt)),
                lastLoginAt: dateFunctions.convertTimeStampToHours(Number(currentUser.lastLoginAt)),
            },
        };
    } catch (error) {
        return {
            sucess: false,
            error,
        };
    }
};

const login = async (res, email, password) => {
    const authResult = await authenticate(email, password);

    if (!authResult.sucess) return response.constructionErrorMessage(res, authResult.error);

    if (!authResult.authenticatedUser.emailVerified)
        return response.constructionErrorMessage(res, {
            code: "auth/email-is-not-active",
        });
    return res.status(200).json(authResult);
};

const userInfo = async (req, res) => {
    const { user } = req;
    return res.status(200).json(user);
};

const createToken = async (res, email, password) => {
    const authResult = await authenticate(email, password);

    if (!authResult.sucess) return response.constructionErrorMessage(res, authResult.error);

    if (!authResult.authenticatedUser.emailVerified)
        return response.constructionErrorMessage(res, {
            code: "auth/email-is-not-active",
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
};
