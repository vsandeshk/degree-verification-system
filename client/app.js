const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const routes = require('./api/routes')
const port = 3000

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");

  res.header("Access-Control-Allow-Headers", "*");

  next();

});

app.use(express.static('public'));
app.use(bodyParser.json());
app.use('/api', routes);


 server = app.listen(port);
