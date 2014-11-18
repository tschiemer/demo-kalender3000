var vaServices = angular.module('vaServices', ['ngResource']);

vaServices.factory('Session',['$http',function($http){
    var Session = {
        data: false,
        loggedIn: function(){
            return Session.data != false;
        },
        login: function(username,password,onComplete){
            $http.post('login',{
                email: username,
                password: password
            }).success(function(data){
                data = angular.fromJson(data);
                if (data){
                    Session.data = data;
                } else {
                    Session.data = false;
                }
                onComplete(data);
            }).error(function(error){
                onComplete(null,error)
            });
        },
        logout: function(onComplete){
            $http.get('logout').success(function(data){
               Session.data = false; 
               onComplete(data);
            });
        }
    };
    $http.get('login').success(function(data){
        data = angular.fromJson(data);
        if (data){
            Session.data = data;
        } else {
            Session.data = false;
        }
    });
    return Session;
}]);

vaServices.factory('Event', ['$resource',
    function($resource){
        return $resource('event/:eventId', {}, {
        get: {method:'GET'},
        query: {method:'GET', isArray:true},
        create: {method:'POST'},
        save: {method:'PUT'},
        delete: {method:'DELETE'}
    });
}]);
  
vaServices.factory('User', ['$resource',
    function($resource){
        return $resource('user/:userId', {}, {
            get: {method:'GET'},
            query: {method:'GET', isArray:true},
            create: {method:'POST'},
            save: {method:'PUT'},
            delete: {method:'DELETE'}
    });
}]);

vaServices.factory('Invitee', ['$resource',
    function($resource){
        return $resource('invitee/:eventId/:inviteeId', {}, {
//            get: {method:'GET'},
//            query: {method:'GET', isArray:true},
            create: {method:'POST'},
            save: {method:'PUT'},
//            delete: {method:'DELETE'},
            confirmParticipation: {method: 'POST', url:'invitee/:eventId/:inviteeId/confirmed'},
            declineParticipation: {method: 'POST', url:'invitee/:eventId/:inviteeId/declined'},
            maybeParticipation: {method: 'POST', url:'invitee/:eventId/:inviteeId/maybe'}
    });
}]);

vaServices.factory('Todo', ['$resource',
    function($resource){
        return $resource('todo/:todoId', {}, {
            get: {method:'GET'},
            query: {method:'GET', isArray:true},
            create: {method:'POST'},
            save: {method:'PUT'},
            delete: {method:'DELETE'}
    });
}]);