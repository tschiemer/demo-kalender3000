var vaControllers = angular.module('vaControllers', []);

vaControllers.controller('Settings',
    ['$scope','Session','Setting',
    function($scope,Session,Setting){
        $scope.session = Session;
        $scope.settings = Setting.query();
        
        $scope.update = function(setting){
            console.log(setting);
        }
}]);

vaControllers.controller('menuController',
    ['$scope','$location','Session','Setting',
    function($scope,$location,Session,Setting){

        $scope.goto = function(target){
//            console.log(target);
        };
        
        $scope.session = Session;
        Setting.$.get({settingKey:"pageTitle"},function(data){
            $scope.pageTitle = data.value;
        });
        
        $scope.credentials = {
            username: '',
            password: ''
        };
        $scope.login = function(){
            Session.login($scope.credentials.username,$scope.credentials.password,function(data,error){
               console.log('logged in?', data,error); 
               $scope.credentials.password = '';
               if (data == false) {
                   alert('Ungültiger Benutzername / Passwort');
               } else if (data == null && error){
                   alert("Fehler bei der Anmeldung: " + error.error.message);
               }
            });
        };
        $scope.logout = function(){
            Session.logout(function(data){
//                console.log('logged out',data);
                $scope.credentials = {
                    username: '',
                    password: ''
                };
                if (!$location.path().match(/events/)){
                    $location.path('/events');
                }
            })
        }
}]);

vaControllers.controller('eventList',
    ['$scope','$location','$filter','Session','Event',
    function ($scope,$location,$filter,Session,Event) {
        $scope.session = Session;
        
        $scope.events = Event.query();
        $scope.refreshEvents = function(){
            $scope.events = Event.query();
        };
//        $scope.refreshEvents();
        
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
        
        $scope.saveEvent = function(){
//            console.log("fooofooofooofooo");
            var m = new moment($scope.editEvent.startDate);
//            console.log(m.format('MMMM Do YYYY h:mm:ss a'));
            $scope.editEvent.startDate = m.format('YYYY-MM-DD hh:mm:ss');
            Event.create($scope.editEvent,function(event){
                $scope.toggleNewEventView();
                $scope.resetEditEvent();
                $scope.events.push(event);
            });
        };
        
        $scope.removeEvent = function($index){
            var event = $scope.events[$index];
            Event.delete({eventId:event.id},function(){
                $scope.events.splice($index,1);
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
        
        $scope.newInviteeFormBusy = false;
        $scope.resetNewInvitee = function(){  
            $scope.newInvitee = {
                name: '',
                email: '',
                sendEmail: false,
                text: ''
            };
        };
        $scope.resetNewInvitee();
        
//        $scope.validateEmail = function(){
//            
//        };
        
        $scope.invite = function(){
            $scope.newInviteeFormBusy = true;
            Invitee.create({eventId:$routeParams.eventId},$scope.newInvitee,function(invitee){
                $scope.invitees = Invitee.query({eventId:$routeParams.eventId});
                $scope.newInviteeFormBusy = false;
                $scope.invitees.push(invitee);
            })
        };
        $scope.uninvite = function($index){
            var invitee = $scope.invitees[$index];
            Invitee.delete({eventId:$routeParams.eventId, inviteeId:invitee.id},function(){
                $scope.invitees.splice($index,1);
            });
        };
        
        $scope.confirm = function(idx){
            var invitee = $scope.invitees[idx];
//            console.log("confirm: ",invitee,{eventId:$routeParams.eventId, inviteeId:invitee.id});
            Invitee.confirmParticipation({eventId:$routeParams.eventId, inviteeId:invitee.id},{},function(){
//                $scope.invitees = Invitee.query({eventId:$routeParams.eventId});
                invitee.participation = 'confirmed';
            });
        };
        
        $scope.decline = function(idx){
            var invitee = $scope.invitees[idx];
            Invitee.declineParticipation({eventId:$routeParams.eventId, inviteeId:invitee.id},{},function(){
                invitee.participation = 'declined';
            });
        };
        
        $scope.maybe = function(idx){
            var invitee = $scope.invitees[idx];
            Invitee.maybeParticipation({eventId:$routeParams.eventId, inviteeId:invitee.id},{},function(){
                invitee.participation = 'maybe';
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
                email: '',
                pending: false
            };
        }
        $scope.resetEditUser();
        $scope.saveUser = function(){
            $scope.editUser.pending = true;
            User.create($scope.editUser,function(user){
                $scope.toggleNewUserView();
                $scope.users.push(user);
                $scope.editUser.pending = false;
                
                if (Session.isTemp()){
                    Session.login($scope.editUser.email, $scope.editUser.password);
                }
                
                $scope.resetEditUser();
            });
        };
        
        $scope.deleteUser = function($index){
            var user = $scope.users[$index];
            console.log('user',user);
            User.delete({userId:user.id},function(){
//                $scope.refreshList();
                $scope.users.splice($index,1);
                
                if (user.id == Session.data.id){
                    Session.logout(function(){
                        document.location.reload();
                    });
                }
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
    ['$scope','$location','$q','Session','Todo','User',
    function ($scope,$location,$q,Session,Todo,User) {
        
        $scope.session = Session;
        
        $scope.showByState = '';
        
        $scope.refreshTodos = function(){
            $scope.todos = Todo.query();
        };
        $scope.refreshTodos();
        
        var visible = false;
        $scope.toggleNewTodoView = function(){
            if (visible){
                $('#newTodoForm').slideUp();
                visible = false;
            } else {
                $('#newTodoForm').slideDown();
                visible = true;
            }
        };
        
        
        $scope.formatDate = function(str){
            var d = new moment(str);
            if (d.isValid()){
                return d.format('MMM Do YYYY');
            } else {
                return '';
            }
        };
        
        $scope.orderByPriority = function(obj){
            switch(obj.priority){
                case 'critical':    return 1;
                case 'high':        return 2;
                case 'normal':      return 3;
                case 'low':         return 4;
            }
        };
        
        $scope.pick = function(todo){
            $location.path('/todos/'+todo.id);
        };
        
        
        $scope.resetEditTodo = function(){
            $scope.editTodo = {
                name: '',
                priority: 'normal',
                deadline: '',
                description: '',
                assignees: []
            };
        };
        $scope.resetEditTodo();
        
        var autocompleteAssignees = User.query();
        $scope.findAutocompleteAssignees = function($query){
            
            $query = $query.toLowerCase();
            
            var candidates = [];
            for(var i=0; i < autocompleteAssignees.length; i++){
                var c = autocompleteAssignees[i];
//                console.log(c);?
//                console.log(c.username,c.email);
                if (c.username.toLowerCase().match($query) || c.email.toLowerCase().match($query)){
                    console.log('match for ',c.username);
                    c.text = c.username;
                    candidates.push(c);
                }
            }
            
            var deferred = $q.defer();
            deferred.resolve(candidates);
            return deferred.promise;
        };
        
        $scope.saveTodo = function(){
            console.log($scope.editTodo.assignees);
//            console.log("fooofooofooofooo");
            var m = new moment($scope.editTodo.deadline);
//            console.log(m.format('MMMM Do YYYY h:mm:ss a'));
            $scope.editTodo.deadline = m.format('YYYY-MM-DD hh:mm:ss');
            Todo.create($scope.editTodo,function(data){
                data.assignees = $scope.editTodo.assignees;
                $scope.toggleNewTodoView();
                $scope.resetEditTodo();
                $scope.todos.push(data);
            });
        };
        
        $scope.removeTodo = function($index){
            var todo = $scope.todos[$index];
            Todo.delete({todoId:todo.id},function(){
                $scope.todos.splice($index,1);
            });
        };
}]);

vaControllers.controller('todoDetails',
    ['$scope','$routeParams','$q','Session','Todo','User',
    function ($scope,$routeParams,$q,Session,Todo,User) {
        $scope.session = Session;
        $scope.todo = Todo.get({todoId:$routeParams.todoId});
        
        $scope.closeTodo = function(){
            Todo.closeState({todoId:$routeParams.todoId},{},function(data){
                $scope.todo = data;
            });
        };
        $scope.reopenTodo = function(){
            Todo.pendingState({todoId:$routeParams.todoId},{},function(data){
                $scope.todo = data;
            });
        };
        
        
        
        $scope.resetEditTodo = function(){
            $scope.editTodo = {
                name: '',
                priority: 'normal',
                deadline: ''
                
            };
        };
        $scope.resetEditTodo();
        
        $scope.editing = false;
        $scope.startEditing = function(){
            $scope.editing = true;
            $scope.editTodo = $scope.todo;
            for(var i = 0; i < $scope.editTodo.assignees.length; i++){
                $scope.editTodo.assignees[i].text = $scope.editTodo.assignees[i].username;
            }
        };
        
        $scope.saveChanges = function(){
            Todo.save({todoId:$routeParams.todoId},$scope.editTodo,function(){
                $scope.todo = $scope.editTodo;
                $scope.editing = false; 
            });
        };
        $scope.discardChanges = function(){
            $scope.editing = false;
        };
        
        
        var autocompleteAssignees = User.query();
        $scope.findAutocompleteAssignees = function($query){
            
            $query = $query.toLowerCase();
            
            var candidates = [];
            for(var i=0; i < autocompleteAssignees.length; i++){
                var c = autocompleteAssignees[i];
//                console.log(c);?
//                console.log(c.username,c.email);
                if (c.username.toLowerCase().match($query) || c.email.toLowerCase().match($query)){
                    console.log('match for ',c.username);
                    c.text = c.username;
                    candidates.push(c);
                }
            }
            
            var deferred = $q.defer();
            deferred.resolve(candidates);
            return deferred.promise;
        };
        
//        $scope.invitees = Invitee.query({eventId:$routeParams.eventId});
}]);