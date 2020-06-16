var _displaySettings = [
  { name: 'Conformance', displayName: 'Conformance', icon: '', color: '' },

  {
    name: 'Patient',
    displayName: 'Demographics',
    icon: 'fa-id-card',
    color: '',
  },
  {
    name: 'AllergyIntolerance',
    displayName: 'Allergy',
    icon: 'fa-allergies',
    color: '',
  },
  {
    name: 'CarePlan',
    displayName: 'Care Plan',
    icon: 'fa-file-medical',
    color: '',
  },
  {
    name: 'Condition',
    displayName: 'Condition',
    icon: 'fa-diagnoses',
    color: '',
  },
  {
    name: 'DiagnosticReport',
    displayName: 'Diagnostic Report',
    icon: 'fa-stethoscope',
    color: '',
  },
  {
    name: 'DocumentReference',
    displayName: 'Document',
    icon: 'fa-poll-h',
    color: '',
  },
  { name: 'Goal', displayName: 'Goal', icon: 'fa-bullseye', color: '' },
  {
    name: 'Immunization',
    displayName: 'Immunization',
    icon: 'fa-syringe',
    color: '',
  },

  {
    name: 'MedicationOrder',
    displayName: 'Medication Order',
    icon: 'fa-pills',
    color: '',
  },
  {
    name: 'MedicationStatement',
    displayName: 'Medication Statement',
    icon: 'fa-pills',
    color: '',
  },
  {
    name: 'Observation-laboratory',
    displayName: 'Lab Result',
    icon: 'fa-flask',
    color: '',
  },
  {
    name: 'Observation-social-history',
    displayName: 'Social History',
    icon: 'fa-history',
    color: '',
  },
  {
    name: 'Observation-vital-signs',
    displayName: 'Vital Signs',
    icon: 'fa-heartbeat',
    color: '',
  },
  {
    name: 'Procedure',
    displayName: 'Procedure',
    icon: 'fa-procedures',
    color: '',
  },
  {
    name: 'FamilyMemberHistory',
    displayName: 'Family Member History',
    icon: 'fa-users',
    color: '',
  },
  {
    name: 'Device',
    displayName: 'Device',
    icon: 'fa-mobile-alt',
    color: '',
  },
];

class FhirView {
  constructor() {}

  static getRsrSetting(rsrName) {
    var setting = null;

    _displaySettings.forEach((rsr) => {
      if (rsr.name === rsrName) {
        setting = rsr;
      }
    });

    if (setting === null) {
      setting = {
        name: 'Default',
        displayName: '',
        icon: 'fa-file-medical-alt',
        color: '',
      };
    }
    return setting;
  }
}

export { FhirView };
