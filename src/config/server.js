const bodyParser = require('body-parser');
const express = require('express');
const allowCors = require('./cors');
const consign = require('consign');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(allowCors);

consign()
  .include('/src/api/routes')
  .then('/src/infrastructure')
  .then('/src/api/controllers')
  .then('/src/api/validations')
  .into(app);

module.exports = app;
