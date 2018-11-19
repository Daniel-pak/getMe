angular.module("MessagingApp.Auth")

.directive("navbar", function() { 
    return { 
        restrict: "EA", 
        templateUrl: "auth/navbar/navbar.html", 
        controller: "NavBarController"
    }
})

.controller("NavBarController", ["UserService", "$scope", function(UserService, $scope) { 
    
    $scope.UserService = UserService;
    
}])