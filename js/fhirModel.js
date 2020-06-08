import { FhirView } from './fhirView.js';

class FhirResource {
  constructor(fullJson, displayOverride) {
    var resource;

    if (typeof fullJson.resource != 'undefined') {
      this.fullUrl = fullJson.fullUrl;
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
    if (displayOverride) {
      this.display = FhirView.getRsrSetting(displayOverride);
    } else {
      this.display = FhirView.getRsrSetting(this.resourceType);
    }
  }

  static createResource(fullJson, displayOverride) {
    var resource;
    if (typeof fullJson.resource != 'undefined') {
      resource = fullJson.resource;
    } else {
      resource = fullJson;
    }

    let type = displayOverride ? displayOverride : resource.resourceType;
    switch (type) {
      case 'Patient':
        return new FhirDemographics(fullJson);

      case 'AllergyIntolerance':
        return new FhirAllergy(fullJson);

      case 'DiagnosticReport':
        return new FhirDiagnosticReport(fullJson);

      case 'Immunization':
        return new FhirImmunization(fullJson);

      case 'CarePlan':
        return new FhirCarePlan(fullJson);

      case 'Observation-laboratory':
        return new FhirLabResult(fullJson, displayOverride);

      case 'Observation-vital-signs':
        return new FhirVital(fullJson, displayOverride);

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
    let resource = fullJson.resource;
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
  }
}

class FhirCarePlan extends FhirResource {}

class FhirMedicationOrder extends FhirResource {}

class FhirMedicationStatement extends FhirResource {}

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

    let resource =
      typeof fullJson.resource != 'undefined' ? fullJson.resource : fullJson;
    this.name = resource.vaccineCode.text;
    this.displayFields = {
      Vaccine: this.name,
      Date: resource.date.split('T')[0],
      Site: typeof resource.site != 'undefined' ? resource.site.text : '',
      Route: typeof resource.route != 'undefined' ? resource.route.text : '',
    };
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

    let resource =
      typeof fullJson.resource != 'undefined' ? fullJson.resource : fullJson;

    this.name = resource.code.text;
    this.date = resource.effectiveDateTime.split('T')[0];

    this.displayFields = {
      Code: this.name,
      Date: this.date,
      Status: this.status,
    };
  }
}

class FhirProcedure extends FhirResource {}

class FhirGoal extends FhirResource {}

class FhirCondition extends FhirResource {}

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
        typeof resource.result != 'undefined' ? resource.result[0].display : '', //Todo: it's array with URL link
      Conclusion: resource.conclusion,
    };
  }
}

class FhirDocumentReference extends FhirResource {}

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

export { FhirAllergy, FhirImmunization, FhirResource };
