// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var coupod = angular.module('coupod', ['coupod-constants', 'ionic', 'ngCordova'])

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

coupod.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('index', {
            url: '/',
            controller: 'HomeController',
            templateUrl: 'templates/home.html'
        })
        .state('scan', {
            url: '/scan',
            'controller': 'ScannerController',
            templateUrl: 'templates/scan.html'
        });
    $urlRouterProvider.otherwise('/');
});

coupod.factory('ValidateScan', function() {
    return {
        validateCustomer: function(scanData) {
            var customerName = scanData[0];
            return customerName.length > 0;
        },
        validateHash: function(scanData) {
        var transactionHashID = scanData[1];
        return transactionHashID.length > 0;
    }
    }
});

coupod.controller("ScannerController", function($scope, $state, $cordovaBarcodeScanner, ValidateScan, hashid_salt) {

    $scope.scanComplete = false;
    $scope.scanError = false;
    $scope.qrObj = {};

  $scope.scan = function() {
    $cordovaBarcodeScanner.scan().then(function(imageData) {
        if(!imageData.cancelled) {
            var hashid = new Hashids(hashid_salt);
            var splitScan = hashid.decode(imageData);
            if( ValidateScan.validateCustomer(splitScan) && ValidateScan.validateHash(splitScan) ) {
                $scope.qrObj["company_id"] = splitScan[0];
                $scope.qrObj["transaction_id"] = splitScan[1];
                $scope.scanComplete = true;
                $scope.scanError = false;
            }
            else {
                console.log(splitScan);
                $scope.scanError = true;
                $scope.scanComplete = false;
            }
        }
        else {
            $scope.scanError = false;
            $scope.scanComplete = false;
        }
    }, function(error) {
        $scope.scanError = true;
        console.log("An error occurred -> " + error);
    });
  };
});

coupod.controller('HomeController', function ($scope, $state, $templateCache, $q, $rootScope) {
    $scope.goToSignUp = function () {
        $state.go('signup');
    };

    $scope.goToForgotPassword = function () {
        $state.go('forgot-password');
    };

    $scope.doLogIn = function () {
        $state.go('app.feeds-categories');
    };

    $scope.goToScanner = function () {
        $state.go('scan');
    };

    $scope.user = {};

    $scope.user.email = "admin";
    $scope.user.password = "admin";

    // We need this for the form validation
    $scope.selected_tab = "";

    $scope.$on('my-tabs-changed', function (event, data) {
        $scope.selected_tab = data.title;
    });

});