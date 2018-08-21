const bodyParser = require('body-parser')
const express = require('express')
const allowCors = require('./cors')
const consign = require('consign')
const helmet = require('helmet')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(allowCors)
app.use(helmet())

consign()
  .include('/src/infraestrutura/mongo/index.js')
  .then('/src/api/account')
  .then('/src/api/historico')
  .then('/src/api/exchanges')
  .then('/src/api/index')
  .then('/src/api/util')
  .then('/src/api/configuracao')
  .then('/src/api/bot')
  .into(app)

module.exports = app
