angular.module('addSurveyCtrl', [])

  .controller('AddSurveyController', ['Admin', '$state', function (Admin, $state) {

    var vm = this;
    vm.choices = [{id: 'choice1'}, {id: 'choice2'}];

    // add another choice input field
    vm.showAddChoice = function(choice) {
      return choice.id === vm.choices[vm.choices.length-1].id;
    };

    vm.addNewChoice = function() {
      var newItemNo = vm.choices.length+1;
      vm.choices.push({'id':'choice'+newItemNo});
    };

    vm.createNewSurvey = function () {
      // array of all the choies input
      var formChoies = [];
      vm.choices.forEach(function (e) {
        formChoies.push(e.inputChoice);
      });
      // call Admin Factory to create a new survey question
      Admin.createNewSurvey(vm.inputQuestion, formChoies).then(function(){
        // reset the input fields
        vm.choices = [{id: 'choice1'}, {id: 'choice2'}];
        vm.inputQuestion = '';
        alert('new survey question added!');
        $state.go('admin');
      });
    };

  }]);
