import { FhirControl } from '../fhirJS/fhirControl.js';

var app = angular.module('myApp', []);

// --------------------------------------------------------------------
// ------ AngularJS control for Fhir Data on fhirData.html ------------
//---------------------------------------------------------------------
app.controller('fhirDataCtrl', [
  '$scope',
  '$http',
  function ($scope, $http) {
    $scope.init = function () {
      var oauthCode = sessionStorage.getItem('oauthCode');
      var accessToken = sessionStorage.getItem('accessToken');
      $scope.fhirConfig = JSON.parse(sessionStorage.getItem('fhirConfig'));
      console.log('Loading fhirConfig', $scope.fhirConfig);

      $scope.fhirRsrList = [];
      $scope.rawFhirRsrList = [];

      // If from redirecting after oauth login, get oauth code from the url
      if (window.location.search.length > 3) {
        var valuePairs = window.location.search.substring(1).split('&');
        var code = valuePairs[0].split('=');

        // Redirected from OAuth login with authorization code
        if (code[0] === 'code') {
          oauthCode = code[1];
          $scope.oauthCode = oauthCode;
          sessionStorage.setItem('oauthCode', oauthCode);
        } else if (code[0] === 'error') {
          //?error=access_denied&error_description=User+refused
          for (let i = 0; i < valuePairs.length; i++) {
            valuePairs[i] = valuePairs[i].split('=');
          }
          $scope.valuePairs = valuePairs;
          $scope.hasError = true;
          $('#errorMsgbox').prop('hidden', false);
          return;
        }
      }

      // No oauth code: load sample data without login
      if (oauthCode == null) {
        //$('#reload').hide();
        FhirControl.loadSampleData($scope, $http);
        console.log('load sample data...');
      }
      // Has oauth code but not access code: exchange with access code and then retrieve fhir resources
      else if (accessToken == null) {
        $scope.oauthCode = oauthCode;
        // Exchange authorization code for access token
        FhirControl.getAccessToken($scope, $http);
        console.log('load fhir data');
      }
      // Has both: refreshing the page, so reload the data
      else {
        $scope.accessToken = accessToken;
        $scope.patient = sessionStorage.getItem('patient');
        FhirControl.loadFhirData($scope, $http);
      }
    };

    // reload fhir data
    $scope.loadFhirData = function () {
      FhirControl.loadFhirData($scope, $http);
    };
  },
]);
