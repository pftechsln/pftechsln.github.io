// Constants: FHIR Client for Health Organization on Epic
const defaultLiveClient = {
  name: 'PatientFHIR',
  //clientId: "c45f46c7-66cb-4ac5-b8d0-d66f5260e419",
  clientId: '6c3586a3-a669-4944-aab1-ad5234348f56',
  redirectUri: '/fhirData.html',
};

// Constants: Epic Client for the Epic Sandbox
const defaultTestClient = {
  name: 'Epic Client',
  //clientId: "6c12dff4-24e7-4475-a742-b08972c4ea27",
  clientId: '682f041d-5ed1-4d1b-a8c4-08653678e7ca',
  redirectUri: '/fhirData.html',
};

const defaultResourceTypes = [
  { name: 'Conformance' },
  { name: 'Patient' },
  { name: 'AllergyIntolerance' },
  { name: 'CarePlan' },
  { name: 'Condition' },
  { name: 'DiagnosticReport' },
  { name: 'DocumentReference' },
  { name: 'Goal' },
  { name: 'Immunization' },

  { name: 'MedicationOrder' },
  { name: 'MedicationStatement' },
  {
    name: 'Observation',
    queryFilter: 'category=laboratory',
    displayOverride: 'Observation-laboratory',
  },
  {
    name: 'Observation',
    queryFilter: 'category=social-history',
    displayOverride: 'Observation-social-history',
  },
  {
    name: 'Observation',
    queryFilter: 'category=vital-signs',
    displayOverride: 'Observation-vital-signs',
  },
  { name: 'Procedure' },
];

// Get the current base URL and use it as the redirect URL
// 12/01/18 - Added
function getBaseURL() {
  var url = window.location.href; // entire url including querystring
  var baseURL = url.substring(0, url.indexOf('/', 8)); // start after https://

  console.log(url + '-' + baseURL);
  return baseURL;
}

class SmartFhir {
  constructor() {
    const baseURL = getBaseURL();
  }

  oauthConfig(server, client, scope) {
    if (client === null) {
      if (server === null) {
        this.client = defaultLiveClient;
      } else if ((server.type = 'test')) {
        this.client = defaultTestClient;
        this.server = server;
      } else {
        this.client = defaultLiveClient;
        this.server = server;
      }
      this.client.redirectUri = baseURL + defaultLiveClient.redirectUri;
    } else {
      this.client = client;
      this.server = server;
    }
  }
}

var mySmartFhir = new SmartFhir();

//export default mySmartFhir;
