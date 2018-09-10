const dados = (dados) => {

    if (!dados.user_id) {
        throw new Error('Usuário inválido')
    }
}

module.exports = {
    dados
}