var Sequelize = require('sequelize');

// ===========================================
// sequelize database initialization
// ===========================================

// change to your database username and password here
// database name: 'survey'
// username: 'root'
// password: none

var sequelize = new Sequelize('survey', 'root', '');

var Users = exports.Users = sequelize.define('Users', {
  uId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  username: Sequelize.STRING,
  password: Sequelize.STRING
}, {
  timestamps: false
});

// define the Questions table
var Questions = exports.Questions = sequelize.define('Questions', {
  qId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  question: Sequelize.STRING
}, {
  timestamps: false
});

// define the Answers table
var Answers =  exports.Answers = sequelize.define('Answers', {
  aId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  answer: Sequelize.STRING,
  answer_count: { type: Sequelize.INTEGER, defaultValue: 0},
  // instead of making a qId attribute on Answers, we could also use foreign key from Questions table
  qId: { type: Sequelize.INTEGER}
}, {
  timestamps: false
});

// define the Users table

// sequelize.sync() will create any missing tables
// {force: true} will first drop the tables before recreating them
Users.sync({force: true}).then(function() {
  // create a dummy username and password
  Users.create({username: 'admin', password: 'admin'});
  console.log('created Users table');
  }).catch(function(error) {
    console.log(error);
    throw new Error('error creating user for Users table: try dropping all the tables in your MySQL');
  });

Questions.sync({force: true}).then(function() {
  // OPTIONAL: create a new questions upon instantiating the db using sequelize
  Questions.create({question: 'What is your favorite programming language?'});
  Questions.create({question: 'What is your favorite drink?'});
  Questions.create({question: 'Where do you live?'});
  Questions.create({question: 'Do you love SumoSurvey?'});
  console.log('created Questions table');
  }).catch(function(error) {
    console.log(error);
    throw new Error('error creating questions for Questions table: try dropping all the tables in your MySQL');
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
    console.log(error);
    throw  new Error('error creating answers for Answers table: try dropping all the tables in your MySQL');
  });
