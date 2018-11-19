angular.module("MessagingApp", ['ngRoute', 'MessagingApp.Auth'])

.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/chatroom/:id', {
            controller: "ChatRoomController",
            templateUrl: "chatroom/chatroom.html"
        })
        .when ('/welcome', {
        controller: 'welcomeController',
        templateUrl: 'welcome/welcome.html'
    })

}])

.service('ChatRoomService', ['$http', '$localStorage' , function ($http, $localStorage) {

    this.socket;

    this.connectToChatroom = function (roomName) {
        this.socket = io.connect()
        this.socket.emit('create', roomName);
    }

    this.sendMessage = function(message) {
        this.socket.emit('chat message', message)
    }

    this.addConversation = function(user) {
        return $http.post('/api/conversation/', user)
    }

    this.saveMessage = function(msg, id) {
        var message = {
            message: msg,
            from: $localStorage.user.user,
            conversation: id
        }
        return $http.post('/api/message', message)
    }

    this.getConversation = function(id) {
        console.log(id)
        return $http.get('api/conversation/' + id)
    }

}]);
