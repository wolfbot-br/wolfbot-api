const Usuario = require('../../infraestrutura/mongo/models/usuario.model');
const Country = require('../../infraestrutura/mongo/models/pais.model');

const getPerfil = async userId => {

    const user = await Usuario.findOne({
        userId: userId
    });

    return (
        {
            email: user.email,
            password: user.password,
            name: user.name,
            genre: user.genre,
            country: user.country,
            city: user.city,
            photo: user.photo
        });
}

const updateProfile = async (userId, user) => {
    const userObj = await Usuario.findOneAndUpdate({ userId: userId }, user, { new: true });
    return userObj
}

const getCountries = async (userId, user) => {
    const countries = await Country.find();
    return countries;
}
module.exports = {
    getPerfil,
    updateProfile,
    getCountries
}