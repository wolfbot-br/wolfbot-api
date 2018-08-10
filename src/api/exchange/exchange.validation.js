const validade_exchange = exchange => {
  const errors = []

  if (!exchange) {
    errors.push(Object.assign({}, {
      message: 'Informe o nome da exchange',
      status: '400'
    }))
  }

  return errors
}

module.exports = { validade_exchange }
