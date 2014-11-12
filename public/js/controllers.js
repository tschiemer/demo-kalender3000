var vaControllers = angular.module('vaControllers', []);

vaControllers.controller('menuController',
    ['$scope','Session',
    function($scope,Session){
        
//        console.log($routeParams);

        $scope.goto = function(target){
            console.log(target);
        };
        
        $scope.session = Session;
        $scope.credentials = {
            username: '',
            password: ''
        };
        $scope.login = function(){
            Session.login($scope.credentials.username,$scope.credentials.password,function(data){
               console.log('logged in?', data); 
               $scope.credentials.password = '';
            });
        };
        $scope.logout = function(){
            Session.logout(function(data){
                console.log('logged out',data);
                $scope.credentials = {
                    username: '',
                    password: ''
                };
            })
        }
}]);

vaControllers.controller('eventList',
    ['$scope','$location','Session','Event',
    function ($scope,$location,Session,Event) {
        $scope.session = Session;
        
        $scope.refreshEvents = function(){
            $scope.events = Event.query();
        };
        $scope.refreshEvents();
        
        $scope.formatDate = function(str){
            var d = new moment(str);
            if (d.isValid()){
                return d.format('MMM Do YYYY');
            } else {
                return '';
            }
        };
        
        $scope.pick = function(event){
            $location.path('/events/'+event.id);
        };
        
        
        // create new event
        var visible = false;
        $scope.toggleNewEventView = function(){
            if (visible){
                $('#newEventForm').slideUp();
                visible = false;
            } else {
                $('#newEventForm').slideDown();
                visible = true;
            }
        };
        
        $scope.resetEditEvent = function(){
            $scope.editEvent = {
                name: '',
                startDate: '',
                location: '',
                description: '',
                state: 'draft'
            };
        };
        $scope.resetEditEvent();
//        $('.input-group.date').datepicker({
//            weekStart: 1
//        });
//        $('.input-group.date.datetime').datetimepicker({ format: 'yyyy-MM-dd' });

        $scope.saveEvent = function(){
//            console.log("fooofooofooofooo");
            var m = new moment($scope.editEvent.startDate);
//            console.log(m.format('MMMM Do YYYY h:mm:ss a'));
            $scope.editEvent.startDate = m.format('YYYY-MM-DD hh:mm:ss');
            Event.create($scope.editEvent,function(){
                $scope.toggleNewEventView();
                $scope.refreshEvents();
                $scope.resetEditEvent();
            });
        };
        
        $scope.removeEvent = function(event){
            Event.delete({eventId:event.id},function(){
                $scope.refreshEvents();
            });
        };
}]);

vaControllers.controller('eventDetails',
    ['$scope','$routeParams','Session','Event','Invitee',
    function ($scope,$routeParams,Session,Event,Invitee) {
        $scope.session = Session;
        $scope.event = Event.get({eventId:$routeParams.eventId});
        $scope.invitees = Invitee.query({eventId:$routeParams.eventId});
        
        $scope.editing = false;
        
        $scope.resetEditEvent = function(){
            $scope.editEvent = {
                name: '',
                startDate: '',
                location: '',
                description: '',
                state: 'draft'
            };
        };
        $scope.resetEditEvent();
        
        $scope.startEditing = function(){
            $scope.editing = true;
            $scope.editEvent = $scope.event;
        };
        
        $scope.saveChanges = function(){
            Event.save({eventId:$routeParams.eventId},$scope.editEvent,function(){
                $scope.event = $scope.editEvent;
                $scope.editing = false; 
            });
        };
        $scope.discardChanges = function(){
            $scope.editing = false;
        };
        
        $scope.newInvitee = {
            name: '',
            email: '',
            text: ''
        };
        $scope.invite = function(){
            Invitee.create({eventId:$routeParams.eventId},$scope.newInvitee,function(data){
                $scope.invitees = Invitee.query({eventId:$routeParams.eventId});
            })
        };
        $scope.uninvite = function(invitee){
            Invitee.delete({eventId:$routeParams.eventId, inviteeId:invitee.id},function(){
                $scope.invitees = Invitee.query({eventId:$routeParams.eventId});
            });
        };
}]);



vaControllers.controller('userList',
    ['$scope','$location','Session','User',
    function ($scope,$location,Session,User) {
        $scope.session = Session;
        
        $scope.refreshList = function(){
            $scope.users = User.query();
        };
        $scope.refreshList();
        
        $scope.pick = function(user){
            $location.path('/users/'+user.id);
        };
        
        var visible = false;
        $scope.toggleNewUserView = function(){
            if (visible){
                $('#newUserForm').slideUp();
                visible = false;
            } else {
                $('#newUserForm').slideDown();
                visible = true;
            }
        };
        
        $scope.resetEditUser = function(){
            $scope.editUser = {
                username: '',
                password:  '',
                email: ''
            };
        }
        $scope.resetEditUser();
        $scope.saveUser = function(){
            User.create($scope.editUser,function(){
                $scope.toggleNewUserView();
                $scope.refreshList();
                $scope.resetEditUser();
            });
        };
        
        $scope.deleteUser = function(user){
            User.delete({userId:user.id},function(){
                $scope.refreshList();
            });
        };
}]);

vaControllers.controller('userDetails',
    ['$scope','$routeParams','Session','User',
    function ($scope,$routeParams,Session,User) {
        $scope.session = Session;
        $scope.user = User.get({userId:$routeParams.userId});
}]);


vaControllers.controller('todoList',
    ['$scope','$location','Todo',
    function ($scope,$location,Todo) {
        $scope.todos = Todo.query();
        
        $scope.pick = function(todo){
            $location.path('/todos/'+todo.id);
        };
}]);

vaControllers.controller('todoDetails',
    ['$scope','$routeParams','Todo',
    function ($scope,$routeParams,Todo) {
        $scope.todo = Event.get({todoId:$routeParams.todoId});
//        $scope.invitees = Invitee.query({eventId:$routeParams.eventId});
}]);