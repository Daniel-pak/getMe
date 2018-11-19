angular.module("MessagingApp")

.controller('welcomeController', ['$scope', '$localStorage', "ChatRoomService", "$location", "UserService", function ($scope, $localStorage, ChatRoomService, $location, UserService) {

    //adding a new contact and creating new conversation --> location to new chatroom
    $scope.addConversation = function (user) {
            var users = [];
            //empty array
            users.push(user._id)
            users.push(user.contact)
            //on click push id and user into users array - separately.
            console.log(users);
            //add  object to users
            var conversation = {};
            conversation.users = users;

            ChatRoomService.addConversation(conversation)
                .then(function (response) {
                    $location.path('/chatroom/' + response.data.conversation._id)
                })
    //join/create room
    }
    //get the chatroom based on the conversationId
    $scope.getChat = function (conversationId) {
        $location.path('/chatroom/' + conversationId)
    }

    UserService.getUser().then(function (response) {
        console.log(response.data.user);
        $scope.user = $localStorage.user;
        $scope.chats = $localStorage.user.conversations;
    })

    // $rootScope.$on('$stateChangeStart',
    //     function(event, toState, toParams, fromState, fromParams, options){ ... })

}])