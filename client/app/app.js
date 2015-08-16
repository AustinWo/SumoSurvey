var SumoSurveyApp = angular.module('SumoSurveyApp', [
  'ui.router',
  'surveyCtrl',
  'surveyFactory',
  'adminCtrl',
  'adminFactory',
  'answerCtrl',
  'addSurveyCtrl',
  'loginCtrl'
  ]);

SumoSurveyApp.config(function ($stateProvider, $urlRouterProvider) {

  // redirect all other urls to main survey page
  $urlRouterProvider.otherwise('/');

  // angular state ui route
  $stateProvider

  .state('survey', {
    url: '/',
    templateUrl: 'app/survey.html',
    data: {
      requireLogin: false
    }
  })
  .state('login', {
    url: '/login',
    templateUrl: 'app/login.html',
    data: {
      requireLogin: false
    }
  })
  .state('logout',{
    url: '/logout',
    controller: function($state, $rootScope, $stateParams, $window){
      // delete the token when admin logs out
      delete $window.localStorage.SumoSurvey;
      // redirect to login
      $state.go('login');
    },
    data: {
      requireLogin: false
    }
  })
  .state('admin', {
    url: '/admin',
    templateUrl: 'app/admin.html',
    data: {
      requireLogin: true
    }
  })
  .state('addSurvey', {
    url: '/addSurvey',
    templateUrl: 'app/addSurvey.html',
    data: {
      requireLogin: true
    }
  });
});

SumoSurveyApp.run(function ($rootScope, $window, $location, $state) {

  // each time the user navigates to different state
  $rootScope.$on('$stateChangeSuccess', function (event, toState){

    // store whether admin is logged in boolean in rootScope
    $rootScope.adminLoggedIn = !!window.localStorage.SumoSurvey;
    var requireLogin = toState.data.requireLogin;
    // checks if page require admin to be logged in
    if(requireLogin){
      // checks if admin is authenticated
      if($rootScope.adminLoggedIn){
        // allow redirect to the page
        $state.go(toState);
      } else {
        // if login is required and is not logged in, rediret to login page
        console.log('User must log in to view this page');
        $state.go('login');
      }
    }
  });

});
