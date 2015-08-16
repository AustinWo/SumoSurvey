angular.module('surveyFactory', [])

.factory('Survey', ['$http', function ($http) {

  var surveyFactory = {};

  // ajax request to get a random survey question
  surveyFactory.getRandomQuestion = function () {
    return $http({
      url: 'http://localhost:5000/getRandomQuestion',
      dataType: 'json',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(response) {
      return response.data;
    });
  };

  // ajax request to vote/ respond to a survey
  surveyFactory.vote = function (answerId, qId) {
    return $http({
      url: 'http://localhost:5000/vote',
      dataType: 'json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        qId: qId,
        aId: answerId
      }
    }).then(function(response) {
      return response.data;
    });
  };

  // ajax request to delete all cookies
  surveyFactory.deleteAllCookies = function () {
    return $http({
      url: 'http://localhost:5000/resetCookies',
      dataType: 'json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(response) {
      return response.data;
    });
  };

  return surveyFactory;

}]);
