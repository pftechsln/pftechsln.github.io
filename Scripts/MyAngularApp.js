
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

// Constants: Testing Client
var defaultClient = {
    name: 'PatientFHIR',
    //clientId: "c45f46c7-66cb-4ac5-b8d0-d66f5260e419",
    //clientId: "6c3586a3-a669-4944-aab1-a",   
    clientId: "6c3586a3-a669-4944-aab1-ad5234348f56",
    redirectUri: "https://pftechsln.github.io/",
}

// Constants: Epic Client
var epicClient = {
    name: 'Epic Client',
    //clientId: "6c12dff4-24e7-4475-a742-b08972c4ea27",
    clientId: "682f041d-5ed1-4d1b-a8c4-08653678e7ca",
    redirectUri: "https://pftechsln.github.io/",
}

// Constants : FHIR Organization URLs (will read from a file or
var strUrl = '{ "Entries": [{ "OrganizationName": "Overlake Medical Center (Internal)", "FHIRPatientFacingURI": "https://epicic.ohmc.org/Interconnect-FHIR/api/FHIR/DSTU2/"}, { "OrganizationName": "Overlake Medical Center (External)", "FHIRPatientFacingURI": "https://sfd.overlakehospital.org/FHIRproxy/api/FHIR/DSTU2/"}, { "OrganizationName": "Epic Sandbox", "FHIRPatientFacingURI": "https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/"}, { "OrganizationName": "Altru Health System", "FHIRPatientFacingURI": "https://epicsoap.altru.org/fhir/api/FHIR/DSTU2/" }, { "OrganizationName": "Bellin Health", "FHIRPatientFacingURI": "https://arr.thedacare.org/BLN/FHIR/api/FHIR/DSTU2/" }, { "OrganizationName": "Carle Foundation Hospital \u0026 Physician Group", "FHIRPatientFacingURI": "https://epicsoap.carle.com/FHIR/api/FHIR/DSTU2/" }, { "OrganizationName": "Cedars-Sinai Health System", "FHIRPatientFacingURI": "https://cslinkmobile.csmc.edu/fhirproxy/api/FHIR/DSTU2/" }, { "OrganizationName": "Hattiesburg Clinic and Forrest General Hospital", "FHIRPatientFacingURI": "https://soapprod.hattiesburgclinic.com/FHIR/api/FHIR/DSTU2/" }, { "OrganizationName": "Hospital for Special Surgery", "FHIRPatientFacingURI": "https://epicproxy.et0927.epichosted.com/FHIRProxy/api/FHIR/DSTU2/" }, { "OrganizationName": "Martin Health System", "FHIRPatientFacingURI": "https://prodrx919.martinhealth.org/FHIR-PRD/api/FHIR/DSTU2/" }, { "OrganizationName": "Nebraska Medicine", "FHIRPatientFacingURI": "https://ocsoapprd.nebraskamed.com/FHIR-PRD/api/FHIR/DSTU2/" }, { "OrganizationName": "Norton Healthcare", "FHIRPatientFacingURI": "https://epicsoap.nortonhealthcare.org/FHIRPRD/api/FHIR/DSTU2/" }, { "OrganizationName": "Ochsner Health System", "FHIRPatientFacingURI": "https://myc.ochsner.org/FHIR/api/FHIR/DSTU2/" }, { "OrganizationName": "Sansum Clinic", "FHIRPatientFacingURI": "https://wavesurescripts.sansumclinic.org/FHIR/api/FHIR/DSTU2/" }, { "OrganizationName": "SSM Health", "FHIRPatientFacingURI": "https://fhir.ssmhc.com/fhir/api/FHIR/DSTU2/" }, { "OrganizationName": "SSM Health WI Dean Medical Group and Affiliates", "FHIRPatientFacingURI": "https://deanrx.deancare.com/fhir/api/FHIR/DSTU2/" }, { "OrganizationName": "Texas Children\u0027s Hospital", "FHIRPatientFacingURI": "https://mobileapps.texaschildrens.org/FHIR/api/FHIR/DSTU2/" }, { "OrganizationName": "ThedaCare", "FHIRPatientFacingURI": "https://arr.thedacare.org/TC/FHIR/api/FHIR/DSTU2/" }, { "OrganizationName": "UF Health", "FHIRPatientFacingURI": "https://epicsoap.shands.ufl.edu/FHIR/api/FHIR/DSTU2/" }, { "OrganizationName": "UW Health And Affiliates - Wisconsin", "FHIRPatientFacingURI": "https://epicproxy.hosp.wisc.edu/FhirProxy/api/FHIR/DSTU2/" }, { "OrganizationName": "Weill Cornell Medicine", "FHIRPatientFacingURI": "https://epicmobile.med.cornell.edu/FHIR/api/FHIR/DSTU2/" }] }';
var listOrgs = JSON.parse(strUrl);    


function getOrgList($scope, $http) {

    //$.getJSON("https://api.github.com/users/jeresig?callback=?", function (json) {
    //    console.log(json);
    //});

    //$.getJSON("https://open.epic.com/MyApps/EndpointsJson?jsoncallback=?", function (json) {
    //    $scope.fhirOrgs = json.Entries;
    //}
        
    //);

}


function launch($scope, $http) {


    loadFhirOrg($scope, $http);
    //getOrgList($scope, $http);

    if (window.location.search.length > 3) {
        var code = window.location.search.substring(1).split('=');

        // Redirected from OAuth login with authorization code
        if (code[0] == "code") {
            oauthCode = code[1];
            $scope.oauthCode = oauthCode;

            // Retrieve the session state/settings of FHIR
            //testCase(sessionStorage.getItem('testCase'), $scope);
            loadFhirSettings($scope);

            // Exchange authorization code for access token
            getAccessToken($scope, $http);

        }

    }

    //// to be remvoed. for testing
    //var patient = {
    //    "Name": "Jason Argonaut",
    //    "FHIR ID": "Tbt3KuCY0B5PSrJvCu2j-PlK.aiHsu2xUjUM8bWpetXoB",
    //    "Gender": "male",
    //    "Date of Birth": "1985-08-01",
    //    "Address": "1979 Milky Way Dr.&nbspVerona, WI 53593, US",
    //    "Home Phone": "608-271-9000",
    //    "Work Phone": "608-332-9000",
    //    "Mobile Phone": "608-332-2881",
    //    "Email": "open@epic.com"
    //}
    //$scope.patient = patient;

    //var allergies = [
    //{
    //    "Substance": "PENICILLIN G",
    //    "Status": "confirmed",
    //    "Recorded Date": "2015-08-24",
    //    "Reaction": "Hives",
    //    "Note": "Severity low enough to be prescribed if needed.",
    //},
    //{
    //    "Substance": "SHELLFISH-DERIVED PRODUCTS",
    //    "Status": "confirmed",
    //    "Recorded Date": "2015-11-07",
    //    "Reaction": "Itching",
    //    "Note": "",
    //}
    //];



    //$scope.allergies = allergies;

}

function loadFhirOrg($scope, $http) {    
    $scope.fhirOrgs = listOrgs.Entries;
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
            setFhirSettings($scope, "https://sfd.overlakehospital.org/FHIRproxy/api/FHIR/DSTU2/");
            break;

        case 'ohmcInt':
        default:
            setFhirSettings($scope, "https://epicic.ohmc.org/Interconnect-FHIR/api/FHIR/DSTU2/")
            
    }
    
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

function loadFhirData($scope, $http) {

    $scope.statusText = "In progress: loading patient data from EMR server...";
    getPatData({ name: 'Patient' }, $scope, $http);
    getPatData({ name: 'AllergyIntolerance' }, $scope, $http);
    getPatData({ name: 'Immunization' }, $scope, $http);
    getPatData({ name: 'MedicationOrder' }, $scope, $http);
    getPatData({ name: 'Observation', queryFilter: 'category=laboratory', displayOverride: 'Observation-laboratory', }, $scope, $http);


    $('#emrLogin').addClass('collapse');
    $('#emrData').removeClass('collapse');
    $('#btnLogin').removeClass('hidden');
    //$scope.statusText = "";

}

// Retrive patient data
function getPatData(resource, $scope, $http) {

    var url = $scope.fhirEndpointUrl;
    if (resource.name === "Conformance") {
        //getResource(resource, metadataUrl);
    }
    else if (resource.name === "Patient") {
        //getResource(resource, endpointUrl + resource.name + '/' + patientID, accessToken);
        url = url + "/" + resource.name + "/" + $scope.patient;
    }
    else if (resource.queryFilter) {
        //getResource(resource, endpointUrl + resource.name + '?patient=' + patientID + '&' + resource.queryFilter, accessToken);
        url = url + "/" + resource.name + "?patient=" + $scope.patient + '&' + resource.queryFilter;
    }
    else {
        //getResource(resource, endpointUrl + resource.name + '?patient=' + patientID, accessToken);
        url = url + "/" + resource.name + "?patient=" + $scope.patient;
    }


    $http.defaults.headers.common['Authorization'] = 'Bearer ' + $scope.accessToken;
    $http({
        method: 'GET',
        url: url,
    })
        .then(
        function (response) {
            var substance = response.data //.entry[0];
            $('#data'+resource.name).html(JSON.stringify(substance, undefined, 2));

            if (substance["resourceType"] === "Bundle") {
                entityCount = substance.total;
            }
            else {
                entityCount = 1;
            }
            $('#cnt' + resource.name).html(entityCount);

            displayData(resource, substance, $scope);
        },
        function (error) {
            $('#data' + resource.name).html("Error retrieving patient data: " + error.status + " - " + error.statusText);
        }
        );
}

function displayData(resource, data, $scope) {
    if (resource.name === "Patient") {
        displayPatient(data, $scope);
    }
    else if (resource.name === "AllergyIntolerance") {
        displayAllergy(data, $scope);
    }
    else if (resource.name === "Immunization") {
        extractImmunization(data, $scope);
    }
    else if (resource.name === "MedicationOrder") {
        extractMedication(data, $scope);
    }
    //*RLI 7/24/17
    else if (resource.name === "Observation") {
        extractLab(data, $scope);
    }
    else{}
        

}

function displayPatient(data, $scope) {
    var patient = {
        "Name": "",
        "FHIR ID": "",
        "Gender": "",
        "Date of Birth": "",
        "Address": "",
        "Home Phone": "",
        "Work Phone": "",
        "Mobile Phone": "",
        "Email": ""
    }
    var address;
    var phone;
    var tmp;

    patient["Date of Birth"] = data.birthDate;
    patient["Gender"] = data.gender;
    patient["FHIR ID"] = data.id;
    patient["Name"] = data.name[0].given + " " + data.name[0].family;
        
    for (ln=0; ln < data.address.length; ln++) {
        if (data.address[ln].use === 'home'){
            address = data.address[ln].line.join(' ');
            address = address + ", " + data.address[ln].city + ", " + data.address[ln].state + " " + data.address[ln].postalCode + ", " + data.address[ln].country;
        }
    }
    patient["Address"] = address;

    for (ln = 0; ln < data.telecom.length; ln++) {
        tmp = data.telecom[ln];
        if (tmp.system === "phone") {
            if (tmp.use === "home") {
                patient["Home Phone"] = tmp.value;
            }
            else if (tmp.use === "work") {
                patient["Work Phone"] = tmp.value;
            }
            else if (tmp.use === "mobile") {
                patient["Mobile Phone"] = tmp.value;
            }
        }
        else if (tmp.system === "email") {
            patient["Email"] = tmp.value;
        }
    }

    //var jsonHtmlTable = ConvertJsonToTable(eval(data), 'jsonTable', null, 'Download')
    
    //$('#tablePatient').html(jsonHtmlTable);
    $scope.patientDemo = patient;
}

function displayAllergy(data, $scope) {

    var tmpEntry;
    var tmpStr = "";
    

    if (data.total < 1) { return; }

    var allergies = new Array(data.total);

    try {
        for (ln = 0; ln < data.total; ln++) {
            var oneAllergy = {
                "Substance": "",
                "Status": "",
                "Recorded Date": "",
                "Reaction": "",
                "Note": "",
            };
            allergies[ln] = oneAllergy;
            
            tmpEntry = data.entry[ln].resource;

            oneAllergy["Substance"] = tmpEntry.substance.text;
            oneAllergy["Status"] = tmpEntry.status;
            oneAllergy["Recorded Date"] = tmpEntry.recordedDate.split("T")[0];

            if (typeof tmpEntry["reaction"] == 'undefined') {
                oneAllergy["Reaction"] = "";
            } else {
          
            tmpStr = "";
            for (ln2 = 0; ln2 < tmpEntry.reaction.length; ln2++) {
                if (ln2 > 0) { tmpStr = tmpStr + ", " };
                tmpStr = tmpStr + tmpEntry.reaction[ln2].manifestation[0].text;
            }
            oneAllergy["Reaction"] = tmpStr;
            }

            if (typeof tmpEntry["note"] == 'undefined')
            {
                oneAllergy["Note"] = "";
            }
            else {
                oneAllergy["Note"] = tmpEntry.note.text;
            }
            //allergies[ln] = oneAllergy;
        };
    }
    catch (error) { /* ignore */ };
    
    $scope.allergies = allergies;
}


function extractImmunization(data, $scope) {

    var tmpEntry;
    var tmpStr = "";


    if (data.total < 1) { return; }

    var immunizations = new Array(data.total);

    try {
        for (ln = 0; ln < data.total; ln++) {

            tmpEntry = data.entry[ln].resource;
            if (tmpEntry.resourceType === "Immunization") {

                var oneImm = {
                    "Vaccine": "",
                    "Date": "",
                    "Site": "",
                    "Route": "",
                };
                immunizations[ln] = oneImm;

                oneImm["Vaccine"] = tmpEntry.vaccineCode.text;
                oneImm["Date"] = tmpEntry.date.split("T")[0];

                if (typeof tmpEntry["site"] == 'undefined') {
                    oneImm["Site"] = "";
                } else {
                    oneImm["Site"] = tmpEntry.site.text;
                }

                if (typeof tmpEntry["route"] == "undefined") {
                    oneImm["Route"] = "";
                } else {
                    oneImm["Route"] = tmpEntry.route.text;
                }
                
            }
        }
    }
    catch (error) {
    };

    $scope.immunizations = immunizations;
}

//*RLI 7/24/17
function extractLab(data, $scope) {

    var tmpEntry;
    var tmpStr = "";
    var unit = "";


    if (data.total < 1) { return; }

    var labs = new Array(data.total);

    try {
        for (ln = 0; ln < data.total; ln++) {

            tmpEntry = data.entry[ln].resource;
            if (tmpEntry.resourceType === "Observation") {

                var oneLab = {
                    "Test": "",
                    "Date": "",
                    "Status": "",
                    "Result Value": "",
                    "Reference Range": "",
                    "Unit": ""
                };
                labs[ln] = oneLab;

                oneLab["Test"] = tmpEntry.code.text;
                oneLab["Date"] = tmpEntry.effectiveDateTime.split("T")[0];
                oneLab["Status"] = tmpEntry.status;

                tmpStr = "";
                unit = "";
                if (typeof tmpEntry["valueQuantity"] != 'undefined') {
                    tmpStr = tmpEntry.valueQuantity.value;
                    unit = tmpEntry.valueQuantity.unit;
                } else if (typeof tmpEntry["valueRatio"] != 'undefined') {
                    tmpStr = tmpEntry.valueRatio.denominator.value + "/" + tmpEntry.valueRatio.numerator.value;
                } else { }
                oneLab["Result Value"] = tmpStr;

                tmpStr = ""
                if (typeof tmpEntry["referenceRange"] == 'undefined') {
                    tmpStr = "";
                } else {
                    tmpStr = tmpEntry.referenceRange[0].text;
                    tmpStr = tmpStr.split(unit)[0];
                }
                oneLab["Reference Range"] = tmpStr;
                oneLab["Unit"] = unit;
            }
        }
    }
    catch (error) {
        alert(error);
    };

    $scope.labs = labs;
}


function extractMedication(data, $scope) {

    var tmpEntry;
    var tmpStr = "";


    if (data.total < 1) { return; }

    var medications = new Array(data.total);

    try {
        for (ln = 0; ln < data.total; ln++) {

            tmpEntry = data.entry[ln].resource;
            if (tmpEntry.resourceType === "MedicationOrder") {

                var oneMed = {
                    "Medication": "",
                    "Date": "",
                    "Status": "",
                    "Prescriber": "",
                    "Dosage Instruction": ""
                };
                medications[ln] = oneMed;

                oneMed["Medication"] = tmpEntry.medicationReference.display;
                oneMed["Date"] = tmpEntry.dateWritten.split("T")[0];
                oneMed["Status"] = tmpEntry.status;

                if (typeof tmpEntry["prescriber"] == 'undefined') {
                    oneMed["Prescriber"] = "";
                } else {
                    oneMed["Prescriber"] = tmpEntry.prescriber.display;
                }

                if (typeof tmpEntry["dosageInstruction"] == 'undefined') {
                    oneMed["Dosage Instruction"] = "";
                } else {
                    oneMed["Dosage Instruction"] = tmpEntry.dosageInstruction[0].text;
                }

            }
        }
    }
    catch (error) {
    };

    $scope.medications = medications;
}

var app = angular.module('myApp', []);
app.controller('myCtrl', ['$scope', '$http', function ($scope, $http) {

    //$scope.accessToken = "none";
    //$scope.oauthCode = "none";

    launch($scope, $http);

    

    // Redirect browser to Fhir Authorize URL
    $scope.oauthLogin = function () {
        window.location = $scope.fhirAuthUrl;
    };

    // Quick fill in for test cases
    $scope.testCase = function (caseName) {
        testCase(caseName, $scope);
    };

    //*RLI 7/24/17
    $scope.getAccessToken = function () {
        getAccessToken($scope, $http);
    }

    // Udate settings from the Data URL
    $scope.updateSettings = function () {
        setFhirSettings($scope);
    }

    $scope.reLogin = function () {
        $('#emrLogin').removeClass('collapse');
        //$('#emrData').addClass('collapse');
        $('#btnLogin').addClass('hidden');
    }

    $scope.loadFhirData = function () {
        loadFhirData($scope, $http);
    }
}]);
