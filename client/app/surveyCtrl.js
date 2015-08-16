angular.module('surveyCtrl', [])

  .controller('SurveyController', ['Survey', function (Survey) {

    var vm = this;
    vm.answers = [];
    vm.show = true;
    vm.responded = false;
    vm.disableSubmit = true;

    // get a random survey question which has not been answered
    vm.getRandomQuestion = function () {
      Survey.getRandomQuestion().then(function (response) {
        if (response.done) {
          vm.show = false;
        } else {
          vm.randomQuestion = response.q['0'].question;
          vm.qId = response.q['0'].qId;
          response.ans.forEach(function (a) {
            vm.answers.push({aId: a.aId, answer: a.answer});
          });
        }
      });
    };

    // fetch a random question when the page is loaded
    vm.getRandomQuestion();

    // reset the cookies
    vm.resetCookies = function () {
      Survey.deleteAllCookies().then(function () {
        vm.responded = false;
        vm.show = true;
        vm.randomQuestion = '';
        vm.qId = '';
        vm.answers = [];
        vm.getRandomQuestion();
      });
    };

    // fetch next question
    vm.nextQuestion = function () {
      vm.responded = false;
      vm.randomQuestion = '';
      vm.qId = '';
      vm.answers = [];
      // disable the submit button until a response is chosen
      document.getElementById('answerSubmit').disabled = true;
      vm.getRandomQuestion();
    };

    // answer a survey
    vm.submit = function () {
      Survey.vote(vm.radioValue, vm.qId).then(function (response) {
      });
      vm.responded = true;
    };

  }]);
