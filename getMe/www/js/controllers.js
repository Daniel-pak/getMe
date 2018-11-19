angular.module('MainControllers', [])

    .controller('loginController', function ($scope, UserService, $location, $state, $stateParams) {
        $scope.signInNative = function (user) {
            UserService.signInUser(user).then(function (response) {
                if (response !== null){
                  $scope.passwordText = response;
                }
            });
        };
        $scope.signUp = function () {
            $location.path('/signup')
        };
    })

    .controller("SignUpController", ["$scope", "UserService", "$location", function ($scope, UserService, $location) {

        $scope.passwordText = "";
        $scope.createNewUser = function (user) {
            if (user.passwordRepeat !== user.password) {
                $scope.passwordText = "Your passwords do not match! Please try again";
            } else {
                delete user.passwordRepeat;
                UserService.createNewUser(user).then(function (response) {
                    $scope.newUser = {};
                    $location.path("/login");
                })
            }
        }
  }])

    .controller("SignOutController", ["UserService", "$location", function (UserService, $location) {
        $scope.signOut = function (user) {
            UserService.signOut();
            $location.path("/login");
        };
  }])


    .controller('WelcomeController', ['$scope', '$localStorage', "ChatService", "$location", "UserService", "$cordovaBarcodeScanner", "$ionicPlatform", "$cordovaCamera", 'contactService', "CheckAuth", '$rootScope', '$state', function ($scope, $localStorage, ChatService, $location, UserService, $cordovaBarcodeScanner, $ionicPlatform, $cordovaCamera, contactService, CheckAuth, $ionicView, $state) {

        CheckAuth.checkAuth();

        $scope.$on('$ionicView.beforeEnter', function () {
            UserService.getUser()
                .then(function (response) {
                    $scope.user = response.data;
                    $scope.chats = response.data.conversations;
                });
        });

        $scope.mySettings = function () {
            $state.go('menu.messages')
        }

        /*$scope.addConversation = function (user) {
            var users = [];
            users.push($localStorage.user._id);
            users.push(user);
            var conversation = {};
            conversation.users = users;

            ChatService.addConversation(conversation)
                .then(function (response) {
                    $location.path('/chat/' + response.data.conversation._id);
                });
        }*/

      /*  $scope.getMsgs = function (conversationId) {
            $location.path('/chat/' + conversationId)
        }*/

        // UserService.getUser()
        //   .then(function(response){
        //     console.log(response.data);
        //     $scope.user = response.data;
        //     $scope.chats = response.data.conversations;
        // });

        $scope.shareToggle = function () {
            $state.go("shareToggle");
        };

        $scope.scanQr = function () {
            $ionicPlatform.ready(function () {
                $cordovaBarcodeScanner.scan().then(function (imageData) {
                  if(imageData.text === null){
                    return $location.path("/welcome");
                  } else if (imageData.text !== null){
                    $localStorage.getDatasetUser = imageData.text;
                    return $location.path("/getShare");
                  }
                }, function (error) {
                  alert("error" + error);
                });
            });
             // return $location.path("/getShare");
        };

        $scope.addContact = function (id) {
            contactService.addContact(id);
        }
  }])

    /*.controller('ChatController', ['$scope', "$stateParams", 'ChatService', "UserService", 'CheckAuth', function ($scope, $stateParams, ChatService, UserService, CheckAuth) {

        CheckAuth.checkAuth();

        var users;
        $scope.messages = [];
        var id = $stateParams.id;
        $scope.newMessage = "";

        ChatService.getConversation(id).then(function (response) {
            $scope.messages = response.data.messages
            users = response.data.users;
            for (var i = 0; i < users.length; i++) {
                if (UserService.localUser()._id == users[i]._id) {
                    users.splice(i, 1);
                }
            }
            $scope.messages = ChatService.sortMessages($scope.messages, UserService.localUser());
        });

        ChatService.connectToChatroom(id);

        ChatService.socket.on('chat message', function (message) {
            $scope.messages.push({
                message: message.message,
                createdAt: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                status: ChatService.onEmitMessage(message.message)
            });
            $scope.$apply();

        });

        // ChatService.socket.on('sound play', function(){
        //
        // });

        $scope.sendMessage = function (message) {
            var msg = {
                message: message,
                room: id,
                to: users
            }
            ChatService.sendMessage(msg);
            ChatService.saveMessage(msg);
            messageSubmit.reset();
        }
  }])*/

    .controller("ShareToggleController", function ($scope, $localStorage, $location, CheckAuth, $state) {

        CheckAuth.checkAuth()
        $scope.user = $localStorage.user;
        $scope.qrcode = $localStorage.user;
        $scope.shareQr = function () {
            delete $localStorage.dataset;
            $localStorage.dataset = $scope.qrcode._id + "&" + $scope.socialToggle.em + $scope.socialToggle.name + $scope.socialToggle.li + "0" + $scope.socialToggle.fb + $scope.socialToggle.tw + "0" + $scope.socialToggle.sc + "000";
            $location.path("/share");
        }
        $scope.reset = function(){
          console.log("here");
          $scope.socialToggle = {
            name: 0,
            em: 0,
            fb: 0,
            sc: 0,
            li: 0,
            tw: 0,
            in: 0,
            ph1: 0,
            ph2: 0,
            wb1: 0,
            wb2: 0,
            gt: 0,
            tmb: 0,
            pin: 0,
            twt: 0,
            kik: 0,
            per: 0,
            med: 0,
            red: 0,
            sky: 0,
            vin: 0,
            vim: 0,
            wp: 0,
            em2: 0,
            hAd: 0,
            wAd: 0,
            bAd: 0,
            bD: 0
          };
        };
        $scope.socialToggle = {
          name: 0,
          em: 0,
          fb: 0,
          sc: 0,
          li: 0,
          tw: 0,
          in: 0,
          ph1: 0,
          ph2: 0,
          wb1: 0,
          wb2: 0,
          gt: 0,
          tmb: 0,
          pin: 0,
          twt: 0,
          kik: 0,
          per: 0,
          med: 0,
          red: 0,
          sky: 0,
          vin: 0,
          vim: 0,
          wp: 0,
          em2: 0,
          hAd: 0,
          wAd: 0,
          bAd: 0,
          bD: 0
        }
    })

    .controller("GetShareController", function ($scope, $localStorage, $location, handshakeService) {
        $scope.getOrigin = $localStorage.user;
        $scope.socialToggle = {
            name: 0,
            em: 0,
            fb: 0,
            sc: 0,
            li: 0,
            tw: 0,
            in: 0,
            ph1: 0,
            ph2: 0,
            wb1: 0,
            wb2: 0,
            gt: 0,
            tmb: 0,
            pin: 0,
            twt: 0,
            kik: 0,
            per: 0,
            med: 0,
            red: 0,
            sky: 0,
            vin: 0,
            vim: 0,
            wp: 0,
            em2: 0,
            hAd: 0,
            wAd: 0,
            bAd: 0,
            bD: 0
        }
        $scope.getShareQr = function () {
            $localStorage.getdataset = $scope.getOrigin._id + "&" + $scope.socialToggle.em + $scope.socialToggle.name + $scope.socialToggle.li +  $scope.socialToggle.fb + $scope.socialToggle.tw + $scope.socialToggle.in + $scope.socialToggle.sc + $scope.socialToggle.ph1 + $scope.socialToggle.ph2 + $scope.socialToggle.wb1 + $scope.socialToggle.wb2 + $scope.socialToggle.gt + $scope.socialToggle.tmb + $scope.socialToggle.pin + $scope.socialToggle.kik + $scope.socialToggle.per + $scope.socialToggle.med + $scope.socialToggle.red + $scope.socialToggle.sky + $scope.socialToggle.twt + $scope.socialToggle.vin + $scope.socialToggle.vim + $scope.socialToggle.wp + $scope.socialToggle.em2 + $scope.socialToggle.hAd + $scope.socialToggle.bAd + $scope.socialToggle.wAd + $scope.socialToggle.bD;

            var currentUser = {
                profileAccess: $localStorage.getdataset,
                user: $localStorage.user._id,
                // nickName: "Test1"
            };
            var profileString = $localStorage.getDatasetUser.slice(0, $localStorage.getDatasetUser.indexOf("&"));
            var newContact = {
                profileAccess: $localStorage.getDatasetUser,
                user: profileString,
                // nickName: "test2"
            }
            handshakeService.handShake(currentUser, newContact)
        }
    })


    .controller("ShareController", function ($scope, $location, $localStorage, UserService, CheckAuth, $state) {
      CheckAuth.checkAuth();
      $scope.goBack = function (){
        $state.go('menu.shareToggle');
      };
        $scope.dataset = UserService.qrDataset();
    })

    // .controller('ContactsDetailController', ["$scope", "$location", "$localStorage", "UserService", "ChatService", "ContactsController", function ($scope, $location, $localStorage, UserService, ChatService) {
    //
    //
    //
    //   $scope.startChat = function () {
    //
    //     ChatService.addConversation(conversation).then(function (response) {
    //       $location.path('/chat/' + response.data.conversation._id)
    //     })
    //   }
    // }])


    .controller('ContactsController', ["$scope", "$location", "$localStorage", "contactService", "CheckAuth", "UserService", function ($scope, $location, $localStorage, contactService, CheckAuth, UserService) {

        CheckAuth.checkAuth();

        $scope.$on('$ionicView.beforeEnter', function () {
            UserService.getUser()
                .then(function (response) {
                    $scope.contacts = response.data.contacts
                })
        });
      $scope.addContact = function (userInput) {
        contactService.addContact(userInput)

      }

        $scope.getContacts = function () {
            UserService.getUser().then(function (response) {
                $scope.contacts = response.data.contacts
                $scope.$broadcast("scroll.refreshComplete");
            })
        }

        $scope.getContacts();


        $scope.getContact = function (contact) {
            $location.path('/contactdetail/' + contact.user._id);

        }
      $scope.addByEmail = function (email) {
        contactService.getContactId(email).then(function (response) {
          $location.path("/updateShare/" + response.data._id);
        });

      }
  }])


    .controller('ContactDetailController', ["$scope", "$location", "$localStorage", "contactService", "ChatService", "CheckAuth", "UserService", "$stateParams", function ($scope, $location, $localStorage, contactService, ChatService, CheckAuth, UserService, $stateParams) {


        CheckAuth.checkAuth();
        $scope.$on('$ionicView.beforeEnter', function () {
            UserService.getUser().then(function (response) {
                $scope.user = response.data
                $scope.thisContact = {};

                for (var i = 0; i < $scope.user.contacts.length; i++) {
                    if ($scope.user.contacts[i].user._id == $stateParams.id) {
                        $scope.thisContact = $scope.user.contacts[i];

                        console.log($scope.thisContact)

                        $localStorage.contactShareString = $scope.thisContact.profileAccess
                    }
                }

                contactService.getContact($scope.thisContact).then(function (response) {
                    $scope.contact = response;
                    console.log(response)
                })
            })
        })

        UserService.getUser().then(function (response) {
            $scope.allChats = response.data.conversations
            $scope.chats = [];

            for (var i = 0; i < $scope.allChats.length; i++) {
                for (var j = 0; j < $scope.allChats[i].users.length; j++) {

                    if ($scope.allChats[i].users[j]._id === $scope.contact._id) {

                        $scope.chats.push($scope.allChats[i]);
                    }
                }
            }
        })


        $scope.getChat = function (conversationId) {
            $location.path('/chat/' + conversationId)
        }

        $scope.addConversation = function (contact) {
            var users = [];
            users.push($localStorage.user._id)
            users.push($scope.contact._id); //contact
            var conversation = {};
            conversation.users = users;

            ChatService.addConversation(conversation)
                .then(function (response) {
                    $location.path('/chat/' + response.data.conversation._id);
                });
        }

        $scope.updateShare = function (contact) {
            $location.path("/updateShare/" + contact);
        }

  }])


    .controller("SettingsController", ["$scope", "$location", "$localStorage", "UserService", "CheckAuth", "$state", function ($scope, $location, $localStorage, UserService, CheckAuth, $state) {

//        var fileTransfer;
//
//        document.addEventListener("deviceready", onDeviceReady, false);
//
//        function onDeviceReady() {
//            // as soon as this function is called FileTransfer "should" be defined
//            alert("Device is ready!")
//            alert(FileTransfer);
//            fileTransfer = new FileTransfer();
//            alert(fileTransfer);
//        }

        CheckAuth.checkAuth();

        $scope.signOut = function () {
            UserService.signOut();
        };

        $scope.user = {
            firstName: $localStorage.user.firstName,
            lastName: $localStorage.user.lastName,
            email: $localStorage.user.email,
            linkedIn: $localStorage.user.linkedIn,
            kik: $localStorage.user.kik,
            facebook: $localStorage.user.facebook,
            twitter: $localStorage.user.twitter,
            instagram: $localStorage.user.instagram,
            snapchat: $localStorage.user.snapchat,
            phone: $localStorage.user.phone,
            phone_2: $localStorage.user.phone_2,
            website_1: $localStorage.user.website_1,
            website_2: $localStorage.user.website_2,
            github: $localStorage.user.github,
            // google: $localStorage.user.google,
            tumblr: $localStorage.user.tumblr,
            pinterest: $localStorage.user.pinterest,
            // shots: $localStorage.user.shots,
            periscope: $localStorage.user.periscope,
            medium: $localStorage.user.medium,
            reddit: $localStorage.user.reddit,
            skype: $localStorage.user.skype,
            twitch: $localStorage.user.twitch,
            vine: $localStorage.user.vine,
            vimeo: $localStorage.user.vimeo,
            wordpress: $localStorage.user.wordpress,
            email_2: $localStorage.user.email_2,
            homeAddress: $localStorage.user.homeAddress,
            businessAddress: $localStorage.user.businessAddress,
            workAddress: $localStorage.user.workAddress,
            birthDate: $localStorage.user.birthDate
        };

        $scope.editUser = function (user) {
            var editedUser = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
              linkedIn: user.linkedIn,
              kik: user.kik,
              facebook: user.facebook,
              twitter: user.twitter,
              instagram: user.instagram,
              snapchat: user.snapchat,
              phone: user.phone,
              phone_2: user.phone_2,
              website_1: user.website_1,
              website_2: user.website_2,
              github: user.github,
              // google: user.google,
              tumblr: user.tumblr,
              pinterest: user.pinterest,
              // shots: user.shots,
              periscope: user.periscope,
              medium: user.medium,
              reddit: user.reddit,
              skype: user.skype,
              twitch: user.twitch,
              vine: user.vine,
              vimeo: user.vimeo,
              wordpress: user.wordpress,
              email_2: user.email_2,
              homeAddress: user.homeAddress,
              businessAddress: user.businessAddress,
              workAddress: user.workAddress,
              birthDate: user.birthDate
            };

            UserService.editUser(editedUser).then(function (response) {
                $localStorage.user = response.data;
                $state.go('menu.welcome');
            })
        }

        /**************FILE UPLOAD****************/

        //        $scope.takePicture = function () {
        //            $ionicPlatform.ready().then(function () {
        //                console.log(Camera);
        //            });
        //            console.log("sss");
        //            var options = {
        //                quality: 80,
        //                destinationType: Camera.DestinationType.DATA_URL,
        //                sourceType: Camera.PictureSourceType.CAMERA,
        //                allowEdit: true,
        //                encodingType: Camera.EncodingType.JPEG,
        //                targetWidth: 266,
        //                targetHeight: 266,
        //                popoverOptions: CameraPopoverOptions,
        //                saveToPhotoAlbum: false
        //            };
        //
        //            $cordovaCamera.getPicture(options).then(function (imageData) {
        //                var image = document.getElementById('myImage');
        //                image.src = "data:image/jpeg;base64," + imageData;
        //                imageFile = imageData;
        //            }, function (err) {
        //                console.log("error");
        //            });
        //        }

        //        var fileEntry;
        //        var filename;
        //        var fileURL = "///storage/emulated/0/DCIM/";
        //        $scope.upload = function () {
        //            alert("should upload")
        //            alert(fileURL);
        //            var options = {
        //                fileKey: "file",
        //                fileName: "file.jpg",
        //                chunkedMode: false,
        //                mimeType: "image/jpeg"
        //            };
        //            fileTransfer.upload("http://104.131.33.197:8100/upload", "http://farm5.staticflickr.com/4067/4584507098_b887327eae.jpg", options).then(function (result) {
        //                alert(result);
        //            });
        //            $cordovaFileTransfer.upload(, , options, true).then(function (result) {
        //                alert("SUCCESS: " + JSON.stringify(result.response));
        //            }, function (err) {
        //                alert("ERROR: " + JSON.stringify(err));
        //            }, function (progress) {
        //                // constant progress updates
        //            });
        /*****************************************/


//        $scope.add = function () {
//            var f = document.getElementById('file').files[0];
//            var r = new FileReader();
//            console.log(f);
//            r.onloadend = function (e) {
//                var data = e.target.result;
//                var dataObj = {
//                    data: data,
//                    url: "http://104.131.33.197:8100/upload"
//                }
//                $http.post(url, data).then(function (response) {
//                    console.log(response);
//                })
//                //send your binary data via $http or $resource or do anything else with it
//                r.readAsBinaryString(f);
//            }
//        }

//        $scope.uploadFile = function (files) {
//            var fd = new FormData();
//            //Take the first selected file
//            fd.append("file", files[0]);
//
//            $http.post("http://104.131.33.197:8100/upload", fd, {
//                withCredentials: true,
//                headers: {
//                    'Content-Type': undefined
//                },
//                transformRequest: angular.identity
//            }).then(function(response){
//                console.log(response);
//            })
//
//        };
    }])

    .controller('updateShareController', ["$scope", "contactService", "$stateParams", "$localStorage", "CheckAuth", "$state", function ($scope, contactService, $stateParams, $localStorage, CheckAuth, $state) {

        CheckAuth.checkAuth()
        $scope.user = $localStorage.user;

        $scope.contactId = $stateParams.id
        $scope.socialToggle = {
          name: 0,
          em: 0,
          fb: 0,
          sc: 0,
          li: 0,
          tw: 0,
          in: 0,
          ph1: 0,
          ph2: 0,
          wb1: 0,
          wb2: 0,
          gt: 0,
          tmb: 0,
          pin: 0,
          twt: 0,
          kik: 0,
          per: 0,
          med: 0,
          red: 0,
          sky: 0,
          vin: 0,
          vim: 0,
          wp: 0,
          em2: 0,
          hAd: 0,
          wAd: 0,
          bAd: 0,
          bD: 0
        }

        $scope.addContact = function (share, id) {
            var shareString = $scope.user._id + "&" + $scope.socialToggle.em + $scope.socialToggle.name + $scope.socialToggle.li +  $scope.socialToggle.fb + $scope.socialToggle.tw + $scope.socialToggle.in + $scope.socialToggle.sc + $scope.socialToggle.ph1 + $scope.socialToggle.ph2 + $scope.socialToggle.wb1 + $scope.socialToggle.wb2 + $scope.socialToggle.gt + $scope.socialToggle.tmb + $scope.socialToggle.pin + $scope.socialToggle.kik + $scope.socialToggle.per + $scope.socialToggle.med + $scope.socialToggle.red + $scope.socialToggle.sky + $scope.socialToggle.twt + $scope.socialToggle.vin + $scope.socialToggle.vim + $scope.socialToggle.wp + $scope.socialToggle.em2 + $scope.socialToggle.hAd + $scope.socialToggle.bAd + $scope.socialToggle.wAd + $scope.socialToggle.bD;

            contactService.addContact(shareString, id);
            alert("Contact Updated!");
            $state.go('menu.welcome');
        }

  }])

    .controller("IntroController", function ($scope, $state, $localStorage, $location) {
      $scope.default = function () {
        if ($localStorage.tutflag === null){
          $localStorage.tutflag = false;
        }
      };
      $scope.intro = function () {
        $location.path('/login');
      };
      $scope.default();
      $scope.flagCheck = function () {
        if ($localStorage.tutflag === true){
          return $scope.intro();
        } else return;
      };
      $scope.tutorialToggle = function () {
        $localStorage.tutflag = true;
        $location.path('/login');
      };
      $scope.flagCheck();

    })


  .controller('menuCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {

    }])

  //START NEW FIREBASE CODE *****************************************************************************
  .controller('ChatsCtrl', function($scope, Activities, ModalService, Users, activities, UserService) {
    $scope.activities = activities;

    $scope.remove = function(chat) {
      Activities.remove(chat);
    };

    // Top right button that create new private chat
    $scope.newChat = function() {
      ModalService
        .init('templates/modal/new-chat.html', $scope)
        .then(function(modal) {
          modal.show();
          Users.all.$loaded(function(users){
            $scope.users = users;
          });
          $scope.linkType = "contacts";
        });
    };
  })

  .controller('ChatCtrl', function($scope, $stateParams, $rootScope,
                                   Activities, Messages, Users,
                                   chat, messages, members, activity,
                                   Loading, linkType) {

    $scope.linkType = linkType;

    $scope.messages = messages;
    $scope.activity = activity;
    $scope.members = members;
    $scope.sendChat = function(chatText){
      var message = {
        userId: $rootScope.currentUser.$id,
        name: $rootScope.currentUser.name,
        face: $rootScope.currentUser.face,
        message: chatText,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      };

      // send Message
      Messages.addMessageAndUpdateActivities($scope.activity.$id, message, $scope.members);

    }


  })

  .controller('ChatDetailCtrl', function($scope, $stateParams, Activities, Members, ModalService, Users, $filter, $ionicHistory, toggleSelection,
                                         activity, members, Chats, Privates, $state, $rootScope) {

    // get activity
    $scope.activity = activity;

    // convert activity.face string to thumbs array
    if($scope.activity.face){
      $scope.thumbs = $filter('split')($scope.activity.face);
    }

    // chatMember store current chat member list
    $scope.chatMember = [];
    $scope.members = members;
    for(var i=0; i<$scope.members.length; i++){
      $scope.chatMember.push(Users.get($scope.members[i].$id));
    }

    $scope.newGroup = function() {
      ModalService
        .init('templates/modal/new-group.html', $scope)
        .then(function(modal) {
          modal.show();

          // init new group modal data
          $scope.modalView = {};
          $scope.modalView.groupMember = $scope.activity.members;
          $scope.modalView.groupName = $scope.activity.name;
          $scope.modalView.groupFace = $scope.activity.face;

          // get user list
          Users.all.$loaded(function(contacts){

            // user list
            $scope.contacts = contacts;
            for(var i=0; i<$scope.contacts.length; i++){
              $scope.contacts[i].checked = null;
            }

            // set current chat member checked
            // selectedMember store checkbox member select
            $scope.selectedMember = [];
            for(var i=0; i<$scope.members.length; i++){
              for(var j=0; j<$scope.contacts.length; j++){
                if($scope.members[i].$id == $scope.contacts[j].$id){
                  $scope.contacts[j].checked = true;
                  $scope.selectedMember.push($scope.contacts[j]);
                }
              }
            }

          });


        });
    };

    $scope.toggleSelection = function(obj){
      return toggleSelection(obj, $scope.selectedMember, $scope.modalView);
    }

    $scope.createNewGroup = function(){
      // must 3 people can create group
      if($scope.selectedMember.length > 2){
        var name, lastText, face, members, chatType;

        // if multiple member select,
        // make name, face and members data
        // based on these members info
        if(Array.isArray($scope.modalView.groupName)){
          name = $scope.modalView.groupName.join(", ");
        }
        else {
          name = $scope.modalView.groupName;
        }

        if(Array.isArray($scope.modalView.groupFace)){
          face = $scope.modalView.groupFace.join(", ");
        }
        else {
          face = $scope.modalView.groupFace;
        }

        if(Array.isArray($scope.modalView.groupMember)){
          members = $scope.modalView.groupMember.join(", ");
        }
        else {
          members = $scope.modalView.groupMember;
        }

        lastText = $rootScope.currentUser.name + " created the group";
        chatType = "group";
        Chats.update($scope.activity.$id, chatType);

        // remove private reference
        if($scope.members.length == 2){
          Privates.remove($scope.members[0].$id, $scope.members[1].$id);
          Privates.remove($scope.members[1].$id, $scope.members[0].$id);
        }


        // update Activities services
        for(var i=0; i<$scope.selectedMember.length; i++){
          Activities.add($scope.selectedMember[i].$id, $scope.activity.$id, name, lastText, face, members, chatType);
        }

        Activities.get($rootScope.currentUser.$id, $scope.activity.$id).$loaded(function(activities){
          $scope.activity = activities;
        });

        $scope.thumbs = $filter('split')(face);

        // update current chat members list
        $scope.chatMember = $scope.selectedMember;

        // update members service
        var memberIdList = [];
        for(var i=0; i<$scope.selectedMember.length; i++){
          memberIdList.push($scope.selectedMember[i].$id);
          Members.addMember($scope.activity.$id, $scope.selectedMember[i].$id);
        }

        // close
        $scope.closeModal();
        $ionicHistory.clearCache();

      }
    }
  })

  .controller('GroupsCtrl', function(Chats, $scope, Activities, Users, ModalService, $filter, Members, toggleSelection, $state, $ionicHistory, Messages, activities, $rootScope) {
    // get group list
    $scope.groups = activities;

    $scope.new_group = function() {
      ModalService
        .init('templates/modal/new-group.html', $scope)
        .then(function(modal) {
          modal.show();

          // init new group modal data
          $scope.modalView = {};

          // get user list
          Users.all.$loaded(function(contacts){

            $scope.contacts = contacts;
            for(var i=0; i<$scope.contacts.length; i++){
              $scope.contacts[i].checked = null;
            }

            // set current chat member checked
            // selectedMember store checkbox member select
            $scope.selectedMember = [];
            Users.get($rootScope.currentUser.$id).$loaded(function(me){
              $scope.selectedMember.push(me);
            });

            console.log($scope.selectedMember);

          });

        });
    };


    $scope.toggleSelection = function(obj){
      return toggleSelection(obj, $scope.selectedMember, $scope.modalView);
    }

    $scope.createNewGroup = function(){
      // must 3 people can create group
      if($scope.selectedMember.length > 2){
        var name, lastText, face, members, chatType;

        // if multiple member select,
        // make name, face and members data
        // based on these members info
        if(Array.isArray($scope.modalView.groupName)){
          name = $scope.modalView.groupName.join(", ");
        }
        else {
          name = $scope.modalView.groupName;
        }

        if(Array.isArray($scope.modalView.groupFace)){
          face = $scope.modalView.groupFace.join(", ");
        }
        else {
          face = $scope.modalView.groupFace;
        }

        if(Array.isArray($scope.modalView.groupMember)){
          members = $scope.modalView.groupMember.join(", ");
        }
        else {
          members = $scope.modalView.groupMember;
        }

        lastText = $rootScope.currentUser.name + " created the group";
        chatType = "group";

        Chats.newGroup($scope.selectedMember).then(function(chat){

          // update Activities services
          for(var i=0; i<$scope.selectedMember.length; i++){
            Activities.add($scope.selectedMember[i].$id, chat.$id, name, lastText, face, members, chatType);
          }

          Activities.get($rootScope.currentUser.$id, chat.$id).$loaded(function(activities){
            $scope.chat = activities;

            // close
            $ionicHistory.clearCache();
            $scope.closeModal();
            $state.go("tab.group", { "groupId": $scope.chat.$id});
          });
        });

      }
    }
  })

  .controller('ContactsCtrl', function($scope, contacts, $ionicPopup) {
    // get user list
    $scope.users = contacts;

    // add contact
    $scope.showPromptAdd = function () {
      $ionicPopup.prompt({
          title: 'Invite to Messenger',
          template: 'Enter someone\'s email to invite them on Messenger',
          inputType: 'email',
          inputPlaceholder: 'Email',
          okText: 'Send',
        }
      )
        .then(function (res) {
          console.log('Your password is', res);
        });
    }
  })

  .controller('AccountCtrl', function($scope, Auth) {
    $scope.signOut = function (){
      return Auth.$signOut();
    };
  });
