const admin = require("firebase-admin");
const firebase = require("firebase");
const User = require("../../models/userModel");

const savePerfilUser = async (res, user) => {
    await User.findOneAndUpdate({ uid: user.uid }, user);
    return res.status(200).json({
        success: true,
    });
};

const getPerfilUser = async (res, uid) => {
    const user = await User.find({ uid }).lean();
    return res.status(200).json({
        success: true,
        data: user,
    });
};

const changePassword = async (res, input) => {
    const errors = [];
    const user = await User.findOne({ password: input.password, uid: input.uid }).lean();

    if (!user) {
        errors.push({
            message: "A senha informada está inválida.",
        });
    }

    if (errors.length)
        return res.status(400).json({
            success: false,
            errors,
        });

    await User.findOneAndUpdate({ uid: input.uid }, { password: input.new_password });
    await admin.auth().updateUser(input.uid, {
        password: input.new_password,
    });

    return res.status(200).json({
        success: true,
    });
};

module.exports = {
    savePerfilUser,
    getPerfilUser,
    changePassword,
};
