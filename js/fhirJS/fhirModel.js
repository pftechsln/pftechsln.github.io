import { FhirView } from './fhirView.js';

// Private utility function
function _extractField(arrayInput, field) {
  if (typeof arrayInput == 'undefined') return [];
  if (arrayInput.length === 0) return [];
  if (field == null || field === '') return [];

  let result = new Array(arrayInput.length);
  for (let i = 0; i < arrayInput.length; i++) {
    result[i] = arrayInput[i][field];
  }

  return result;
}

class FhirResource {
  constructor(fullJson, displayOverride) {
    var resource;

    if (typeof fullJson.resource != 'undefined') {
      this.fullUrl =
        typeof fullJson.link != 'undefined'
          ? fullJson.link[0].url
          : fullJson.fullUrl;
      resource = fullJson.resource;
    } else {
      this.fullUrl = '';
      resource = fullJson;
    }

    this.resourceType = displayOverride
      ? displayOverride
      : resource.resourceType;
    this.id = resource.id;
    this.status = resource.status;
    this.date = resource.date;
    this.fullJson = resource;
    this.display = FhirView.getRsrSetting(this.resourceType);
  }

  // Extract all available resource type queries from Conformance
  static extractResourceTypes(comformanceJson) {
    let rsrTypeList = []; //Resource type list to return

    // Always retrie Patient Demographics first, assuming it's always available in Conformance
    let displaySettings = FhirView.getRsrSetting('Patient');
    rsrTypeList.push({
      name: 'Patient',
      displayOverride: 'Patient',
      display: displaySettings,
    });

    for (var i = 0; i < comformanceJson.rest[0].resource.length; i++) {
      let type = comformanceJson.rest[0].resource[i].type;

      let searchParam = comformanceJson.rest[0].resource[i].searchParam;
      let patientSearch = false;

      // Only keep resource types that can be searched by patient ID
      // Check if any search method contains "patient" as parameter
      if (searchParam != null) {
        searchParam.forEach((search) => {
          if (search.name == 'patient') {
            patientSearch = true;
          }
        });

        // Supports patient search, push this resource type into the return list
        // For 'Observation', add to the list 3 times with different category
        if (patientSearch) {
          if (type === 'Observation') {
            displaySettings = FhirView.getRsrSetting('Observation-laboratory');
            rsrTypeList.push({
              name: 'Observation',
              queryFilter: 'category=laboratory',
              displayOverride: 'Observation-laboratory',
              display: displaySettings,
            });

            displaySettings = FhirView.getRsrSetting(
              'Observation-social-history'
            );
            rsrTypeList.push({
              name: 'Observation',
              queryFilter: 'category=social-history',
              displayOverride: 'Observation-social-history',
              display: displaySettings,
            });

            displaySettings = FhirView.getRsrSetting('Observation-vital-signs');
            rsrTypeList.push({
              name: 'Observation',
              queryFilter: 'category=vital-signs',
              displayOverride: 'Observation-vital-signs',
              display: displaySettings,
            });
          } else {
            displaySettings = FhirView.getRsrSetting(type);
            rsrTypeList.push({
              name: type,
              displayOverride: type,
              display: displaySettings,
            });
          }
        }
      }
    }
    return rsrTypeList;
  }

  // create an resource object from a json object
  // either a serach entry  or a resource object
  // search entry = resource + fullUrl
  static createResource(fullJson, displayOverride) {
    var resource;
    if (typeof fullJson.resource != 'undefined') {
      resource = fullJson.resource;
      // the entry is not a search match, do not try to create a resource object
      if (fullJson.search.mode !== 'match') return null;
    } else {
      resource = fullJson;
    }

    let type = displayOverride ? displayOverride : resource.resourceType;
    switch (type) {
      case 'Patient':
        return new FhirDemographics(fullJson);

      case 'AllergyIntolerance':
        return new FhirAllergy(fullJson);

      case 'CarePlan':
        return new FhirCarePlan(fullJson);

      case 'Condition':
        return new FhirCondition(fullJson);

      case 'Device':
        return new FhirDevice(fullJson);

      case 'DiagnosticReport':
        return new FhirDiagnosticReport(fullJson);

      case 'DocumentReference':
        return new FhirDocumentReference(fullJson);

      case 'FamilyMemberHistory':
        return new FhirFamilyMemberHistory(fullJson);

      case 'Goal':
        return new FhirGoal(fullJson);

      case 'Immunization':
        return new FhirImmunization(fullJson);

      case 'MedicationOrder':
        return new FhirMedicationOrder(fullJson);

      case 'MedicationStatement':
        return new FhirMedicationStatement(fullJson);

      case 'Observation-laboratory':
        return new FhirLabResult(fullJson, displayOverride);

      case 'Observation-vital-signs':
        return new FhirVital(fullJson, displayOverride);

      case 'Observation-social-history':
        return new FhirSocialHistory(fullJson, displayOverride);

      case 'Procedure':
        return new FhirProcedure(fullJson);

      default:
        return new FhirResource(fullJson, displayOverride);
    }
  }
}

/* ============== Demographics ===============
{
  "resourceType": "Patient",
  "birthDate": "1985-08-01",
  "active": true,
  "gender": "male",
  "deceasedBoolean": false,
  "id": "Tbt3KuCY0B5PSrJvCu2j-PlK.aiHsu2xUjUM8bWpetXoB",
  "name": [
    {
      "text": "Jason Argonaut",
    }
  ],
  "address": [
    {
      "use": "home",
      "line": [ "1979 Milky Way Dr." ],
      "city": "Verona",
      "state": "WI",
      "postalCode": "53593",
      "country": "US"
    },
    {
      "use": "temp",
      "line": [ "5301 Tokay Blvd" ],
      "city": "MADISON",
      "state": "WI",
      "postalCode": "53711",
      "country": "US",
      "period": {
        "start": "2011-08-04T00:00:00Z",
        "end": "2014-08-04T00:00:00Z"
      }
    }
  ],
  "telecom": [
    {
      "system": "phone",
      "value": "608-271-9000",
      "use": "home"
    },
    {
      "system": "phone",
      "value": "608-771-9000",
      "use": "work"
    },
    {
      "system": "phone",
      "value": "608-771-9000",
      "use": "mobile"
    },
    {
      "system": "fax",
      "value": "608-771-9000",
      "use": "home"
    },
    {
      "system": "phone",
      "value": "608-771-9000",
      "use": "temp",
      "period": {
        "start": "2011-08-04T00:00:00Z",
        "end": "2014-08-04T00:00:00Z"
      }
    },
    {
      "system": "email",
      "value": "open@epic.com"
    }
  ],
  "maritalStatus": {
    "text": "Single",
  },
  "communication": [
    {
      "preferred": true,
      "language": {
        "text": "English",
        "coding": [
          {
            "system": "urn:oid:2.16.840.1.113883.6.99",
            "code": "en",
            "display": "English"
          }
        ]
      }
    }
  ],
  "extension": [
    {
      "valueCodeableConcept": {
        "text": "Asian",
      }
    },
    {
      "valueCodeableConcept": {
        "text": "Not Hispanic or Latino",
      }
    },
    {
      "url": "http://hl7.org/fhir/StructureDefinition/us-core-birth-sex",
      "valueCodeableConcept": {
        "text": "Male",
      }
  ]
}
*/
class FhirDemographics extends FhirResource {
  constructor(fullJson) {
    super(fullJson);

    try {
      let resource = fullJson;

      this.name =
        typeof resource.name != 'undefined' ? resource.name[0].text : '';
      this.date = resource.birthDate;

      this.displayFields = {
        Name: this.name,
        'Date of Birth': this.date,
        Gender: resource.gender,
        'Marital Status': resource.maritalStatus.text,
      };
    } catch (error) {
      console.log('Error loading resource: ', error);
    }
  }
}

/* ============== AllergyIntolerance ===================
{
  "fullUrl": "https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/AllergyIntolerance/TBwnNbrAqC0Qw5Ha7AFT-2AB",
  "resourceType": "AllergyIntolerance",
  "recordedDate": "2015-08-24T23:11:36Z",
  "status": "confirmed",
  "criticality": "CRITL",
  "id": "TBwnNbrAqC0Qw5Ha7AFT-2AB",
  "onset": "2012-11-07T00:00:00Z",
  "substance": {
    "text": "PENICILLIN G",
  },
  "reaction": [
  {
    "certainty": "confirmed",
    "onset": "2012-11-07T00:00:00Z",
    "manifestation": [ { "text": "Hives" } ],
    "note": { "text": "Severity low enough to be prescribed if needed." }
  }
  "note": { "text": "Severity low enough to be prescribed if needed." }
  ],
} */

function _getReactionText(reactionJson) {
  let reactionText = '';

  if (typeof reactionJson != 'undefined') {
    reactionJson.forEach((r) => {
      if (typeof r.manifestation != 'undefined') {
        r.manifestation.forEach((m) => {
          reactionText += m.text + ', ';
        });
      }
    });
  }

  return reactionText;
}

class FhirAllergy extends FhirResource {
  constructor(fullJson) {
    super(fullJson);

    try {
      let resource =
        typeof fullJson.resource != 'undefined' ? fullJson.resource : fullJson;

      this.name =
        typeof resource.substance != 'undefined' ? resource.substance.text : '';
      this.date = resource.onset.split('T')[0];

      this.displayFields = {
        Substance: this.name,
        'Recorded Date': resource.recordedDate.split('T')[0],
        'Onset Date': this.date,
        Criticality: resource.criticality,
        Reactions: _getReactionText(resource.reaction),
        Note: typeof resource.note != 'undefined' ? resource.note.text : '',
      };
    } catch (error) {
      console.log('Error loading resource: ', error);
    }
  }
}

/* =========================== Care Plan =========================*/
class FhirCarePlan extends FhirResource {
  constructor(fullJson) {
    super(fullJson);

    try {
      let resource =
        typeof fullJson.resource != 'undefined' ? fullJson.resource : fullJson;

      let goals = _extractField(resource.goal, 'display');
      let addresses = _extractField(resource.addresses, 'display');
      let activities = _extractField(
        _extractField(_extractField(resource.activity, 'detail'), 'code'),
        'text'
      );

      this.name = goals[0] + ' ...';
      this.displayFields = {
        Status: resource.status,
        Goal: goals.join('; '),
        Addresses: addresses.join('; '),
        Activity: activities.join('; '),
      };
    } catch (error) {
      console.log('Error loading resource: ', error);
    }
  }
}

/* ============ Condition ================*/
class FhirCondition extends FhirResource {
  constructor(fullJson) {
    super(fullJson);

    try {
      let resource =
        typeof fullJson.resource != 'undefined' ? fullJson.resource : fullJson;

      this.name = resource.code.text;
      this.date =
        typeof resource.onsetDateTime != 'undefined'
          ? resource.onsetDateTime.split('T')[0]
          : '';
      this.status = resource.clinicalStatus;

      this.displayFields = {
        Condition: this.name,
        'Clinical Status': resource.clinicalStatus,
        'Verification Status': resource.verificationStatus,
        'Onset Date': this.date,
        Category: resource.category.text,
        Serverity:
          typeof resource.severity != 'undefined' ? resource.severity.text : '',
      };
    } catch (error) {
      console.log('Error loading resource: ', error);
    }
  }
}

/* ========== Diagnostic Report ======
"resource": {
        "resourceType": "DiagnosticReport",
        "status": "final",
        "effectiveDateTime": "2016-11-22T23:33:00Z",
        "issued": "2016-11-23T00:03:00Z",
        "id": "TFz-mI8GMsQRlcNJDzKBiRwB",
        "category" : {
          "text": "Lab"
        },
        "code": {
          "text": "BUN"
        },
        "result": [
          {
            "display": "Component: BUN / CREAT RATIO",
            "reference": ....
          }
        ]
      }
      */
class FhirDiagnosticReport extends FhirResource {
  constructor(fullJson) {
    super(fullJson);

    try {
      let resource =
        typeof fullJson.resource != 'undefined' ? fullJson.resource : fullJson;

      this.name = resource.code.text;
      this.date = resource.effectiveDateTime.split('T')[0];

      this.displayFields = {
        Code: this.name,
        Status: resource.status,
        'Effective Date': this.date,
        'Issued Date': resource.issued ? resource.issued.split('T')[0] : '',
        Category:
          typeof resource.category != 'undefined' ? resource.category.text : '',
        Results:
          typeof resource.result != 'undefined'
            ? resource.result[0].display
            : '', //Todo: it's array with URL link
        Conclusion: resource.conclusion,
      };
    } catch (error) {
      console.log('Error loading resource: ', error);
    }
  }
}

/* ================== Document Reference =======================*/
class FhirDocumentReference extends FhirResource {
  constructor(fullJson) {
    super(fullJson);

    try {
      let resource =
        typeof fullJson.resource != 'undefined' ? fullJson.resource : fullJson;

      this.name =
        typeof resource.class != 'undefined' ? resource.class.text : '';
      this.date =
        typeof resource.created != 'undefined'
          ? resource.created.split('T')[0]
          : '';

      this.displayFields = {
        Class: this.name,
        Type: typeof resource.type != 'undefined' ? resource.type.text : '',
        'Created on': this.date,
        //'Indexed on': resource.indexed.split('T')[0],
        //Attachment: resource.content[0].attachment[0].url,
      };
    } catch (error) {
      console.log('Error loading resource: ', error);
    }
  }
}

/* ============== Device ===============*/
class FhirDevice extends FhirResource {
  constructor(fullJson) {
    super(fullJson);

    try {
      let resource =
        typeof fullJson.resource != 'undefined' ? fullJson.resource : fullJson;

      this.name = resource.type.text;
      this.date = resource.expiry.split('T')[0];

      this.displayFields = {
        'Device Type': this.name,
        Model: resource.model,
        Status: this.status,
        'Expiry Date': this.date,
        UDI: resource.udi,
      };
    } catch (error) {
      console.log('Error loading resource: ', error);
    }
  }
}

/* ============== Family Member History =================*/
class FhirFamilyMemberHistory extends FhirResource {
  constructor(fullJson) {
    super(fullJson);

    try {
      let resource =
        typeof fullJson.resource != 'undefined' ? fullJson.resource : fullJson;

      this.name = resource.name;

      this.displayFields = {
        Name: this.name,
        Relationship: resource.relationship.text,
        Deceased: resource.deseasedBoolean ? 'Yes' : 'No',
        Condition: _extractField(
          _extractField(resource.condition, 'code'),
          'text'
        ).join('; '),
      };
    } catch (error) {
      console.log('Error loading resource: ', error);
    }
  }
}

/* ================ Goal ==================*/
class FhirGoal extends FhirResource {
  constructor(fullJson) {
    super(fullJson);

    try {
      let resource =
        typeof fullJson.resource != 'undefined' ? fullJson.resource : fullJson;

      this.date = resource.startDate;
      this.name = resource.description;

      this.displayFields = {
        Description: resource.description,
        'Start Date': resource.startDate,
        Category: _extractField(resource.category, 'text').join('; '),
        Addresses: _extractField(resource.addresses, 'display').join('; '),
        Note: _extractField(resource.note, 'text').join('; '),
      };
    } catch (error) {
      console.log('Error loading resource: ', error);
    }
  }
}

/* ================= Medication Order =======================*/
class FhirMedicationOrder extends FhirResource {
  constructor(fullJson) {
    super(fullJson);

    try {
      let resource =
        typeof fullJson.resource != 'undefined' ? fullJson.resource : fullJson;

      this.name = resource.medicationReference.display;
      this.date = resource.dateWritten;

      this.displayFields = {
        Medication: this.name,
        'Order Written Date': this.date,
        Status: this.status,
        Prescriber: resource.prescriber.display,
        'Dosage Instruction': _extractField(
          resource.dosageInstruction,
          'text'
        ).join('; '),
        Duration:
          typeof resource.dispenseRequest.expectedSupplyDuration != 'undefined'
            ? resource.dispenseRequest.expectedSupplyDuration.value +
              ' ' +
              resource.dispenseRequest.expectedSupplyDuration.unit
            : '',
        'Start Date':
          typeof resource.dispenseRequest.validityPeriod.start != 'undefined'
            ? resource.dispenseRequest.validityPeriod.start.split('T')[0]
            : '',
        'End Date':
          typeof resource.dispenseRequest.validityPeriod.end != 'undefined'
            ? resource.dispenseRequest.validityPeriod.end.split('T')[0]
            : '',
      };
    } catch (error) {
      console.log('Error loading resource: ', error);
    }
  }
}

/* ================= Medication Statement ============*/

class FhirMedicationStatement extends FhirResource {
  constructor(fullJson) {
    super(fullJson);

    try {
      let resource =
        typeof fullJson.resource != 'undefined' ? fullJson.resource : fullJson;

      this.name = resource.medicationCodeableConcept.text;
      this.date = resource.dateWritten;

      this.displayFields = {
        Medication: this.name,
        Status: this.status,
        Dosage: _extractField(resource.dosage, 'text').join('; '),
        'Effective From':
          typeof resource.effectivePeriod != 'undefined'
            ? typeof resource.effectivePeriod.start != 'undefined'
              ? resource.effectivePeriod.start.split('T')[0]
              : ''
            : '',
        'Effective To':
          typeof resource.effectivePeriod != 'undefined'
            ? typeof resource.effectivePeriod.end != 'undefined'
              ? resource.effectivePeriod.end.split('T')[0]
              : ''
            : '',
      };
    } catch (error) {
      console.log('Error loading resource: ', error);
    }
  }
}

/* ========= Immunization =========== 
{
  "fullUrl": "https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/Immunization/TfHwRVsICbE33tGGsW1GWvgB",
  "resource": {
    "resourceType": "Immunization",
    "status": "completed",
    "date": "2016-03-02T00:00:00Z",
    "id": "TfHwRVsICbE33tGGsW1GWvgB",
    "vaccineCode": {
      "text": "Cholera",
    },
    "site": {
      "text": "Left arm",
    },
    "route": {
      "text": "Intravenous",
    }
  }
}
*/
class FhirImmunization extends FhirResource {
  constructor(fullJson) {
    super(fullJson);

    try {
      let resource =
        typeof fullJson.resource != 'undefined' ? fullJson.resource : fullJson;
      this.name = resource.vaccineCode.text;
      this.displayFields = {
        Vaccine: this.name,
        Date: resource.date.split('T')[0],
        Site: typeof resource.site != 'undefined' ? resource.site.text : '',
        Route: typeof resource.route != 'undefined' ? resource.route.text : '',
      };
    } catch (error) {
      console.log('Error loading resource: ', error);
    }
  }
}

/* ------- Observation: Lab Results ------
"resource": {
  "resourceType": "Observation",
  "effectiveDateTime": "2016-02-06T18:00:00Z",
  "status": "final",
  "id": "Tl4xxjAMDmAdEfs3nmEjOkn4SDbIJTt2EA469hjA7BC0B",
  code": {
          "text": "ALANINE AMINOTRANSFERASE (SGPT) [U/L] IN SER/PLAS",
  }
  "valueQuantity": {
    "value": 14.0,
    "unit": "U/L",
  },
  "referenceRange": [
    {
      "text": "10 - 40 U/L",
    }
  ],
  } */
class FhirLabResult extends FhirResource {
  constructor(fullJson, displayOverride) {
    super(fullJson, displayOverride);

    try {
      let resource =
        typeof fullJson.resource != 'undefined' ? fullJson.resource : fullJson;

      this.name = resource.code.text;
      this.date = resource.effectiveDateTime.split('T')[0];

      this.displayFields = {
        Code: this.name,
        Date: this.date,
        Status: this.status,
        Value:
          typeof resource.valueQuantity != 'undefined'
            ? resource.valueQuantity.value + ' ' + resource.valueQuantity.unit
            : '',
        'Reference Range':
          typeof resource.referenceRange != 'undefined'
            ? resource.referenceRange.text
            : '',
      };
    } catch (error) {
      console.log('Error loading resource: ', error);
    }
  }
}

/* ======== Observation : Vital Sign ==============
"resource": {
        "resourceType": "Observation",
        "effectiveDateTime": "2016-12-22T22:37:00Z",
        "status": "final",
        "id": "Tnf7t0.SP6znu2Dc1kPsrosyG3KPzDXf3pviWMZpcO4DPGcsBC3iLs7mFdogU5vkgB",
        "code": {
          "text": "BP",
        },
        "component": [
          {
            "code": {
              "text": "Systolic blood pressure",
            },
            "valueQuantity": {
              "value": 120,
              "unit": "mm[Hg]",
        \    }
          },
          {
            "code": {
              "text": "Diastolic blood pressure",
         \   },
            "valueQuantity": {
              "value": 80,
              "unit": "mm[Hg]",
            }
          }
        ]
      }  
      */
class FhirVital extends FhirResource {
  constructor(fullJson, displayOverride) {
    super(fullJson, displayOverride);

    try {
      let resource =
        typeof fullJson.resource != 'undefined' ? fullJson.resource : fullJson;

      this.name = resource.code.text;
      this.date = resource.effectiveDateTime.split('T')[0];

      this.displayFields = {
        Code: this.name,
        Date: this.date,
        Status: this.status,
        //'ID & Direct Link': `<a href='${this.fullUrl}' target='_blank'>${this.id}</a>`,
      };

      if (typeof resource.component != 'undefined') {
        for (let i = 0; i < resource.component.length; i++) {
          //this.displayFields['Component ' + (i + 1)] =
          //  resource.component[i].code.text +
          //  ': ' +
          this.displayFields[resource.component[i].code.text] =
            resource.component[i].valueQuantity.value +
            ' ' +
            resource.component[i].valueQuantity.unit;
        }
      } else {
        this.displayFields['Value'] =
          resource.valueQuantity.value + ' ' + resource.valueQuantity.unit;
      }
    } catch (error) {
      console.log('Error loading resource: ', error);
    }
  }
}

/* =============== Observationi - social history ================*/
class FhirSocialHistory extends FhirResource {
  constructor(fullJson, displayOverride) {
    super(fullJson, displayOverride);

    try {
      let resource =
        typeof fullJson.resource != 'undefined' ? fullJson.resource : fullJson;

      this.name = resource.code.text;
      this.date = resource.issued.split('T')[0];

      this.displayFields = {
        Code: this.name,
        Value: resource.valueCodeableConcept.text,
        'Issued Date': this.date,
        Status: this.status,
      };
    } catch (error) {
      console.log('Error loading resource: ', error);
    }
  }
}

/* =================== Procedure =============*/
class FhirProcedure extends FhirResource {
  constructor(fullJson) {
    super(fullJson);

    try {
      let resource =
        typeof fullJson.resource != 'undefined' ? fullJson.resource : fullJson;

      this.name = resource.code.text;
      this.date = resource.performedDateTime.split('T')[0];

      this.displayFields = {
        Procedure: this.name,
        'Performed at': resource.performedDateTime,
        Status: this.status,
      };
    } catch (error) {
      console.log('Error loading resource: ', error);
    }
  }
}

class FhirPatient {
  constructor() {
    this.demographics = null;
    this.allergies = [];
    this.carePlans = [];
    this.medicationOrders = [];
    this.medicationStatements = [];
    this.immunizations = [];
    this.labResults = [];
    this.vitals = [];
    this.conditions = [];
    this.diagnosticReports = [];
    this.documentReferences = [];
    this.goals = [];
    this.procedures = [];
    this.otherResources = [];
  }
}

export { FhirResource, FhirPatient };
