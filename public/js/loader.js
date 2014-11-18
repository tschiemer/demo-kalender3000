requirejs.config({
    baseUrl: '',
    paths: {
        angular: 'bower_components/angular/angular.min',
        ngRoute: 'bower_components/angular-route/angular-route.min',
        ngResource: 'bower_components/angular-resource/angular-resource.min',
        ngBootstapDatetimePicker: 'bower_components/angular-bootstrap-datetimepicker/src/js/datetimepicker',
        ngTagsInput: 'bower_components/ng-tags-input/ng-tags-input.min',
        bootstrap: 'bower_components/bootstrap/dist/js/bootstrap.min',
//        bootstrapDatepicker: 'bower_components/bootstrap-datepicker/js/bootstrap-datepicker',
//        bootstrapDatetimepicker: 'bower_components/bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min',
        jquery: 'bower_components/jquery/dist/jquery.min',
        moment: 'bower_components/moment/min/moment-with-locales.min'
    }
});

require(['jquery'],function(){
   require(['bootstrap','angular','moment'],function(){
       
       require(['ngRoute','ngResource','ngBootstapDatetimePicker','ngTagsInput'],function(){
           
            var vaApp = angular.module('vaApp', [
                'ngRoute',
                'ui.bootstrap.datetimepicker',
                'ngTagsInput',
                'vaControllers',
                'vaServices'
            ]);
       
            vaApp.config(['$routeProvider',
                 function($routeProvider) {
                   $routeProvider.
                     when('/events', {
                       templateUrl: 'partials/event-list.html',
                       controller: 'eventList'
                     }).
                     when('/events/:eventId', {
                       templateUrl: 'partials/event-details.html',
                       controller: 'eventDetails'
                     }).
                     when('/todos', {
                       templateUrl: 'partials/todo-list.html',
                       controller: 'todoList'
                     }).
                     when('/todos/:todoId', {
                       templateUrl: 'partials/todo-details.html',
                       controller: 'todoDetails'
                     }).
                     when('/users', {
                       templateUrl: 'partials/user-list.html',
                       controller: 'userList'
                     }).
//                     when('/users/:userId', {
//                       templateUrl: 'partials/user-details.html',
//                       controller: 'userDetails'
//                     }).
                     otherwise({
                       redirectTo: '/events'
                     });
                 }]);
             
            require(['js/controllers','js/services'],function(){
                angular.element(document).ready(function() {
                    angular.bootstrap(document,["vaApp"]);
                });
            });
       });
   });
});