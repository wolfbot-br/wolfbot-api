const bodyParser = require('body-parser')
const express = require('express')
const allowCors = require('./cors')
const consign = require('consign')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(allowCors)

consign()
  .include('/src/infraestrutura/mongo/index.js')
  .then('/src/api/account')
  .then('/src/api/historico')
  .then('/src/api/index')
  .then('/src/api/util')
  .then('/src/api/exchanges')
  .then('/src/api/exchange')
  .then('/src/api/configuracao')
  .then('/src/api/bot')
  .into(app)

module.exports = app
