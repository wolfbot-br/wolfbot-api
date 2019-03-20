const admin = require("firebase-admin");
const firebase = require("firebase");
const response = require("../modules/accounts/services/accountsResponse");
const dates = require("../utils/functions/dates");

module.exports = async (req, res, next) => {
    if (req.method === "OPTIONS") next();
    else {
        const { authorization } = req.headers;

        if (!authorization)
            return response.constructionErrorMessage(res, {
                code: "auth/token_is_empty",
            });

        try {
            const firebaseUserInfo = await admin.auth().verifyIdToken(authorization);

            req.user = {
                ...firebaseUserInfo,
                exp: dates.convertTimeStampToHours(firebaseUserInfo.exp),
                iat: dates.convertTimeStampToHours(firebaseUserInfo.iat),
                auth_time: dates.convertTimeStampToHours(firebaseUserInfo.auth_time),
            };

            next();
        } catch (error) {
            return response.constructionErrorMessage(res, error);
        }
    }
};
