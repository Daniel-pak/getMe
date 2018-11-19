angular.module("MessagingApp")

.controller('ChatRoomController', ['$scope', "$routeParams", 'ChatRoomService', function ($scope, $routeParams, ChatRoomService) {

    $scope.messages = [];
    var id = $routeParams.id;

    ChatRoomService.getConversation(id).then(function (response) {
        $scope.messages = response.data.messages
        console.log(response.data)
    });

    ChatRoomService.connectToChatroom(id);

    ChatRoomService.socket.on('chat message', function (msg) {
        var message = {
                message: msg
            }
        $scope.messages.push(message)
        $scope.$apply();
        console.log(message)
//        ChatRoomService.getConversation(id).then(function (response) {
//            $scope.messages = response.data.messages;
//            console.log(response)
//            console.log('im running');
//        })
    }); //On any incoming or out going --> this will run. 

    $scope.sendMessage = function (message) {
        var msg = {
                message: message,
                room: id
            }
            ChatRoomService.sendMessage(msg);
            $scope.messages.push(msg);
            ChatRoomService.saveMessage(message, id);
            $scope.message = "";
        } //send messsage should call to chatroom service to create new message and link those to different users

}]);