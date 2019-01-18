const dados = (dados) => {

    if (!dados.user_id) {
        throw new Error('Usuário inválido')
    }
}

export default  {
    dados
}