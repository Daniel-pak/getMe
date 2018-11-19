angular.module('MessagingApp.Auth')

.controller("SignOutController", ["UserService", function(UserService) { 

    UserService.signOut();

}])