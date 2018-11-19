angular.module('MessagingApp.Auth')

.controller("SignUpController", ["$scope", "UserService", function ($scope, UserService) {

    $scope.passwordText = "";

    $scope.createNewUser = function (user) {
        if ($scope.passwordRepeat !== user.password) {
            $scope.passwordText = "Your passwords do not match! Please try again";
        } else {
            UserService.createNewUser(user).then(function (response) {
                console.log(response.data);
            })
        }
    }
}])
