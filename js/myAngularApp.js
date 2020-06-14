import { FhirControl } from './fhirControl.js';

// Constants: FHIR Client for Health Organization on Epic
const productionClient = {
  name: 'PatientFHIR',
  //clientId: "c45f46c7-66cb-4ac5-b8d0-d66f5260e419",
  clientId: '6c3586a3-a669-4944-aab1-ad5234348f56',
  redirectUri: 'https://pftechsln.github.io/',
};

// Constants: Epic Client for the Epic Sandbox
const sandboxClient = {
  name: 'Epic Client',
  //clientId: "6c12dff4-24e7-4475-a742-b08972c4ea27",
  clientId: '682f041d-5ed1-4d1b-a8c4-08653678e7ca',
  redirectUri: 'https://pftechsln.github.io/',
};

// Get the current base URL and use it as the redirect URL
// 12/01/18 - Added
function getBaseURL() {
  var url = window.location.href; // entire url including querystring
  var baseURL = url.substring(0, url.indexOf('/', 8)); // start after https://

  return baseURL;
}

function loadFhirSettings($scope) {
  $scope.clientId = sessionStorage.getItem('client');
  $scope.redirectUri = sessionStorage.getItem('redirectUri');
  $scope.serverIndex = sessionStorage.getItem('serverIndex');
  $scope.fhirEndpointUrl = sessionStorage.getItem('fhirEndpointUrl');
  $scope.orgName = sessionStorage.getItem('orgName');
  $scope.rememberLastLogin = sessionStorage.getItem('rememberLastLogin');

  $scope.fhirBaseUrl = $scope.fhirEndpointUrl.replace('api/FHIR/DSTU2/', '');
  $scope.fhirAuthUrl =
    $scope.fhirBaseUrl +
    'oauth2/authorize?response_type=code&client_id=' +
    $scope.clientId +
    '&redirect_uri=' +
    $scope.redirectUri;
  $scope.fhirTokenUrl = $scope.fhirBaseUrl + 'oauth2/token';
  $scope.fhirMetaUrl = $scope.fhirEndpointUrl + 'metadata';

  if ($scope.fhirEndpointUrl != '') {
    $('#btnLogin').prop('disabled', false);
  } else {
    $('#btnLogin').prop('disabled', true);
  }
}

function setFhirSettings($scope, endpointUrl, testClient) {
  if (endpointUrl == null) {
    endpointUrl = $scope.fhirOrgs[$scope.serverIndex].FHIRPatientFacingURI;
    $scope.fhirEndpointUrl = endpointUrl;
    $scope.orgName = $scope.fhirOrgs[$scope.serverIndex].OrganizationName;
  } else {
    $scope.fhirEndpointUrl = endpointUrl;
    $scope.orgName = 'Epic Sandbox';
  }

  if (endpointUrl == 'https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/') {
    testClient = sandboxClient;
  } else if (testClient == null) {
    testClient = productionClient;
  }
  $scope.clientId = testClient.clientId;

  if ($scope.fhirEndpointUrl != '0') {
    $('#btnLogin').prop('disabled', false);
  } else {
    $('#btnLogin').prop('disabled', true);
  }

  //$scope.redirectUri = testClient.redirectUri;
  $scope.redirectUri = getBaseURL() + '/fhirData.html';

  $scope.fhirBaseUrl = endpointUrl.replace('api/FHIR/DSTU2/', '');
  $scope.fhirAuthUrl =
    $scope.fhirBaseUrl +
    'oauth2/authorize?response_type=code&client_id=' +
    $scope.clientId +
    '&redirect_uri=' +
    $scope.redirectUri;
  $scope.fhirTokenUrl = $scope.fhirBaseUrl + 'oauth2/token';
  $scope.fhirMetaUrl = $scope.fhirEndpointUrl + 'metadata';

  sessionStorage.setItem('fhirEndpointUrl', endpointUrl);
  sessionStorage.setItem('serverIndex', $scope.serverIndex);
  sessionStorage.setItem('client', $scope.clientId);
  sessionStorage.setItem('redirectUri', $scope.redirectUri);
  sessionStorage.setItem('rememberLastLogin', $scope.rememberLastLogin);
  sessionStorage.setItem('orgName', $scope.orgName);

  FhirControl.setFhirSettings(endpointUrl, testClient);
  console.log('FhirControl.fhirSettings', FhirControl.fhirSettings);
  // save off last login in cookie
  /*   console.log($scope.rememberLastLogin);
  if ($scope.rememberLastLogin == true) {
    document.cookie =
      'lastLogin=' + $scope.clientId + ' | ' + $scope.fhirEndpointUrl;
    console.log(document.cookie);
  } */
}

function testCase(caseName, $scope) {
  switch (caseName) {
    case 'ohmcExt':
      setFhirSettings(
        $scope,
        'https://sfd.overlakehospital.org/FHIRproxy/api/FHIR/DSTU2/',
        productionClient
      );
      break;

    case 'epic':
    default:
      setFhirSettings(
        $scope,
        'https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/',
        sandboxClient
      );
  }

  console.log(caseName);
  $scope.oauthLogin();
}

function getAccessToken($scope, $http) {
  var oauthCode = $scope.oauthCode;

  var data = $.param({
    grant_type: 'authorization_code',
    code: oauthCode,
    redirect_uri: $scope.redirectUri,
    client_id: $scope.clientId,
  });

  data = unescape(data);

  $scope.statusText =
    'In progress: exchanging authorization code for access token...';

  $http({
    method: 'POST',
    url: $scope.fhirTokenUrl,
    data: data,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Accept: '*/*',
    },
  }).then(
    function (response) {
      //alert(status + data);
      var data = response.data;

      $scope.accessToken = data.access_token;
      $scope.patient = data.patient;
      $scope.accessTokenJson = JSON.stringify(data, undefined, 2);
      sessionStorage.setItem('accessToken', $scope.accessToken);
      sessionStorage.setItem('patient', data.patient);

      FhirControl.loadFhirData($scope, $http);
    },
    function (error) {
      $scope.statusText =
        'Error exchanging access token: ' +
        error.status +
        ' - ' +
        error.statusText;
    }
  );
}

var app = angular.module('myApp', []);

// Angular controler for fhirData
app.controller('fhirDataCtrl', [
  '$scope',
  '$http',
  function ($scope, $http) {
    $scope.init = function () {
      var oauthCode = sessionStorage.getItem('oauthCode');
      var accessToken = sessionStorage.getItem('accessToken');
      $scope.fhirRsrList = [];
      $scope.rawFhirRsrList = [];
      console.log(oauthCode);

      // If from redirecting after oauth login, get oauth code from the url
      if (window.location.search.length > 3) {
        var code = window.location.search.substring(1).split('=');

        // Redirected from OAuth login with authorization code
        if (code[0] == 'code') {
          oauthCode = code[1];
          $scope.oauthCode = oauthCode;
          sessionStorage.setItem('oauthCode', oauthCode);
        }
      }

      // No oauth code: load sample data without login
      if (oauthCode == null) {
        $('#reload').hide();
        FhirControl.loadSampleData($scope, $http);
        console.log('load sample data...');
      }
      // Has oauth code but not access code: exchange with access code and then retrieve fhir resources
      else if (accessToken == null) {
        $scope.oauthCode = oauthCode;

        // Retrieve the session state/settings of FHIR
        //testCase(sessionStorage.getItem('testCase'), $scope);
        loadFhirSettings($scope);
        console.log('load fhir settings', $scope);

        // Exchange authorization code for access token
        getAccessToken($scope, $http);
        console.log('load fhir data');
      }
      // Has both: refreshing the page, so reload the data
      else {
        loadFhirSettings($scope);
        console.log('load fhir settings', $scope);
        $scope.accessToken = accessToken;
        $scope.patient = sessionStorage.getItem('patient');
        FhirControl.loadFhirData($scope, $http);
      }
    };

    $scope.getAccessToken = function () {
      getAccessToken($scope, $http);
    };

    $scope.loadFhirData = function () {
      FhirControl.loadFhirData($scope, $http);
    };

    $scope.reLogin = function () {
      sessionStorage.clear();
    };
  },
]);

app.controller('loginCtrl', [
  '$scope',
  '$http',
  function ($scope, $http) {
    // redirect to Github if on Azure
    /*     if (window.location.hostname.includes('healthonfhir.azurewebsites.net')) {
      //if (window.location.href.includes('localhost')) {
      $('#redirect').modal('show');
      $scope.timeout = setTimeout(() => {
        window.location.href = 'https://pftechsln.github.io';
      }, 10000);
    }
 */
    // Load list of fhir endpoints orgs and URLs
    //$scope.fhirOrgs = FhirControl.loadEpicFhirOrgs($scope).Entries;
    FhirControl.loadEpicFhirOrgs($scope);
    console.log('fhirorg', $scope.fhirOrgs);

    //
    if (window.location.search.length > 3) {
      var code = window.location.search.substring(1).split('=');

      // Redirected from OAuth login with authorization code
      if (code[0] == 'code') {
        oauthCode = code[1];
        $scope.oauthCode = oauthCode;
        sessionStorage.setItem('oauthCode', oauthCode);

        var redirectUri = sessionStorage.getItem('redirectUri');
        if (redirectUri == null) {
          window.location.href =
            'https://healthonfhir.azurewebsites.net/index.html?code=' +
            oauthCode;
        } else {
          window.location.href = 'fhirData.html';
        }
      }
    } else {
      $scope.rememberLastLogin = sessionStorage.getItem('rememberLastLogin');
      if ($scope.rememberLastLogin === 'true') {
        loadFhirSettings($scope);
      } else {
        console.log('clear session storage.');
        sessionStorage.clear();
      }
    }

    // Redirect browser to Fhir Authorize URL
    $scope.oauthLogin = function () {
      window.location.href = $scope.fhirAuthUrl;
      // console.log($scope.fhirAuthUrl);
    };

    // Quick fill in for test cases
    $scope.testCase = function (caseName) {
      testCase(caseName, $scope);
    };

    // Udate settings from the Data URL
    $scope.updateSettings = function () {
      setFhirSettings($scope);
    };

    $scope.reLogin = function () {
      sessionStorage.clear();
    };

    $scope.displaySampleData = function () {
      sessionStorage.clear();
      window.location.href = 'fhirData.html';
    };

    $scope.cancelRedirect = function () {
      clearTimeout($scope.timeout);
      console.log($scope.timeout);
    };
  },
]);
