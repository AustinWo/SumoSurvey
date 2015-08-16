var express = require('express');
// Middleware
var morgan = require('morgan');
// bodyParser to parse json from http request
var bodyParser = require('body-parser');
var mysql = require('mysql');
var cookieParser = require('cookie-parser');
var Sequelize = require('sequelize');
// var sequelize = new Sequelize('survey', 'root', '');
var controller = require('./controllers.js');


var app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cookieParser());

// serve files in client folder
app.use(express.static(__dirname + './../client'));
app.get('/questions', controller.getAllQuestions);
app.get('/answers', controller.getAnswers);
app.get('/getRandomQuestion', controller.getRandomQuestion);
app.post('/resetCookies', controller.resetCookies);
app.post('/vote', controller.vote);
app.post('/login', controller.login);
app.post('/createNewSurvey', controller.createNewSurvey);

module.exports = app;
