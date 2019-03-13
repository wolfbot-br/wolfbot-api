const dados = (data) => {
    if (!data.user_id) {
        throw new Error("Usuário inválido");
    }
};

module.exports = {
    dados,
};
