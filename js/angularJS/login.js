import { FhirControl } from "../fhirJS/fhirControl.js";
import {
  productionClient,
  sandboxClient,
  miFhirClient,
  sandboxClientR4,
} from "../../config/fhir_client.js";
import { fhir_server_list } from "../../config/fhir_server.js";

// // Constants: FHIR Client for Health Organization on Epic
// const productionClient = {
// 	name: "PatientFHIR",
// 	//clientId: "c45f46c7-66cb-4ac5-b8d0-d66f5260e419",
// 	clientId: "6c3586a3-a669-4944-aab1-ad5234348f56",
// 	redirectUri: getBaseURL() + "/fhirData.html",
// 	scope: "*",
// 	appName: "Health on Fhir",
// };

// // Constants: Epic Client for the Epic Sandbox
// const sandboxClient = {
// 	name: "Epic Client",
// 	//clientId: "6c12dff4-24e7-4475-a742-b08972c4ea27",
// 	clientId: "682f041d-5ed1-4d1b-a8c4-08653678e7ca",
//   redirectUri: getBaseURL() + "/fhirData.html",
// 	scope: "*",
// 	appName: "Health on Fhir",
// };

// // Constants: MI Client
// const miFhirClient = {
// 	name: "MI FHIR App",
// 	clientId: "2a65a1m9hg4f34q6fqfh2o91ij",
// 	redirectUri: "https://pftechsln.github.io/fhirData.html",
//   oauthUri: "https://pvdev-auth.auth.us-west-2.amazoncognito.com/login",
//   tokenUri: "https://pvdev-auth.auth.us-west-2.amazoncognito.com/oauth2/token",
// 	scope: "*",
// 	appName: "MI FHIR App",
// };

var app = angular.module("myApp", []);

// --------------------------------------------------------------------
// ------ AngularJS control for login on index.html -------------------
//---------------------------------------------------------------------
app.controller("loginCtrl", [
  "$scope",
  "$http",
  function ($scope, $http) {
    // Initialize settings on page load
    $scope.initSettings = function () {
      // clear session storage from last connection
      sessionStorage.removeItem("oauthCode");
      sessionStorage.removeItem("accessToken");

      // load list of fhir endpoints orgs and URLs
      $scope.fhirOrgs = fhir_server_list.Entries;

      // load previous endpoint selection, and set up fhir config for OAuth login
      $scope.rememberLastLogin =
        sessionStorage.getItem("rememberLastLogin") === "true";
      if ($scope.rememberLastLogin === true) {
        $scope.serverIndex = sessionStorage.getItem("serverIndex");
        $scope.updateSettings();
      } else {
        sessionStorage.clear();
      }
    };

    // Gather client and server info, pass to FhirControl to set up for OAuth login
    $scope.updateSettings = function (serverInfo) {
      var client, server;

      // Save off selection to auto-populatae when come back to the page
      if ($scope.rememberLastLogin === true) {
        sessionStorage.setItem("serverIndex", $scope.serverIndex);
        sessionStorage.setItem("rememberLastLogin", $scope.rememberLastLogin);
      } else {
        sessionStorage.clear();
      }

      // get server info from menu selection or parameter;
      if (typeof serverInfo != "undefined") {
        server = serverInfo;
      } else if ($scope.serverIndex >= 0) {
        server = {
          endpointUrl: $scope.fhirOrgs[$scope.serverIndex].FHIRPatientFacingURI,
          orgName: $scope.fhirOrgs[$scope.serverIndex].OrganizationName,
        };
      } else return;

      // from server determine whether to use test client or production client
      if (
        server.endpointUrl ===
          "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/DSTU2/" ||
        server.orgName === "Epic Sandbox"
      ) {
        client = sandboxClientR4;
      } else if (server.orgName === "Epic Sandbox R4") {
        client = sandboxClientR4;
      } else if (
        server.orgName === "MI FHIR R4" ||
        server.orgName === "MI FHIR R4 Offline"
      ) {
        client = miFhirClient;
      } else {
        client = productionClient;
      }

      // pass Smart Oauth config to FhirControl, return true if requirements are met
      $scope.fhirConfig = FhirControl.setFhirConfig(client, server);
      if ($scope.fhirConfig.ready) {
        $("#btnLogin").prop("disabled", false);
      } else {
        $("#btnLogin").prop("disabled", true);
      }
    };

    // some quick login cases for Epic Sandbox and Overlake Hospital
    $scope.testCase = function (caseName) {
      switch (caseName) {
        case "ohmcExt":
          $scope.serverIndex = 2;
          $scope.updateSettings({
            endpointUrl:
              "https://sfd.overlakehospital.org/FHIRproxy/api/FHIR/DSTU2/",
            orgName: "Overlake Hospital and Medical Center",
          });
          break;

          case "ohmcExtR4":
            $scope.serverIndex = 2;
            $scope.updateSettings({
              endpointUrl:
                "https://sfd.overlakehospital.org/FHIRproxy/api/FHIR/R4/",
              orgName: "Overlake Hospital and Medical Center",
            });
            break;

        case "miFhir":
          $scope.serverIndex = 0;
          $scope.updateSettings({
            endpointUrl: "http://localhost:3002/",
            orgName: "MI FHIR R4 Offline",
          });
          break;

        case "epicR4":
          $scope.serverIndex = 1;
          $scope.updateSettings({
            endpointUrl:
              "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/",
            orgName: "Epic Sandbox R4",
            scope: "Patient Encounter ServiceRequest Task",
          });
          break;

        case "epic":
        default:
          $scope.serverIndex = 0;
          $scope.updateSettings({
            endpointUrl: "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/DSTU2/",
            orgName: "Epic Sandbox",
          });
      }

      $scope.oauthLogin();
    };

    // Update server selection in session storage
    $scope.updateCache = function () {
      if ($scope.rememberLastLogin === true) {
        sessionStorage.setItem("rememberLastLogin", true);
        sessionStorage.setItem("serverIndex", $scope.serverIndex);
      } else {
        sessionStorage.removeItem("rememberLastLogin");
        sessionStorage.removeItem("serverIndex");
      }
    };

    // Display sample data without OAuth login
    $scope.displaySampleData = function () {
      sessionStorage.removeItem("fhirConfig"); // do not load the urls, access code, auth code from last session
      window.location.href = "fhirData.html";
    };

    // Redirect browser to Fhir Authorize URL
    $scope.oauthLogin = function () {
      window.location.href = $scope.fhirConfig.authUrl;
    };

    $scope.cancelRedirect = function () {
      clearTimeout($scope.timeout);
      console.log($scope.timeout);
    };
  },
]);
