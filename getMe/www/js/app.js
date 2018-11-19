// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('MessagingApp', ['ionic', 'MainControllers', 'ngStorage', 'monospaced.qrcode', 'ngCordova', 'ngMessages', 'firebase', 'angular-md5', 'angularMoment', 'utils', 'auth'])

  .run(function ($ionicPlatform, Auth, $rootScope, $state, $ionicHistory, Users, Loading) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
      console.log(error);
    //error catch
      if (error === "AUTH_REQUIRED") {
        $state.go("login");
      }
    });

    $rootScope.$on('$stateChangeSuccess',function(){
      Loading.hide();
    });

    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
      Loading.show("loading...");
      // console.log("stateChangeStart");
      if((toState.name === "login" || toState.name === "sign-in-with-email" ) && $rootScope.currentUser){
        event.preventDefault();
      }
    });
    Auth.$onAuthStateChanged(function(currentUser) {

      // check user auth state
      if(currentUser){
        console.log(currentUser);
        Users.setOnline(currentUser.uid);

        // check if the user add to database
        Users.get(currentUser.uid).$loaded()
          .then(function(userRecord){
            $rootScope.currentUser = userRecord;

            if(!userRecord.name || !userRecord.face || !userRecord.provider){
              Users.updateProfile(userRecord, currentUser.providerData[0])
                .then(function(ref) {
                  console.log("Success Saved:", ref.key);
                }, function(error) {
                  console.log("Error:", error);
                });
            }
          });

        console.log("Log In");

      }
      else {
        // logout
        $rootScope.currentUser = 0;
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        $state.go("intro");
        console.log("Log Out");
      }
    });

  })

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
      // Each tab has its own nav history stack:
      .state('login', {
        url: '/login',
        cache: false,
        templateUrl: 'templates/login.html',
        controller: 'AuthCtrl',
        resolve: {
          "auth": ["Auth", function(Auth){
            return Auth.$waitForSignIn();
          }]
        }
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'templates/signup.html',
        controller: 'SignUpController'
      })
      .state('signout', {
        url: '/signout',
        templateUrl: '',
        controller: 'SignOutController'
      })
      .state('menu.welcome', {
        url: '/welcome',
        views: {
          'side-menu21': {
            templateUrl: 'templates/welcome.html',
            controller: 'WelcomeController'
          }
        }
      })
      .state('chat', {
        url: '/chats/:chatId',
        templateUrl: 'templates/chatroom.html',
        controller: 'ChatCtrl',
        resolve: {
          "auth": ["Auth", function (Auth) {
            return Auth.$requireSignIn();
          }],
              'linkType': function(){
                return 'chats';
              },
              'chat': function(auth, Privates, Chats, $stateParams){

                return Chats.get($stateParams.chatId).$loaded(function(directChat){
                  if(directChat.type){
                    // navigation with chat id
                    return directChat;
                  }
                  else{
                    return Privates.check(auth.uid, $stateParams.chatId).$loaded(function(privateChat){
                      if(privateChat.$value){
                        // navigation with user id
                        return Chats.get(privateChat.$value).$loaded();
                      }
                      else{
                        // add new private chat relation
                        return Chats.newPrivate(auth.uid, $stateParams.chatId);
                      }
                    });
                  }
                });

              },
              'messages': function(chat, Messages){
                return Messages.getMessages(chat.$id).$loaded();
              },
              'members': function(chat, Members){
                return Members.get(chat.$id).$loaded();
              },
              'activity': function(auth, chat, Activities, Users, $stateParams){
                return Activities.get(auth.uid, chat.$id).$loaded(function(activity){
                  if(!activity.name){
                    activity.name = Users.getName($stateParams.chatId);
                  }
                  return activity;
                });
              }
            },
            })
      .state('menu.shareToggle', {
        url: '/toggle',
        views: {
          'side-menu21': {
            templateUrl: 'templates/sharetoggle.html',
            controller: 'ShareToggleController'
          }
        }
      })
      .state('share', {
        url: '/share',
        templateUrl: 'templates/share.html',
        controller: 'ShareController'
      })
      .state('menu.contacts', {
        url: '/contacts',
        views: {
          'side-menu21': {
            templateUrl: 'templates/contacts.html',
            controller: 'ContactsController'
          }
        }
      })
      .state('contactDetail', {
        url: '/contactdetail/:id',
        templateUrl: 'templates/contact-detail.html',
        controller: 'ContactDetailController'
      })
      .state('getShare', {
        url: '/getShare',
        templateUrl: 'templates/getShare.html',
        controller: 'GetShareController'
      })
      .state('menu.profileSettings', {
        url: '/settings',
        views: {
          'side-menu21': {
            templateUrl: 'templates/profileSettings.html',
            controller: 'SettingsController'
          }
        }
      })
      .state("updateShare", {
        url: "/updateShare/:id",
        templateUrl: "templates/updateShare.html",
        controller: "updateShareController"
      })
      .state("intro", {
        url: "/intro",
        templateUrl: "templates/intro.html",
        controller: "IntroController"
      })
      .state('menu', {
        url: '/side-menu21',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'menuCtrl',
        resolve: {
          "auth": ["Auth", function (Auth) {
            return Auth.$requireSignIn();
          }]
        }
      })
      .state('menu.messages', {
        url: '/messages',
        views: {
          'side-menu21': {
            templateUrl: 'templates/messages.html',
            controller: 'ChatsCtrl',
            resolve: {
              'activities': function (Activities, auth) {
                return Activities.all(auth.uid).$loaded();
              }
            }
          }
        }
      })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/intro');

  })

.constant('baseUrl', {
    url: 'http://104.131.33.197:8100'
})

/*
 This directive is used to disable the "drag to open" functionality of the Side-Menu
 when you are dragging a Slider component.
 */
  .directive('disableSideMenuDrag', ['$ionicSideMenuDelegate', '$rootScope', function($ionicSideMenuDelegate, $rootScope) {
    return {
      restrict: "A",
      controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

        function stopDrag(){
          $ionicSideMenuDelegate.canDragContent(false);
        }

        function allowDrag(){
          $ionicSideMenuDelegate.canDragContent(true);
        }

        $rootScope.$on('$ionicSlides.slideChangeEnd', allowDrag);
        $element.on('touchstart', stopDrag);
        $element.on('touchend', allowDrag);
        $element.on('mousedown', stopDrag);
        $element.on('mouseup', allowDrag);

      }]
    };
  }])

  .directive('hrefInappbrowser', function() {
    return {
      restrict: 'A',
      replace: false,
      transclude: false,
      link: function (scope, element, attrs) {
        var href = attrs['hrefInappbrowser'];

        attrs.$observe('hrefInappbrowser', function (val) {
          href = val;
        });

        element.bind('click', function (event) {

          window.open(href, '_system', 'location=yes');

          event.preventDefault();
          event.stopPropagation();

        });
      }
    };


  })

