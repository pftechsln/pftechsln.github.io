import { FhirControl } from "../fhirJS/fhirControl.js";

// Constants: FHIR Client for Health Organization on Epic
const productionClient = {
	name: "PatientFHIR",
	//clientId: "c45f46c7-66cb-4ac5-b8d0-d66f5260e419",
	clientId: "6c3586a3-a669-4944-aab1-ad5234348f56",
	redirectUri: getBaseURL() + "/fhirData.html",
	scope: "*",
	appName: "Health on Fhir",
};

// Constants: Epic Client for the Epic Sandbox
const sandboxClient = {
	name: "Epic Client",
	//clientId: "6c12dff4-24e7-4475-a742-b08972c4ea27",
	clientId: "682f041d-5ed1-4d1b-a8c4-08653678e7ca",
  redirectUri: getBaseURL() + "/fhirData.html",
	scope: "*",
	appName: "Health on Fhir",
};

// Constants: MI Client
const miFhirClient = {
	name: "MI FHIR App",
	clientId: "2a65a1m9hg4f34q6fqfh2o91ij",
	redirectUri: "https://pftechsln.github.io/fhirData.html",
  oauthUri: "https://pvdev-auth.auth.us-west-2.amazoncognito.com/login",
  tokenUri: "https://pvdev-auth.auth.us-west-2.amazoncognito.com/oauth2/token",
	scope: "*",
	appName: "MI FHIR App",
};

// Get the current base URL and use it as the redirect URL
// 12/01/18 - Added
function getBaseURL() {
	var url = window.location.href; // entire url including querystring
	var baseURL = url.substring(0, url.indexOf("/", 8)); // start after https://

	return baseURL;
}

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
			sessionStorage.removeItem("oauthCode");
			sessionStorage.removeItem("accessToken");

			// Load list of fhir endpoints orgs and URLs
			let epicEndPointUrl = "./data/EpicEndpoints2.txt";
			$http.get(epicEndPointUrl).then(
				(response) => {
					$scope.fhirOrgs = response.data.Entries;

					// load previous endpoint selection, and set up fhir config for OAuth login
					$scope.rememberLastLogin =
						sessionStorage.getItem("rememberLastLogin") === "true";
					if ($scope.rememberLastLogin === true) {
						$scope.serverIndex = sessionStorage.getItem("serverIndex");
						$scope.updateSettings();
					} else {
						sessionStorage.clear();
					}
				},
				(error) => {
					console.log("Error loading endpoints: ", error);
				}
			);
		};

		// Redirect browser to Fhir Authorize URL
		$scope.oauthLogin = function () {
			window.location.href = $scope.fhirConfig.authUrl;
		};

		// Gather client and server info, pass to FhirControl to set up for OAuth login
		$scope.updateSettings = function (serverInfo) {
			var client, server;

			// Save off }selection to auto-populatae when come back to the page
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
					"https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/" ||
				server.orgName === "Epic Sandbox"
			) {
				client = sandboxClient;
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

		// 2 quick login cases for Epic Sandbox and Overlake Hospital
		$scope.testCase = function (caseName) {
			switch (caseName) {
				case "ohmcExt":
					$scope.serverIndex = 139;
					$scope.updateSettings({
						endpointUrl:
							"https://sfd.overlakehospital.org/FHIRproxy/api/FHIR/DSTU2/",
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

				case "epic":
				default:
					$scope.serverIndex = 2;
					$scope.updateSettings({
						endpointUrl: "https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/",
						orgName: "Epic Sandbox",
					});
			}

			$scope.oauthLogin();
		};

		$scope.cancelRedirect = function () {
			clearTimeout($scope.timeout);
			console.log($scope.timeout);
		};
	},
]);
