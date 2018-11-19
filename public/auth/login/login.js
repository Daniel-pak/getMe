angular.module('MessagingApp.Auth')

.controller('loginController', ['$scope', "UserService", function ($scope, UserService) {

    $scope.signIn = function (user) {
        UserService.signInUser(user).then(function (response) {
            console.log(response)
        })
    }

}])