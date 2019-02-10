const dados = (data) => {
    if (!data.user_id) {
        throw new Error('Usuário inválido');
    }
};

export default {
    dados,
};
