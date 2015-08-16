var express = require('express');
var mysql = require('mysql');
var Sequelize = require('sequelize');
var cookieParser = require('cookie-parser');
var Cookies = require('cookies');
var jwt = require('jwt-simple');
// secret for jwt
var secret = 'SumoSurveyIsAwesome';

// Middleware
var morgan = require('morgan');
// bodyParser to parse json from http request
var bodyParser = require('body-parser');

var app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cookieParser());

// serve files in client folder
app.use(express.static(__dirname + './../client'));


// ===========================================
// sequelize database initialization
// ===========================================

// change to your database username and password here
// database name: 'survey'
// username: 'root'
// password: none
var sequelize = new Sequelize('survey', 'root', '');

// define the Users table
var Users = sequelize.define('Users', {
  uId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  username: Sequelize.STRING,
  password: Sequelize.STRING
}, {
  timestamps: false
});

// define the Questions table
var Questions = sequelize.define('Questions', {
  qId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  question: Sequelize.STRING
}, {
  timestamps: false
});

// define the Answers table
var Answers = sequelize.define('Answers', {
  aId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  answer: Sequelize.STRING,
  answer_count: { type: Sequelize.INTEGER, defaultValue: 0},
  // instead of making a qId attribute on Answers, we could also use foreign key from Questions table
  qId: { type: Sequelize.INTEGER}
}, {
  timestamps: false
});

// sequelize.sync() will create any missing tables
// {force: true} will first drop the tables before recreating them
Users.sync({force: true}).then(function() {
  // create a dummy username and password
  Users.create({username: 'admin', password: 'admin'});
  console.log('created Users table');
  }).catch(function(error) {
    throw new Error('error creating user for Users table: try dropping all the tables in your MySQL')
  });

Questions.sync({force: true}).then(function() {
  // OPTIONAL: create a new questions upon instantiating the db using sequelize
  Questions.create({question: 'What is your favorite programming language?'});
  Questions.create({question: 'What is your favorite drink?'});
  Questions.create({question: 'Where do you live?'});
  Questions.create({question: 'Do you love SumoSurvey?'});
  console.log('created Questions table');
  }).catch(function(error) {
    throw new Error('error creating questions for Questions table: try dropping all the tables in your MySQL')
  });

Answers.sync({force: true}).then(function() {
  // OPTIONAL: create a new answers upon instantiating the db using sequelize
  Answers.create({answer: 'Python', qId: 1});
  Answers.create({answer: 'JavaScript', qId: 1});
  Answers.create({answer: 'Ruby', qId: 1});
  Answers.create({answer: 'C++', qId: 1});
  Answers.create({answer: 'Manhattan', qId: 2});
  Answers.create({answer: 'Cosmopolitan', qId: 2});
  Answers.create({answer: 'U.S.A.', qId: 3});
  Answers.create({answer: 'Canada', qId: 3});
  Answers.create({answer: 'China', qId: 3});
  Answers.create({answer: 'I love SumoSurvey!', qId: 4});
  Answers.create({answer: 'Meh', qId: 4});
  Answers.create({answer: 'I\'d rather not see another survey', qId: 4});
  console.log('created Answers table');
}).catch(function(error) {
  throw  new Error('error creating answers for Answers table: try dropping all the tables in your MySQL');
});


// ===========================================
// AJAX GET/POST methods
// ===========================================

// admin login
var login = function (req, res) {
  var userModel;
  Users.findOne({where: {username: req.body.username, password: req.body.password}})
    .then(function (u) {
      if (u) {
        var token = jwt.encode(u, secret);
        console.log(token);
        res.send({
          token: token
        });
      } else {
        console.log('incorrect username and password');
        res.send(401);
      }
    }).catch(function(error) {
      console.log('failed to log you in');
      res.send(401);
    })
};

var getAllQuestionsAndAnswers = function (req, res) {
  Questions.findAll().then(function (questions) {
    Answers.findAll().then(function (answers) {
      res.send({ question: questions, answer: answers});
    });
  });
};

var getAllQuestions = function (req, res) {
  Questions.findAll().then(function (questions) {
    res.send(questions);
  });
};

var getAnswers = function (req, res) {
  Answers.findAll().then(function (answers) {
    res.send(answers);
  });
};

// handle survey response (vote) to a particular question and save to the database
var vote = function (req, res) {
  var answeredId = req.body.aId;
  var qId = req.body.qId;
  Answers.findOne({ where: {
    aId: req.body.aId
  }}).then(function(answer) {
    // increase the answer_count by one
    answer.increment({answer_count: 1})
  }).then(function () {
    console.log('incremented answer count by 1');
    var cookies = new Cookies(req, res, ['austin','sumo']);
    var cookieValue = 'answered'
    cookies.set(qId,cookieValue, {httpOnly: false, overwrite: true});
    console.log('setting cookie ',qId ,'to ', cookieValue)
    res.sendStatus(200);
  });
};

// parse the cookie and present the question that was not already answered
var getRandomQuestion = function (req, res) {

  Questions.findAndCountAll().then(function (result) {

    var cookies = new Cookies(req, res, ['austin','sumo']);
    var totalQuestions = result.count;

    var generateRandomQId = function () {
      return Math.ceil(Math.random()*result.count);;
    };
    // using cookies stored on client's brower to check for unanswered survey question
    var randomQId = generateRandomQId();
    var randomQIdStr = randomQId.toString();
    console.log('randomQId ', randomQId);
    console.log('randomQIdStr ', randomQIdStr);
    var parsedCookie = cookies.get(randomQIdStr);
    console.log('parsedCookie ', parsedCookie);
    var count = 0;
    // get a survey question which has not been answered
    while (parsedCookie !== undefined && count < totalQuestions) {
      count++;
      randomQId = generateRandomQId();
      randomQIdStr = randomQId.toString();
      parsedCookie = cookies.get(randomQIdStr);
    }
    if (count >= totalQuestions) {
      // if all survey questions are already answered, send response back to client
      res.send({done: true});
    } else {
      // otherwise send another unanswered survey question
      Questions.findAll({where : {qId: randomQId}})
        .then(function (q) {
        Answers.findAll({where: {qId: randomQId}})
        .then(function (ans) {
          res.send({ q: q, ans: ans});
        })
      })
    }
  });
};

// reset cookies to allow user to take surveys again
var resetCookies = function (req, res) {
  var cookies = new Cookies(req, res, ['austin','sumo']);
  Questions.findAndCountAll().then(function (result) {
    var totalQuestions = result.count;
    for (var i = 1; i <= totalQuestions; i++) {
      console.log('deleting cookie qId ', i);
      var str = i.toString();
      cookies.set(str, '');
    }
    res.send('deleted all cookies');
  });
};

// admin can create a new survey question
var createNewSurvey = function (req, res) {
  var question = req.body.question;
  var choiceArr = req.body.choices;
  var newQuestionId;
  // if question is new, create a new question, otherwise just add choices to the question
  Questions.findOrCreate({where: {question: question}})
  .spread(function(question, created) {
    // grab the id of the survey question created
    newQuestionId = question.dataValues.qId;
    console.log(question.get({plain: true}));
    console.log(created)
    choiceArr.forEach((function(choice) {
      // add answers for the survey question created
      Answers.findOrCreate({where: {answer: choice, qId: newQuestionId}})
      .spread(function(choiceAdded, created) {
        console.log(choiceAdded.get({plain: true}));
        console.log(created);
      })
    }))
  }).then(function(done) {
      res.sendStatus(200);
  });
};

sequelize.sync().then(function (err) {
  app.get('/questions', getAllQuestions);
  app.get('/answers', getAnswers);
  app.get('/getRandomQuestion', getRandomQuestion);
  app.post('/resetCookies', resetCookies);
  app.post('/vote', vote);
  app.post('/login', login);
  app.post('/createNewSurvey', createNewSurvey);
  app.listen(5000);
  console.log('SumoSurvey magic being delivered on port 5000');
});
