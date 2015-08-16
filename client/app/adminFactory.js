angular.module('adminFactory', [])

.factory('Admin', ['$http', function ($http) {

  var adminFactory = {};

  // ajax request to get all questions
  adminFactory.getQuestions = function () {
    return $http({
      url: 'http://localhost:5000/questions',
      dataType: 'json',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(response) {
      return response.data;
    });
  };

  // ajax request to get all answers
  adminFactory.getAnswers = function () {
    return $http({
      url: 'http://localhost:5000/answers',
      dataType: 'json',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(response) {
      return response.data;
    });
  };

  // ajax request to create a new survey
  adminFactory.createNewSurvey = function (question, choiceArr) {
    return $http({
      url: 'http://localhost:5000/createNewSurvey',
      dataType: 'json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        question: question,
        choices: choiceArr
      }
    }).then(function(response) {
      return response.data;
    });
  };

  // ajax request to authenticate admin
  adminFactory.doLogin = function (username, password) {
    return $http({
      url: 'http://localhost:5000/login',
      dataType: 'json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        username: username,
        password: password
      }
    }).then(function(response) {
      return response.data;
    });
  };

  return adminFactory;

}]);
