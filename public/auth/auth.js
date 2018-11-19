angular.module("MessagingApp.Auth", ['ngRoute', 'ngStorage'])

.config(["$routeProvider", function($routeProvider) { 
    $routeProvider
        .when('/signup', { 
            controller: "SignUpController", 
            templateUrl: "auth/signup/signup.html"
        })
        .when('/login', { 
            controller: "loginController", 
            templateUrl: "auth/login/login.html"
        })
        .when('/signout', { 
            controller: "SignOutController", 
            template: ""
        })
}])

.service("TokenService", ["$localStorage", function($localStorage) { 
    
    this.setToken = function(token) { 
        $localStorage.token = token;
    }
    
    this.getToken = function() { 
        return $localStorage.token; 
    }
    
    this.removeToken = function() { 
        delete $localStorage.token;
    }
    
}])

.service("UserService", ["$http", "$location", "$localStorage" , "TokenService", function ($http, $location, $localStorage, TokenService) {
    
    this.createNewUser = function (user) {
        return $http.post('/auth/signup', user);
    }
    
    this.signInUser = function(user) { 
        return $http.post('/auth/login', user)
            .then(function(response){
            $localStorage.user = response.data.user
            TokenService.setToken(response.data.token)
            $location.path('/welcome')
        })
    }
    
    this.signOut = function() { 
        $location.path('/login');
        TokenService.removeToken();
        delete $localStorage.user;
    }
    
    this.isAuthenticated = function() { 
        return !!TokenService.getToken();
    }

    this.getUser = function() {
        console.log($localStorage.user._id);
        // return $http.get("/api/user/" + $localStorage.user._id);
    };
    
}])

.service("AuthInterceptor", ["$q", "$location", "TokenService", function ($q, $location, TokenService) {
    this.request = function(config) {
        var token = TokenService.getToken();
        if (token) {
            config.headers.Authorization = "Bearer " + token
        }
        return config
    }
    this.responseError = function(response) {
        if (response.status === 401) {
            TokenService.removeToken();
            $location.path('/login');
        }
        return $q.reject(response)
    }
}])

.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push("AuthInterceptor");
}])