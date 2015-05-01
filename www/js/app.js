// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var coupod = angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

coupod.service('ValidateScan', function(scanData) {
    this.validateCustomer = function(scanData) {
        var customerName = scanData[0];
        return customerName.length > 0;
    };

    this.validateHash = function(scanData) {
        var transactionHashID = scanData[1];
        return transactionHashID.length > 0;
    }
});

coupod.controller("ScannerController", function($scope, $cordovaBarcodeScanner) {

    $scope.scanComplete = false;
    $scope.scanError = false;
    $scope.qrObj = [];

  $scope.scan = function() {
    $cordovaBarcodeScanner.scan().then(function(imageData) {
        if(!imageData.cancelled) {
            $scope.qrObj = imageData.text.split(",");
            if($scope.qrObj.length == 2) {
                $scope.scanComplete = true;
                $scope.scanError = false;
            }
            else {
                $scope.scanError = true;
                $scope.scanComplete = false;
            }
        }
        else {
            $scope.scanError = true;
            $scope.scanComplete = false;
        }
    }, function(error) {
        $scope.scanError = true;
        console.log("An error occurred -> " + error);
    });
  };

});