// Constants: FHIR Client for Health Organization on Epic
export const productionClient = {
  name: "PatientFHIR",
  //clientId: "c45f46c7-66cb-4ac5-b8d0-d66f5260e419",
  clientId: "6c3586a3-a669-4944-aab1-ad5234348f56",
  //clientId: "dc2af51b-edd4-4278-b5e8-3a64fa68ef45",
  redirectUri: "https://pftechsln.github.io/fhirData.html",
  scope: "*",
  appName: "Health on Fhir",
};

// Constants: Epic Client for the Epic Sandbox
export const sandboxClient = {
  name: "Epic Client",
  //clientId: "6c12dff4-24e7-4475-a742-b08972c4ea27",
  //clientId: "682f041d-5ed1-4d1b-a8c4-08653678e7ca",
  clientId: "4df31887-2fc7-45ba-95cf-668f3cd4d20b",
  redirectUri: "https://pftechsln.github.io/fhirData.html",
  scope: "*",
  appName: "Health on Fhir",
};

// Constants: Epic Client for the Epic Sandbox
export const sandboxClientR4 = {
  name: "Epic Client R4",
  //clientId: "6c12dff4-24e7-4475-a742-b08972c4ea27",
  //clientId: "4df31887-2fc7-45ba-95cf-668f3cd4d20b",
  clientId: "47d7ece3-d14c-46d4-978c-312e7e52b225", // non-prod id
  //clientId: "682f041d-5ed1-4d1b-a8c4-08653678e7ca",
  redirectUri: "https://pftechsln.github.io/fhirData.html",
  scope: "*",
  appName: "Health on Fhir R4",
};

// Constants: Epic Client for the Epic Sandbox
export const productionClientR4 = {
  name: "Epic Client R4",
  clientId: "3977981c-e8d8-435f-9eed-5c381b26f963", // prod id
  redirectUri: "https://pftechsln.github.io/fhirData.html",
  scope: "*",
  appName: "Health on Fhir R4",
};

// Constants: MI Client
export const miFhirClient = {
  name: "MI FHIR App",
  clientId: "2a65a1m9hg4f34q6fqfh2o91ij",
  redirectUri: "https://pftechsln.github.io/fhirData.html",
  oauthUri: "https://pvdev-auth.auth.us-west-2.amazoncognito.com/login",
  tokenUri: "https://pvdev-auth.auth.us-west-2.amazoncognito.com/oauth2/token",
  scope: "*",
  appName: "MI FHIR App",
};
