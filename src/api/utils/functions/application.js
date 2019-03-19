const dictionary = require("../dictionaries/accountDictionary");
const dateFunctions = require("./dates");

const convertTimeStampToHours = (timeStamp) => {
    const date = dateFunctions.createMomentDate(timeStamp);
    return date;
};

const constructionErrorMessage = (res, error) => {
    switch (error.code) {
        case "auth/email-already-in-use":
            return res.status(400).json({
                errors: [dictionary.account.emailIsUsing],
            });
        case "auth/invalid-action-code": {
            return res.status(400).json({
                errors: [dictionary.account.activeAccountCodeIsInvalid],
            });
        }
        case "auth/email-is-active": {
            return res.status(400).json({
                errors: [dictionary.account.emailIsActive],
            });
        }
        case "auth/email-is-not-active": {
            return res.status(400).json({
                errors: [dictionary.account.emailIsNotActive],
            });
        }
        case "auth/wrong-password": {
            return res.status(400).json({
                errors: [dictionary.account.loginFailed],
            });
        }
        case "auth/user-not-found": {
            return res.status(400).json({
                errors: [dictionary.account.userIsEmpty],
            });
        }
        case "auth/invalid-email": {
            return res.status(400).json({
                errors: [dictionary.account.emailIsInvalid],
            });
        }
        case "auth/too-many-requests": {
            return res.status(400).json({
                errors: [dictionary.account.manyRequestsLogin],
            });
        }
        default:
            return res.status(400).json({
                errors: [error],
            });
    }
};

module.exports = {
    convertTimeStampToHours,
    constructionErrorMessage,
};
