angular.module('auth', [])
.factory('Auth', function( $firebaseAuth ){
  return $firebaseAuth();
})
.controller('AuthCtrl', function($scope, Loading, Error, ModalService, $state, Auth, Users, UserService) {
  /*$scope.signIn = function (provider){
    Loading.show("Sign in with " + provider + "...");
    Auth.$signInWithPopup(provider).then(function(result) {
      console.log("Signed in as:", result.user);
      var user = {
      email: result.user.email,
      password: result.user.uid
      };
      UserService.signInUserSocial(user).then(function (response) {
        $state.go("menu.welcome");
      });
      Loading.hide();
    }).catch(function(error) {
      console.error("Authentication failed:", error);
      Loading.hide();
      Error(error.code, error.message);
    });
  }*/
  $scope.googleSignIn = function() {
    Loading.show("Sign in with Google...");
    window.plugins.googleplus.login(
      {
        'webClientId': '906532007026-iqkfvvtbh1b8jg8qcqk69tn6o4qogn6c.apps.googleusercontent.com',
        'offline': true
      },
      function (user_data) {
        Auth.$signInWithCredential(
          firebase.auth.GoogleAuthProvider.credential(user_data.idToken)
        )
          .then(function(authData, error) {
            console.log(authData);
            console.log(user_data);
            var user = {
              email: user_data.email,
              password: authData.uid
            };
            UserService.signInUserSocial(user).then(function (response) {
              console.log(response);
              $state.go('menu.welcome');
            });
          })
          .catch(function(error) {
            switch (error.code) {
              case 'USER_CANCELLED':
                break;
              default:
                Error("Error", error);
                break;
            }
            Loading.hide();
          });
        Loading.hide();
      },
      function (msg) {
        console.log(msg);
        Loading.hide();
      }
    );
  };

  $scope.signInWithEmail = function (user) {
    if(angular.isDefined(user)){
      Loading.show("Sign in...");
      Auth.$signInWithEmailAndPassword(user.email, user.password)
      .then(function(currentUser) {
        console.log("Signed in as:", currentUser.uid);
        UserService.signInUser(user);
        $state.go("menu.welcome");
        Loading.hide();
      }).catch(function(error) {
        Loading.hide();
        console.error("Authentication failed:", error);
        Error(error.code, error.message);
      });
    }
  };

  $scope.signUpWithEmail = function(user) {
    if(angular.isDefined(user)){
      console.log("here");
      Loading.show("Sign up...");
      Auth.$createUserWithEmailAndPassword(user.email, user.password)
        .then(function(currentUser) {
          UserService.createNewUser(user);
          alert("New user created! Please sign in.");
          console.log(user);
          Users.setEmailUser(currentUser.uid, user.displayName, user.email).then(function(){
            console.log("User created with uid: " + currentUser.uid);
            $scope.closeModal();
            $state.go("menu.welcome");
            Loading.hide();
          });
        }).catch(function(error) {
          Loading.hide();
          console.log(error);
          Error(error.code, error.message);
        });
    }
  };

  $scope.sendPasswordResetEmail = function(email){
    if(angular.isDefined(email)){
        Loading.show("Sending...");
        Auth.$sendPasswordResetEmail(email).then(function() {
          console.log("Password reset email sent successfully!");
          $scope.closePassword();
          $state.go("login");
          Loading.hide();
        }).catch(function(error) {
          console.error("Error: ", error);
          Loading.hide();
          Error(error.code, error.message);
        });
      }
  }

  $scope.newSignup = function() {
    ModalService
      .init('templates/auth/sign-up.html', $scope)
      .then(function(modal) {
        modal.show();
      });
  };

  $scope.newPassword = function() {
    ModalService
      .init('templates/auth/forgot-password.html', $scope)
      .then(function(modal) {
        modal.show();
      });
  };

});
