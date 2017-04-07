var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var ConnectCas = require('node-cas-client');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var MemoryStore = require('session-memory-store')(session);

var app = express();
var index = require('./routes/index');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(session({
  name: 'projectmanager',
  secret: 'secret',
  store: new MemoryStore()  // or other session store
}));

var casClient = new ConnectCas({
  debug: false,
  servicePrefix: 'http://localhost:3000',
  serverPath: 'https://sso.hikvision.com',
  paths: {
    serviceValidate: '/serviceValidate',
    proxy:'',
    login: '/login',
    logout: '/logout',
    proxyCallback: ''
  },
/*  ignore:[
      'plugins',
      'fonts'
  ],*/
  redirect: false,
  gateway: false,
  renew: false,
  slo: true,
  requestCert: true,
  rejectUnauthorized: false,
  restletIntegration:'',
  cache: {
    enable: false,
    ttl: 5 * 60 * 1000,
    filter: []
  },
  fromAjax: {
    header: 'x-client-ajax',
    status: 418
  }
});

app.use(casClient.core());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/logout', casClient.logout());




app.use('/', index);

module.exports = app;
