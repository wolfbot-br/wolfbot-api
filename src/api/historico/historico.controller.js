const sendErrorsFromDB = (res, dbErrors) => {
    const errors = [];
    _.forIn(dbErrors.errors, error => errors.push(error.message));
    return res.status(400).json({ errors });
};

const historicos = (req, res, next) => {
    const token = req.headers['authorization'] || '';
    jwt.verify(token, env.authSecret, function (err, decoded) {
        return res.status(200).send({ token: `${token}`, valid: `${!err}` });
    });
};

module.exports =
    {
        historicos
    };  