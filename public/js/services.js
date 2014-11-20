var vaServices = angular.module('vaServices', ['ngResource']);


vaServices.factory('Setting',['$resource',
    function($resource){
        var Setting = {
            $:$resource('setting/:settingKey')
        }
        Setting.$.query(function(data){
            for(var i = 0; i < data.length; i++){
                console.log(data[i]);
                Setting[data[i].key] = data[i].value;
            }
            console.log(Setting);
        });
        return Setting;
}]);

vaServices.factory('Session',['$http','$location','Setting',function($http,$location,Setting){
    var Session = {
        data: false,
        loggedIn: function(){
            return Session.data != false;
        },
        isTemp: function(){
            return Session.data.temp == true;
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
                if (typeof onComplete != 'undefined'){
                    onComplete(data);
                }
            }).error(function(error){
                if (typeof onComplete != 'undefined'){
                    onComplete(null,error);
                }
            });
        },
        logout: function(onComplete){
            $http.get('logout').success(function(data){
               Session.data = false; 

                if (typeof onComplete != 'undefined'){
                    onComplete(data);
                }
            });
        }
    };
    $http.get('user/exists').success(function(data){
        if (!angular.fromJson(data)){
            Session.data = {
                temp: true,
                username: 'Admin',
                email: 'admin@temp'
            };
            $location.path('users');
        } else {
            $http.get('login').success(function(data){
                data = angular.fromJson(data);
                if (data){
                    Session.data = data;
                } else {
                    Session.data = false;
                }
            });
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
  
vaServices.factory('User', ['$resource','Session',
    function($resource,Session){
        return $resource('user/:userId', {}, {
//            get: {method:'GET'},
//            query: {method:'GET', isArray:true},
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
//            get: {method:'GET'},
//            query: {method:'GET', isArray:true},
            create: {method:'POST'},
            save: {method:'PUT'},
//            delete: {method:'DELETE'},
            pendingState: {method:'POST',url:'todo/:todoId/reopen'},
            closeState: {method:'POST',url:'todo/:todoId/close'}
    });
}]);