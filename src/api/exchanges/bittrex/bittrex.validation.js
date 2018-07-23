const validarDados = (dados) => {

    if (!dados.id_usuario) {
        throw new Error("id_usuario inválido");
    }

    if (!dados.id_exchange) {
        throw new Error("id_exchange inválido");
    }

    return
};

const validarRequisitosExchange = (dados) => {

    if (!dados) {
        throw new Error("usuário não encontrado");
    }

    return
};

module.exports = {
    validarDados,
    validarRequisitosExchange
};
