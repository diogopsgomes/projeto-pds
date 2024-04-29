const express = require('express');
const app = express();
const requireDir = require('require-dir');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let routes = requireDir('./routes');
for (let i in routes) app.use('/', routes[i]);

module.exports = app;