
// Constants : Resources Names
var resources = [
    { name: 'Conformance' },
    { name: 'Patient' },
    { name: 'AllergyIntolerance' },
    { name: 'Condition' },
    { name: 'MedicationOrder' },
    { name: 'MedicationStatement' },
    { name: 'DiagnosticReport' },
    { name: 'Observation', queryFilter: "category=laboratory", displayOverride: "Observation-laboratory", },
    { name: 'Observation', queryFilter: "category=social-history", displayOverride: "Observation-social-history", },
    { name: 'Observation', queryFilter: "category=vital-signs", displayOverride: "Observation-vital-signs", },
    { name: 'Procedure' },
    { name: 'Immunization' },
    { name: 'CarePlan' },
    { name: 'Goal' },
    { name: 'DocumentReference' },
];

// Constants: FHIR Client for Health Organization on Epic
var defaultClient = {
    name: 'PatientFHIR',
    //clientId: "c45f46c7-66cb-4ac5-b8d0-d66f5260e419",
    clientId: "6c3586a3-a669-4944-aab1-ad5234348f56",
    redirectUri: "https://pftechsln.github.io/",
}

// Constants: Epic Client for the Epic Sandbox
var epicClient = {
    name: 'Epic Client',
    //clientId: "6c12dff4-24e7-4475-a742-b08972c4ea27",
    clientId: "682f041d-5ed1-4d1b-a8c4-08653678e7ca",
    redirectUri: "https://pftechsln.github.io/",
}

// Load the list of fhir endpoints from the json file
function loadFhirOrg($scope, $http) {
    var data;

    $.ajax({
        url: "/assets/EpicEndpoints.json",
        dataType: 'json',
        data: data,
        async: false,
        success: function (data) {
            $scope.fhirOrgs = data.Entries;
        }
    })
}

function loadFhirSettings($scope) {

    $scope.clientId = sessionStorage.getItem('client');
    $scope.redirectUri = sessionStorage.getItem('redirectUri');

    $scope.fhirEndpointUrl = sessionStorage.getItem('fhirEndpointUrl');
    $scope.fhirBaseUrl = $scope.fhirEndpointUrl.replace("api/FHIR/DSTU2/", "");
    $scope.fhirAuthUrl = $scope.fhirBaseUrl + "oauth2/authorize?response_type=code&client_id=" + $scope.clientId + "&redirect_uri=" + $scope.redirectUri;
    $scope.fhirTokenUrl = $scope.fhirBaseUrl + "oauth2/token";
}

function setFhirSettings($scope, endpointUrl, testClient) {

    if (testClient == null) {
        testClient = defaultClient;
    }

    if (endpointUrl == null) {
        endpointUrl = $scope.fhirEndpointUrl;
    }
    else {
        $scope.fhirEndpointUrl = endpointUrl;
    }

    if ($scope.fhirEndpointUrl != "0"){
        $('#btnLogin').prop('disabled', false);
    }
    else {
        $('#btnLogin').prop('disabled', true);
    }

    $scope.clientId = testClient.clientId;
    $scope.redirectUri = testClient.redirectUri;

    $scope.fhirBaseUrl = endpointUrl.replace("api/FHIR/DSTU2/", "");
    $scope.fhirAuthUrl = $scope.fhirBaseUrl + "oauth2/authorize?response_type=code&client_id=" + $scope.clientId + "&redirect_uri=" + $scope.redirectUri;
    $scope.fhirTokenUrl = $scope.fhirBaseUrl + "oauth2/token";

    sessionStorage.setItem('fhirEndpointUrl', endpointUrl);
    sessionStorage.setItem('client', testClient.clientId);
    sessionStorage.setItem('redirectUri', testClient.redirectUri);

    // save off last login in cookie
    console.log($scope.rememberLastLogin);
    if ($scope.rememberLastLogin == true) {
        document.cookie = "lastLogin=" + $scope.clientId;
        console.log(document.cookie);
    }
}

function testCase(caseName, $scope) {


    switch (caseName) {
        case 'epic':
            setFhirSettings($scope, "https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/", epicClient);
            break;

        case 'ohmcExt':
            setFhirSettings($scope, "https://sfd.overlakehospital.org/FHIRproxy/api/FHIR/DSTU2/", defaultClient);
            break;

        default:
            setFhirSettings($scope, "https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/", epicClient);
    }

    console.log(caseName);
    $scope.oauthLogin()
}

function getAccessToken($scope, $http) {

    var oauthCode = $scope.oauthCode;

    var data = $.param({
        grant_type: 'authorization_code',
        code: oauthCode,
        redirect_uri: $scope.redirectUri,
        client_id: $scope.clientId
    });

    data = unescape(data);

    $scope.statusText = "In progress: exchanging authorization code for access token...";

    $http({
        method: 'POST',
        url: $scope.fhirTokenUrl,
        data: data,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': '*/*'
        }
    }
    ).then(
        function(response) {
            //alert(status + data);
            var data = response.data;

            $scope.accessToken = data.access_token;
            $scope.patient = data.patient;
            $scope.accessTokenJson = JSON.stringify(data, undefined, 2);

            loadFhirData($scope, $http);
        },
        function (error) {
            $scope.statusText = "Error exchanging access token: " + error.status + " - " + error.statusText;
        }
    );
}



var app = angular.module('myApp', []);

app.controller('fhirDataCtrl', ['$scope', '$http', function ($scope, $http) {

    var fhirRsrList = [];
    var oauthCode = sessionStorage.getItem('oauthCode');
    console.log(oauthCode);

    if (oauthCode == null) {

        loadSampleData($scope);
        console.log("load sample data...");
    }
    else
    {
        $scope.oauthCode = oauthCode;
    
        // Retrieve the session state/settings of FHIR
        //testCase(sessionStorage.getItem('testCase'), $scope);
        loadFhirSettings($scope);
        console.log("load fhir settings");

        // Exchange authorization code for access token
        getAccessToken($scope, $http);
        console.log("load fhir data");
    }


    $scope.getAccessToken = function () {
        getAccessToken($scope, $http);
    }

    $scope.loadFhirData = function () {
        loadFhirData($scope, $http);
    }

}]);


app.controller('loginCtrl', ['$scope', '$http', function ($scope, $http) {


    $scope.rememberLastLogin = "true";
    $scope.fhirEndpointUrl ="0";
   
    
    // Load list of fhir endpoints orgs and URLs
    loadFhirOrg($scope, $http);

    // 
    if (window.location.search.length > 3) {
        var code = window.location.search.substring(1).split('=');

        // Redirected from OAuth login with authorization code
        if (code[0] == "code") {
            oauthCode = code[1];
            $scope.oauthCode = oauthCode;
            sessionStorage.setItem("oauthCode", oauthCode);

            window.location.href = "fhirData.html";
        }
    }
    else
    {
        sessionStorage.clear();
    }

    // Redirect browser to Fhir Authorize URL
    $scope.oauthLogin = function () {
        window.location.href = $scope.fhirAuthUrl;
        console.log($scope.fhirAuthUrl);
    };

    // Quick fill in for test cases
    $scope.testCase = function (caseName) {
        testCase(caseName, $scope);
    };

    // Udate settings from the Data URL
    $scope.updateSettings = function () {
        setFhirSettings($scope);
    }

    $scope.reLogin = function () {
        $('#emrLogin').removeClass('collapse');
        //$('#emrData').addClass('collapse');
        $('#btnLogin').addClass('disable');
        $('#emrData').addClass('collapse');
        $('#bottomNavbar').addClass('collapse');
    }

    $scope.displaySampleData = function() {        
        window.location.href = "fhirData.html";
    }
}]);
