angular.module('MessagingApp')


    .service("UserService", ["$http", "$location", "$localStorage", "TokenService", "$state", "$window", "baseUrl", "$stateParams", "$rootScope", "$ionicHistory", function ($http, $location, $localStorage, TokenService, $state, $window, baseUrl, $stateParams, $rootScope, $ionicHistory) {

        this.createNewUser = function (user) {
            return $http.post(baseUrl.url + '/auth/signup', user);
        };

        this.signInUser = function (user) {
            return $http.post(baseUrl.url + '/auth/login', user)
                .then(function (response) {
                    $localStorage.user = response.data.user;
                    TokenService.setToken(response.data.token);
                 //   $location.path('/side-menu21/welcome');
                },
                function errorCallback(response) {
                  alert("Invalid username or password. Please try again!");
                  $state.go($state.current, $stateParams, {reload: true, inherit: false});
                });
        };
      this.signInUserSocial = function (user) {
        return $http.post(baseUrl.url + '/auth/social-login', user)
          .then(function (response) {
              $localStorage.user = response.data.user;
              TokenService.setToken(response.data.token);
              //   $location.path('/side-menu21/welcome');
            },
            function errorCallback(response) {
              alert("Invalid username or password. Please try again!");
              $state.go($state.current, $stateParams, {reload: true, inherit: false});
            });
      };

        this.signInSocialUser = function(user) {
          return $http.post(baseUrl.url + '/auth/social-login', user)
            .then(function (response) {
                $localStorage.user = response.data.user;
                TokenService.setToken(response.data.token);
                $location.path('/side-menu21/welcome');
              },
              function errorCallback(response) {
                alert(response);
                $state.go($state.current, $stateParams, {reload: true, inherit: false});
              });
        }

        this.signOut = function () {
          console.log("Log Out");
          TokenService.removeToken();
          delete $localStorage.user;
          delete $localStorage.getDatasetUser;
          delete $localStorage.getdataset;
          $rootScope.currentUser = 0;
          $ionicHistory.clearCache();
          $ionicHistory.clearHistory();
          $state.go("login");
          $window.location.reload(true);
        };

        this.isAuthenticated = function () {
            return !!TokenService.getToken();
        };

        this.getUser = function () {
            return $http.get(baseUrl.url + "/api/user/" + $localStorage.user._id)
        };

        this.localUser = function () {
            return $localStorage.user;

        };

        this.qrDataset = function () {
            return $localStorage.dataset;
        };

        this.editUser = function (user) {
            return $http.put(baseUrl.url + '/api/user/settings/' + $localStorage.user._id, user);
        };

    }])

    .service('ChatService', ['$http', '$localStorage', 'baseUrl', function ($http, $localStorage, baseUrl) {

        this.connectToChatroom = function (roomName) {
            this.socket = io(baseUrl.url);
            this.socket.emit('create', roomName);
        };

        this.getSocket = function () {
            return this.socket;
        }

        this.sendMessage = function (message) {
            this.socket.emit('chat message', message);
        };

        this.addConversation = function (user) {
            return $http.post(baseUrl.url + '/api/conversation/', user)
        };

        this.saveMessage = function (msg) {
            var message = {
                message: msg.message,
                from: $localStorage.user._id,
                conversation: msg.room,
                to: msg.to
            };

            this.checkMessage({
                message: message.message,
                from: message.from
            });
            return $http.post(baseUrl.url + '/api/message', message);

        };

        this.getConversation = function (id) {
            return $http.get(baseUrl.url + '/api/conversation/' + id);
        };

        this.sortMessages = function (totalMessages, user) {
            for (var i = 0; i < totalMessages.length; i++) {
                if (totalMessages[i].from === user._id) {
                    totalMessages[i].status = "sent"
                } else {
                    totalMessages[i].status = "received"
                }
            }
            return totalMessages;
        };

        this.playSoundOnMessage = function () {
            // var sound = document.createElement('messageTone');
            // // var sound = new Audio('messageTone.mp3'); //eventually put link to audio in the settings
            // sound.src = '../messageTone.mp3'
            // sound.play();
            // console.log("Working");
        };

        this.checkMessage = function (object) {
            this.message = object;
        };

        this.onEmitMessage = function (message) {
            if (!this.message || this.message.message != message) {
                // console.log("Message received!")
                // this.playSoundOnMessage();
                return "received";
            } else if ($localStorage.user._id == this.message.from) {
                return "sent";
            }
        }

  }])

    .service('contactService', ['$http', 'UserService', '$localStorage', "handshakeService", "baseUrl", "$localStorage", function ($http, UserService, $localStorage, handshakeService, baseUrl, $localStorage) {

        this.user = $localStorage.user;
        var self = this;

        this.getContactId = function (email) {
            return $http.put(baseUrl.url + "/api/user/" + email)
        }



        this.addContact = function (share, id) {

            console.log(share);

            var newContact = {};
            newContact.user = id;
            newContact.nickName = "";
            newContact.profile = $localStorage.contactShareString;

            var mystuff = {};
            mystuff.user = $localStorage.user._id;
            mystuff.nickName = $localStorage.user.firstName;
            mystuff.profile = share;

            console.log(newContact.profile)

            handshakeService.handShake(mystuff, newContact)


        };
       this.getContact = function (contact) {
            var contactReq = {};

            contactReq._id = contact.user;
            contactReq.profile = contact.profileAccess || "&000";
            return $http.post(baseUrl.url + '/api/user/contact', contactReq)
                .then(function (response) {
                    return response.data;
                })

        }
  }])
   .service("handshakeService", ["$http", "$location", "$localStorage", "baseUrl", "$state", function ($http, $location, $localStorage, baseUrl, $state) {

        this.handShake = function (user, contact) {
            var currentUser = {};
            var newContact = {};
            currentUser = {
                profileAccess: user.profile,
                nickName: user.nickName,
                user: user.user
            };
            newContact = {
                profileAccess: contact.profile,
                nickName: contact.nickName,
                user: contact.user
            };

            return $http.put(baseUrl.url + '/api/user/contact/' + user.user, newContact)

                .then(function (response) {

                    return $http.put(baseUrl.url + '/api/user/contact/' + contact.user, currentUser)


                })
                .then(function (response) {
                    $localStorage.user.contacts.push(newContact);
                    alert("Contact info exchanged!");
                    $state.go("menu.welcome");
                });

        };

  }])

    .service("AuthInterceptor", ["$q", "$location", "TokenService", function ($q, $location, TokenService) {
        this.request = function (config) {
            var token = TokenService.getToken();
            if (token) {
                config.headers.Authorization = "Bearer " + token
            }
            return config;
        };
        this.responseError = function (response) {
            if (response.status === 401) {
                TokenService.removeToken();
                $location.path('/login');
            }
            return $q.reject(response);
        }
  }])

    .service("TokenService", ["$localStorage", function ($localStorage) {

        this.setToken = function (token) {
            $localStorage.token = token;
        };

        this.getToken = function () {
            return $localStorage.token;
        };

        this.removeToken = function () {
            delete $localStorage.token;
        }

  }])

    .service("CheckAuth", ["TokenService", "$location", function (TokenService, $location) {

        this.checkAuth = function () {
            if (!TokenService.getToken()) {
                $location.path('/login');
            }
        }

  }])

    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push("AuthInterceptor");
  }])

// BEGIN NEW FIREBASE CODE *****************************************************************************************
  .factory('Activities', function( $firebaseArray, $firebaseObject ) {
    var ref = firebase.database().ref().child("activities");
    var activities = $firebaseArray(ref);

    return {
      group: function(userId){
        return $firebaseArray(ref.child(userId).orderByChild("chatType").equalTo('group'));
      },
      all: function(userId){
        return $firebaseArray(ref.child(userId));
      },
      get: function(userId, chatId){
        return $firebaseObject(ref.child(userId + '/' + chatId));
      },
      add: function(userId, chatId, name, lastText, face, members, chatType){
        $firebaseObject(ref.child(userId + '/' + chatId)).$loaded(function(activityObj){
          if( name != '' ){
            activityObj.name = name;
          }
          if( lastText != '' ){
            activityObj.lastText = lastText;
          }
          if( face != '' ){
            activityObj.face = face;
          }
          if( chatType != '' ){
            activityObj.chatType = chatType;
          }
          if( members != '' ){
            activityObj.members = members;
          }
          activityObj.lastUpdate = firebase.database.ServerValue.TIMESTAMP;
          return activityObj.$save();
        });
      }
    };
  })
  .factory('Members', function( $firebaseArray, $firebaseObject ){
    var ref = firebase.database().ref().child("members");
    var members = $firebaseArray(ref);

    return {
      get: function(chatId){
        return $firebaseArray(ref.child(chatId));
      },
      addMember: function(chatId, memberId){
        var memberObj = $firebaseObject(ref.child(chatId + '/' + memberId));
        memberObj.$value = true;
        return memberObj.$save();
      }
    }
  })
  .factory('Users', function( $firebaseArray, $firebaseObject, md5 ){
    var ref = firebase.database().ref().child("users");
    var connectedRef = firebase.database().ref().child(".info/connected");
    var users = $firebaseArray(ref);

    return {
      all: users,
      getName: function(userId){
        return users.$getRecord(userId).name;
      },
      get: function(userId){
        return $firebaseObject(ref.child(userId));
      },
      getFace: function(userId){
        return users.$getRecord(userId).face;
      },
      setEmailUser: function(userId, displayName, email){
        var user = $firebaseObject(ref.child(userId));
        user.name = displayName;
        user.face = '//www.gravatar.com/avatar/' + md5.createHash(email);
        return user.$save();
      },
      setOnline: function(userId){
        var connected = $firebaseObject(connectedRef);
        var online = $firebaseArray(ref.child(userId + '/online'));
        var lastOnline = ref.child(userId + '/lastOnline');
        lastOnline.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);

        connected.$watch(function () {
          if (connected.$value === true) {
            online.$add(true).then(function (connectedRef) {
              connectedRef.onDisconnect().remove();
            });
          }
        });
      },
      updateProfile: function(user, profile) {
        if(profile.displayName){
          user.name = profile.displayName;
        }
        if(profile.photoURL){
          user.face = profile.photoURL;
        }
        if(profile.providerId){
          if(profile.providerId == "password"){
            user.provider = profile.email;
          }
          else{
            user.provider = profile.providerId;
          }

        }
        return user.$save();
      },

      remove: function(user) {
        users.splice(users.indexOf(user), 1);
      },
      get: function(uid){
        return $firebaseObject(ref.child(uid));
      },
    };
  })

  .factory('Chats', function( $firebaseArray, $firebaseObject, Privates, Members, Activities, Users ) {
    var ref = firebase.database().ref().child("chats");
    var chats = $firebaseArray(ref);

    return {
      all: chats,
      newGroup: function(membersList){
        var chat = {
          type : "group",
          lastUpdate : firebase.database.ServerValue.TIMESTAMP
        };
        return chats.$add(chat).then(function(ref){
          Members.get(ref.key);
          for(var i=0; i<membersList.length; i++){
            Members.addMember(ref.key, membersList[i].$id);
          }

          return $firebaseObject(ref.child(ref.key));
        });

      },
      newPrivate: function(userId, friendId){
        var chat = {
          type : "private",
          lastUpdate : firebase.database.ServerValue.TIMESTAMP
        };
        return chats.$add(chat).then(function(ref){
          Members.get(ref.key);
          Members.addMember(ref.key, userId);
          Members.addMember(ref.key, friendId);

          Privates.add(userId, friendId, ref.key);
          Privates.add(friendId, userId, ref.key);

          var userName = Users.getName(userId);
          var userFace = Users.getFace(userId);
          var friendName = Users.getName(friendId);
          var friendFace = Users.getFace(friendId);

          Activities.add(userId, ref.key, friendName, friendName + ' add you as friend', friendFace, '', 'private');
          Activities.add(friendId, ref.key, userName, userName + ' add you as friend', userFace, '', 'private');

          return $firebaseObject(ref.child(ref.key));
        });
      },
      update: function(chatId, type){
        var chatObj = $firebaseObject(ref.child(chatId));
        chatObj.type = type;
        chatObj.lastUpdate = firebase.database.ServerValue.TIMESTAMP;
        return chatObj.$save();
      },
      get: function(chatId){
        return $firebaseObject(ref.child(chatId));
      },
      getType: function(chatId){
        return chats.$getRecord(chatId).type;
      }
    }


  })
  .factory("Privates", function($firebaseArray, $firebaseObject) {
    var ref = firebase.database().ref().child("privates");
    var privates = $firebaseArray(ref);

    return {
      get: function(uId){
        return $firebaseObject(ref.child(uId));
      },
      add: function(uid, contactId, chatId){
        var privateObj = $firebaseObject(ref.child(uid).child(contactId));
        privateObj.chat = chatId;
        privateObj.$save();
      },
      remove: function(userId, contactId){
        var privateObj = $firebaseObject(ref.child(userId).child(contactId));
        privateObj.$remove();
      },
      check: function(uid, contactId){
        return $firebaseObject(ref.child(uid).child(contactId).child('chat'));
      },
      all: privates
    };

  })
  .factory('Messages', function( $firebaseArray, $firebaseObject, $ionicScrollDelegate, Chats, Users, Activities ){
    var ref = firebase.database().ref().child("messages");
    var messages = $firebaseArray(ref);

    return {
      addMessageAndUpdateActivities: function(chatId, messageObj, members){

        for(var i=0; i<members.length; i++){
          Activities.add(members[i].$id, chatId, '', messageObj.message, '', '', '');
        }
        return $firebaseArray(ref.child(chatId)).$add(messageObj);
      },
      addMessage: function(chatId, messageObj){

        return $firebaseArray(ref.child(chatId)).$add(messageObj);
      },
      getMessages: function(chatId){
        var messages = $firebaseArray(ref.child(chatId));
        messages.$watch(function (watch) {
          if (watch.event == "child_added") {
            $ionicScrollDelegate.scrollBottom(true);
          }
        });
        return messages;
      },
      remove: function(chatId){
        var messages = $firebaseArray(ref.child(chatId));
        return messages.$remove();
      },
      all:messages
    };
  })
  .factory('toggleSelection', function() {
    // userObj: { id: 0, name: 'Venkman', face: 'img/venkman.jpg' }
    // selectedList: userObj list array
    // output: { groupName: [],  groupMember: [], groupFace: [] }
    return function(userObj, selectedList, output){
      if(userObj.checked){
        // only store 4 member
        if(selectedList.length == 4){
          selectedList.splice(0, 1);
        }
        selectedList.splice(3, 1, userObj);
      }
      else{
        if(selectedList.indexOf(userObj) != -1){
          selectedList.splice(selectedList.indexOf(userObj), 1);
        }
      }

      // update modal interface data
      output.groupName = [];
      output.groupMember = [];
      output.groupFace = [];
      for(var i=0; i<selectedList.length; i++){
        // only show 3 member name as group name
        // only show 3 face for group thumb
        if(i == 3){
          output.groupName.push('...');
          output.groupMember.push('...');
        }
        else{
          output.groupName.push(selectedList[i].name);
          output.groupMember.push(selectedList[i].name);
          output.groupFace.push(selectedList[i].face);
        }

      }
    }
  });

