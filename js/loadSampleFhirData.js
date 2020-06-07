import { FhirView } from './fhirView.js';

export function loadSampleData($scope) {
  var fhirRsrList = [];
  var displaySetting;

  var patient = {
    Name: 'Jason Fhir',
    'FHIR ID': 'abcdefghijklmnopqrstuvwxyz0123456789',
    Gender: 'Male',
    'Date of Birth': '01/01/1988',
    Address: '1234 Main Streat, Seattle, WA 98001',
    'Home Phone': '206-234-5678',
    'Work Phone': '405-123-4567',
    'Mobile Phone': '918-987-6543',
    Email: 'jason.fhir@healthonfhir.com',
  };

  displaySetting = FhirView.getRsrSetting('Patient');
  var fhirRsr = {
    Type: 'Patient',
    Name: patient.Name,
    Resource: patient,
    SourceName: 'Sample Data',
    FhirURL: 'https://sampledata.com/demo',
    display: displaySetting,
  };

  fhirRsrList.push(fhirRsr);

  var allergies = [
    {
      Substance: 'PENICILLIN G',
      Status: 'confirmed',
      'Recorded Date': '2015-08-24',
      Reaction: 'Hives',
      Note: 'Severity low enough to be prescribed if needed.',
    },
    {
      Substance: 'SHELLFISH-DERIVED PRODUCTS',
      Status: 'confirmed',
      'Recorded Date': '2015-11-07',
      Reaction: 'Itching',
      Note: '',
    },
    {
      Substance: 'UNKONW',
      Status: 'confirmed',
      'Recorded Date': '2019-11-07',
      Reaction: 'Vomit',
      Note: "It's serious. Patient needs to be very careful about it.",
    },
  ];

  displaySetting = FhirView.getRsrSetting('AllergyIntolerance');
  fhirRsr = {
    Type: 'AllergyIntolerance',
    Name: allergies[0].Substance,
    Resource: allergies[0],
    SourceName: 'Sample Data',
    FhirURL: 'https://sampledata.com/allergy/1',
    display: displaySetting,
  };
  fhirRsrList.push(fhirRsr);
  fhirRsr = {
    Type: 'AllergyIntolerance',
    Name: allergies[1].Substance,
    Resource: allergies[1],
    SourceName: 'Sample Data',
    FhirURL: 'https://sampledata.com/allergy/2',
    display: displaySetting,
  };
  fhirRsrList.push(fhirRsr);

  var medications = [
    {
      Medication: 'Amoxillian',
      Date: '2017-10-10',
      Status: 'Active',
      Prescriber: 'Dr. Andrew Wong',
      'Dosage Instruction': 'Take 1 pill every 6 hours.',
    },
    {
      Medication: 'Advil',
      Date: '2018-10-20',
      Status: 'Active',
      Prescriber: 'Dr. Andrew Wong',
      'Dosage Instruction':
        'Take 1 pill every 4 hours. No more than 4 pills in 24 hours period.',
    },
  ];

  displaySetting = FhirView.getRsrSetting('MedicationOrder');
  fhirRsr = {
    Type: 'Medication',
    Name: medications[0].Medication,
    Resource: medications[0],
    SourceName: 'Sample Data',
    FhirURL: 'https://sampledata.com/medication/1',
    display: displaySetting,
  };
  fhirRsrList.push(fhirRsr);
  fhirRsr = {
    Type: 'Medication',
    Name: medications[1].Medication,
    Resource: medications[1],
    SourceName: 'Sample Data',
    FhirURL: 'https://sampledata.com/medication/2',
    display: displaySetting,
  };
  fhirRsrList.push(fhirRsr);

  var immunizations = [
    {
      Vaccine: 'Cholera',
      Date: '1978-10-23',
      Site: 'Right Arm',
      Route: 'Intravenous',
    },
    {
      Vaccine: 'DTP-Hib-Hep B',
      Date: '2000-01-01',
      Site: '',
      Route: '',
    },
  ];

  displaySetting = FhirView.getRsrSetting('Immunization');
  fhirRsr = {
    Type: 'Immunization',
    Name: immunizations[0].Vaccine,
    Resource: immunizations[0],
    SourceName: 'Sample Data',
    FhirURL: 'https://sampledata.com/immunization/1',
    display: displaySetting,
  };
  fhirRsrList.push(fhirRsr);
  fhirRsr = {
    Type: 'Immunization',
    Name: immunizations[1].Vaccine,
    Resource: immunizations[1],
    SourceName: 'Sample Data',
    FhirURL: 'https://sampledata.com/immunization/2',
    display: displaySetting,
  };
  fhirRsrList.push(fhirRsr);

  var labs = [
    {
      Test: 'PR INTERVAL',
      Date: '2016-11-23',
      Status: 'final',
      'Result Value': '134.0',
      'Reference Range': '100-500',
      Unit: 'ms',
    },
    {
      Test: 'ALANINE AMINOTRANSFERASE (SGPT) [U/L] IN SER/PLAS',
      Date: '2016-02-23',
      Status: 'final',
      'Result Value': '14',
      'Reference Range': '10-40',
      Unit: 'U/L',
    },
  ];

  displaySetting = FhirView.getRsrSetting('Observation-laboratory');
  fhirRsr = {
    Type: 'Observation-laboratory',
    Name: labs[0].Test,
    Resource: labs[0],
    SourceName: 'Sample Data',
    FhirURL: 'https://sampledata.com/labtest/1',
    display: displaySetting,
  };
  fhirRsrList.push(fhirRsr);
  fhirRsr = {
    Type: 'Observation-laboratory',
    Name: labs[1].Test,
    Resource: labs[1],
    SourceName: 'Sample Data',
    FhirURL: 'https://sampledata.com/labtest/2',
    display: displaySetting,
  };
  fhirRsrList.push(fhirRsr);

  $scope.patientDemo = patient;
  $scope.allergies = allergies;
  $scope.medications = medications;
  $scope.immunizations = immunizations;
  $scope.labs = labs;
  $scope.fhirRsrList = fhirRsrList;
}
