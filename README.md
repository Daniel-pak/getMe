<h1>Project name:</h1>
getMe<br>
<br>
<h1>Engineers:</h1>
<br>
Miriam Williams - Lead<br>
Daniel Pak - Lead<br>
Jason Owens - Lead<br>
<br>
<h1>Details:</h1>
This project is a challenging attempt at creating a useful and functional mobile application. The team designed, created, and implemented a working proof of concept in 10 days.<br>
<br>
The team used two completely foreign technologies to create the application: websockets and Ionic v1. None of the team members had previous experience with said technologies yet systematically demonstrated resilience in the face of many different bugs and structural challenges.<br>
<br>
Presently, the app can be deployed and used on Android. Further testing and fixes to come shortly for iOS deployment.<br>

<h1>This application should be considered pre-alpha status</h1>
After installing all npm packages in both the getMe folder and getMe/www/js folder, got to /getMe and run the following to
install the proper plugins, otherwise you'll get white screen of death:
ionic plugin add cordova-plugin-whitelist
ionic plugin add ionic-plugin-keyboard
ionic plugin add phonegap-plugin-barcodescanner

The Google services plugin for Gradle loads the google-services.json file you just downloaded. Modify your build.gradle files to use the plugin.

1 - Project-level build.gradle (<project\>/build.gradle):

buildscript {

dependencies {

// Add this line

classpath 'com.google.gms:google-services:3.0.0'
}

}

2 - App-level build.gradle (<project>/<app-module>/build.gradle):

...

// Add to the bottom of the file

apply plugin: 'com.google.gms.google-services'
