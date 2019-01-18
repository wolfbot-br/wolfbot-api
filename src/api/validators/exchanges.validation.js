const validarDados = (dados) => {
  if (!dados.user_id) {
    throw new Error('id_usuario inválido')
  }
}

const validarRequisitosExchange = (dados) => {
  if (!dados) {
    throw new Error('Usuário não encontrado')
  }
}

export default  {
  validarDados,
  validarRequisitosExchange
}
