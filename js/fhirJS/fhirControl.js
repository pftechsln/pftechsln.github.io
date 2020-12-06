import { loadSampleData } from "./loadSampleFhirData.js";
import { FhirPatient, FhirResource } from "./fhirModel.js";

export class FhirControl {
	static fhirSettings;

	static loadSampleData($scope, $http) {
		loadSampleData($scope);
	}

	// set up Fhir Oauth config
	// client: {
	//  clientId: ...,      //required
	//  appName: ...,       //optional
	//  redirectUrl: ...,    //required
	//  scope: ...,          //optional, default '*'
	// }
	// server: {
	//  orgName: ...,       //optional
	//  endpointUrl: ...,   //required
	//  }

	static setFhirConfig(client, server) {
		let fhirConfig = {};

		fhirConfig.ready = false;
		let endpointUrl = server.endpointUrl;
		let baseUrl = endpointUrl.replace("api/FHIR/DSTU2/", "");

		if (client.name === "MI FHIR App") {
      // https://pvdev-auth.auth.us-west-2.amazoncognito.com/login?
      // client_id=2a65a1m9hg4f34q6fqfh2o91ij&response_type=code&
      // scope=email+https://pvdev-auth-resource-server/patient:Patient.*+openid+phone+profile&
      // redirect_uri=https://healthonfhir.azurewebsites.net/fhirData.html
      fhirConfig.authUrl =
				client.oauthUri + "?response_type=code&client_id=" + 
				client.clientId +
				"&redirect_uri=" +
				client.redirectUri +
        "&scope=email+https://pvdev-auth-resource-server/patient:Patient.*+openid+phone+profile";
      fhirConfig.tokenUrl = client.tokenUri;
		} else {
			fhirConfig.authUrl =
				baseUrl +
				"oauth2/authorize?response_type=code&client_id=" +
				client.clientId +
				"&redirect_uri=" +
				client.redirectUri +
				"&scope=openid patient/Patient.* launch/patient";
			fhirConfig.tokenUrl = baseUrl + "oauth2/token";
		}

		fhirConfig.metaUrl = endpointUrl + "metadata";
		fhirConfig.endpointUrl = endpointUrl;
		fhirConfig.baseUrl = baseUrl;
		fhirConfig.redirectUri = client.redirectUri;
		fhirConfig.clientId = client.clientId;
		fhirConfig.orgName = server.orgName;

		if (
			endpointUrl != "" &&
			client.clientId != "" &&
			client.redirectUri != ""
		) {
			fhirConfig.ready = true;
		}

		sessionStorage.setItem("fhirConfig", JSON.stringify(fhirConfig));
		this.fhirConfig = fhirConfig;
		console.log("FhirControl.fhirConfig", this.fhirConfig);

		return fhirConfig;
	}

	static getAccessToken($scope, $http) {
		const oauthCode = $scope.oauthCode;
		const data = unescape(
			$.param({
				grant_type: "authorization_code",
				code: oauthCode,
				redirect_uri: $scope.fhirConfig.redirectUri,
				client_id: $scope.fhirConfig.clientId,
			})
		);

		console.log(
			"In progress: exchanging authorization code for access token..."
		);

		// $http({
		//   method: 'POST',
		//   url: $scope.fhirConfig.tokenUrl,
		//   data: data,
		//   headers: {
		//     'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
		//     Accept: '*/*',
		//   },
		fetch($scope.fhirConfig.tokenUrl, {
			method: "POST",
			headers: {
				"Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
				Accept: "*/*",
			},
			body: data,
		}).then(
			(response) => {
				response.json().then((data) => {
					$scope.accessToken = data.access_token;
					$scope.patient = data.patient;
					$scope.accessTokenJson = JSON.stringify(data, undefined, 2);
					sessionStorage.setItem("accessToken", $scope.accessToken);
					sessionStorage.setItem("patient", data.patient);
          console.log('accessToken', data);

					loadFhirData($scope, $http);
				});
			},
			(error) => {
				console.log(
					"Error exchanging access token: " +
						error.status +
						" - " +
						error.statusText
				);
			}
		);
	}

	static loadFhirData($scope, $http) {
		loadFhirData($scope, $http);
	}
}

function resetProgress($scope) {
	$scope.progress = 0;
	$scope.progressError = 0;
	$("#progressWrap").prop("hidden", true);
	$("#progressBar").attr("style", "width: " + 0 + "%;");
	$("#progressBar").attr("aria-valuenow", 0);
	$("#progressBar").html("");
	$("#progressBarError").attr("style", "width: " + 0 + "%;");
	$("#progressBarError").attr("aria-valuenow", 0);
	$("#progressBarError").html("");
}

function updateProgress($scope, isError) {
	let progress;
	$("#progressWrap").prop("hidden", false);
	if (isError) {
		$scope.progressError++;
		progress = Math.round(
			(100 * $scope.progressError) / $scope.rsrTypeList.length
		);
		$("#progressBarError").attr("style", "width: " + progress + "%;");
		$("#progressBarError").attr("aria-valuenow", progress);
		//$('#progressBarError').html(progress + '%');
	} else {
		$scope.progress++;
		progress = Math.round((100 * $scope.progress) / $scope.rsrTypeList.length);
		$("#progressBar").attr("style", "width: " + progress + "%;");
		$("#progressBar").attr("aria-valuenow", progress);
		//$('#progressBar').html(progress + '%');
	}

	if ($scope.progress + $scope.progressError >= $scope.rsrTypeList.length) {
		$scope.progress = 0;
		$scope.progressError = 0;
		window.setTimeout(() => {
			$("#progressBar").html('<i class="fas fa-check"></i>');
			$scope.$apply();
		}, 500);
		window.setTimeout(() => {
			resetProgress($scope);
		}, 2500);
		console.log("load completed: ", $scope.fhirRsrList);
	}
}

// Load patient demographic, and conformance first
async function loadFhirData($scope, $http) {
	// Clear existing data if any
	$scope.fhirRsrList = [];
	$scope.rawFhirRsrList = [];
	$scope.progress = 0;
	$scope.progressError = 0;

	await getFhirResource({ name: "Conformance" }, $scope, $http);

	$scope.rsrTypeList.forEach(async (type) => {
		console.log("loading ... ", type.name);
		await getFhirResource(type, $scope, $http);
	});
}

// Retrive patient data
async function getFhirResource(resource, $scope, $http) {
	let url = $scope.fhirConfig.endpointUrl;
	const type = resource.displayOverride
		? resource.displayOverride
		: resource.name;

	// Conformance
	if (resource.name === "Conformance") {
		//getResource(resource, metadataUrl);
		url = $scope.fhirConfig.metaUrl;
	}

	// Resources w/o qualifier
	else if (resource.name === "Patient") {
		url = url + resource.name + "/" + $scope.patient;
	}

	// Resources with qualifier
	else if (resource.queryFilter) {
		url =
			url +			
			resource.name +
			"?patient=" +
			$scope.patient +
			"&" +
			resource.queryFilter;
	}

	// patient Demographics
	else {
		url = url + resource.name + "?patient=" + $scope.patient;
	}

	$http.defaults.headers.common["Authorization"] =
		"Bearer " + $scope.accessToken;

	try {
		// const response = await $http({
		//   method: 'GET',
		//   url: url,
		// });

		//fetch;
		const response = await fetch(url, {
			headers: {
				Authorization: "Bearer " + $scope.accessToken,
				Accept: "application/json, text/plain, */*",
			},
		});

		var json;
		if (response.ok) {
			json = await response.json();
		}

		const substance = json; //response.data; //.entry[0];
		const jsonString = JSON.stringify(substance, undefined, 2);
		console.log(`done loading ${resource.name}`);

		$scope.rawFhirRsrList.push({
			type: type,
			json: jsonString,
			full: substance,
		});

		$("#data" + type).html(jsonString);

		let entityCount = 1;
		if (substance["resourceType"] === "Bundle") {
			entityCount = substance.total;
		} else {
			entityCount = 1;
		}
		$("#cnt" + type).html(entityCount);
		$("#cnt" + type).addClass("bg-warning");
		$("#cnt2" + type).html(entityCount);
		$("#cnt2" + type).addClass("bg-success");
		$("#cnt2" + type).addClass("text-light");
		$("#cnt2" + type).removeClass("bg-warning");
		$("#" + type).html(jsonString);

		// dont update progress yet for the Confromance call because rsrTypeList not available
		if ($scope.rsrTypeList && type !== "Conformance") {
			updateProgress($scope);
		}

		extractFhirData(resource, substance, $scope);
	} catch (error) {
		console.log("Error loading ", resource.name, ": ", error);
		$("#cnt2" + resource.name).html("Error");
		$("#cnt2" + resource.name).addClass("bg-danger");
		$("#cnt2" + resource.name).removeClass("bg-warning");
		$("#" + resource.name).html(error.status + " " + error.statusText);

		updateProgress($scope, 1);
	}
}

function extractFhirData(resource, data, $scope) {
	if (resource.name === "Conformance") {
		$scope.rsrTypeList = FhirResource.extractResourceTypes(data);
	} else if (resource.name === "Patient") {
		let oneResource = FhirResource.createResource(data);
		$scope.fhirRsrList.push(oneResource);
	} else {
		data.entry.forEach((aJson) => {
			let oneResource = FhirResource.createResource(
				aJson,
				resource.displayOverride
			);
			$scope.fhirRsrList.push(oneResource);
		});
	}

	$scope.$apply();
	return;
}
