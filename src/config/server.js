const bodyParser = require('body-parser');
const express = require('express');
const allowCors = require('./cors');
const consign = require('consign');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(allowCors);

consign()
  .include('/src/infraestrutura/index.js')
  .then('/src/api/account')
  .then('/src/api/index')
  .into(app);

module.exports = app;
