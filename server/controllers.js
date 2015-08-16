// All logic interactions taking info from request and responding from db
var jwt = require('jwt-simple');
var Cookies = require('cookies');
// secret for jwt
var secret = 'SumoSurveyIsAwesome';
var db = require('./db/models.js');


// ===========================================
// AJAX GET/POST methods
// ===========================================

module.exports = {

  // admin login
  login: function (req, res) {
    var userModel;
    db.Users.findOne({where: {username: req.body.username, password: req.body.password}})
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
  },

  getAllQuestionsAndAnswers: function (req, res) {
    db.Questions.findAll().then(function (questions) {
      db.Answers.findAll().then(function (answers) {
        res.send({ question: questions, answer: answers});
      });
    });
  },

  getAllQuestions: function (req, res) {
    db.Questions.findAll().then(function (questions) {
      res.send(questions);
    });
  },

  getAnswers: function (req, res) {
    db.Answers.findAll().then(function (answers) {
      res.send(answers);
    });
  },

  // handle survey response (vote) to a particular question and save to the database
  vote: function (req, res) {
    var answeredId = req.body.aId;
    var qId = req.body.qId;
    db.Answers.findOne({ where: {
      aId: req.body.aId
    }}).then(function(answer) {
      // increase the answer_count by one
      db.answer.increment({answer_count: 1})
    }).then(function () {
      console.log('incremented answer count by 1');
      var cookies = new Cookies(req, res, ['austin','sumo']);
      var cookieValue = 'answered'
      cookies.set(qId,cookieValue, {httpOnly: false, overwrite: true});
      console.log('setting cookie ',qId ,'to ', cookieValue)
      res.sendStatus(200);
    });
  },

  // parse the cookie and present the question that was not already answered
  getRandomQuestion: function (req, res) {

    db.Questions.findAndCountAll().then(function (result) {

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
        db.Questions.findAll({where : {qId: randomQId}})
          .then(function (q) {
          db.Answers.findAll({where: {qId: randomQId}})
          .then(function (ans) {
            res.send({ q: q, ans: ans});
          })
        })
      }
    });
  },

  // reset cookies to allow user to take surveys again
  resetCookies: function (req, res) {
    var cookies = new Cookies(req, res, ['austin','sumo']);
    db.Questions.findAndCountAll().then(function (result) {
      var totalQuestions = result.count;
      for (var i = 1; i <= totalQuestions; i++) {
        console.log('deleting cookie qId ', i);
        var str = i.toString();
        cookies.set(str, '');
      }
      res.send('deleted all cookies');
    });
  },

  // admin can create a new survey question
  createNewSurvey: function (req, res) {
    var question = req.body.question;
    var choiceArr = req.body.choices;
    var newQuestionId;
    // if question is new, create a new question, otherwise just add choices to the question
    db.Questions.findOrCreate({where: {question: question}})
    .spread(function(question, created) {
      // grab the id of the survey question created
      newQuestionId = question.dataValues.qId;
      console.log(question.get({plain: true}));
      console.log(created)
      choiceArr.forEach((function(choice) {
        // add answers for the survey question created
        db.Answers.findOrCreate({where: {answer: choice, qId: newQuestionId}})
        .spread(function(choiceAdded, created) {
          console.log(choiceAdded.get({plain: true}));
          console.log(created);
        })
      }))
    }).then(function(done) {
        res.sendStatus(200);
    });
  }

};
