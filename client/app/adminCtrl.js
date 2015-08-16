angular.module('adminCtrl', [])

  .controller('AdminController', ['Admin', function (Admin) {

    var vm = this;
    vm.questionsArr;
    vm.questions = [];

    // use Admin factory to make ajax request to get all survey questions & responses
    Admin.getQuestions().then(function (response) {
      vm.questionsArr = response;
      vm.questionsArr.forEach(function (q) {
        vm.questions.push(q.question);
      })
    });

  }]);
