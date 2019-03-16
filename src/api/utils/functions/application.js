const convertTimeStampToHours = (timeStamp) => {
    const decodedDate = new Date(timeStamp * 1000);
    const hours = decodedDate.getHours();
    const minutes = decodedDate.getMinutes();
    const seconds = `0${decodedDate.getSeconds()}`;
    const formatedHour = hours + ":" + minutes.toString().substr(-2) + ":" + seconds.substr(-2);
    return formatedHour;
};

const constructionErrorMessage = (res, error) => {
    switch (error.code) {
        case "auth/email-already-in-use":
            return res.status(400).json({
                errors: [dictionary.account.emailIsUsing],
            });
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
