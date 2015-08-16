angular.module('answerCtrl', [])

  .controller('AnswerController', ['Admin', function (Admin) {

    var vm = this;
    vm.answers = [];

    // use Admin factory to make ajax request to get all answers
    Admin.getAnswers().then(function (response) {
      vm.answers = angular.copy(response);
    });

  }]);
