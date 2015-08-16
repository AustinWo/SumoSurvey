angular.module('answerCtrl', [])

  .controller('AnswerController', ['Admin', function (Admin) {

    var vm = this;
    vm.answers = [];
    vm.answersArr = [];
    vm.Total = 0;

    // use Admin factory to make ajax request to get all answers
    Admin.getAnswers().then(function (response) {
      vm.answers = angular.copy(response);
      vm.answersArr.forEach(function (a) {
      })
    });

    // show the number of responses for each answer
    vm.getTotal = function () {
      for (var i = 0; i < vm.answer.answers.length; i++) {
        var answer = vm.answer.answers[i];
        total += answer.answer_count;
      }
      return total;
    };

  }]);
