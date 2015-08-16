angular.module('loginCtrl', [])

  .controller('LoginController', ['Admin', '$state', '$window', '$rootScope', function (Admin, $state, $window, $rootScope) {

    var vm = this;
    vm.loginFail = false;

    // admin login
    vm.doLogin = function () {
      // send ajax request to log admin in
      Admin.doLogin(vm.username, vm.password).then(function (token) {
        // set the token in local storage
        $window.localStorage.setItem('SumoSurvey', token.token);
        $rootScope.loggedIn = true;
        // redirect to admin page
        $state.go('admin');
      }).catch(function (error) {
        console.log('login fail');
        vm.loginFail = true;
      });
    };

  }]);
