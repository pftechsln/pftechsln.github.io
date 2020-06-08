import { FhirResource, FhirAllergy, FhirImmunization } from './fhirModel.js';

export function loadSampleData($scope) {
  var fhirRsrList = [];

  let sampleAllergies = [
    {
      fullUrl:
        'https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/AllergyIntolerance/TBwnNbrAqC0Qw5Ha7AFT-2AB',
      link: [
        {
          relation: 'self',
          url:
            'https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/AllergyIntolerance/TBwnNbrAqC0Qw5Ha7AFT-2AB',
        },
      ],
      search: { mode: 'match' },
      resource: {
        resourceType: 'AllergyIntolerance',
        recordedDate: '2015-08-24T23:11:36Z',
        status: 'confirmed',
        criticality: 'CRITL',
        id: 'TBwnNbrAqC0Qw5Ha7AFT-2AB',
        onset: '2012-11-07T00:00:00Z',
        recorder: {
          display: 'MOORE, NICK',
          reference:
            'https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/Practitioner/TItWfhjChtlo0pFh9nzctSQB',
        },
        patient: {
          display: 'Jason Argonaut',
          reference:
            'https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/Patient/Tbt3KuCY0B5PSrJvCu2j-PlK.aiHsu2xUjUM8bWpetXoB',
        },
        substance: {
          text: 'PENICILLIN G',
          coding: [
            {
              system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
              code: '7980',
              display: 'PENICILLIN G',
            },
            {
              system: 'http://fdasis.nlm.nih.gov',
              code: 'Q42T66VG0C',
              display: 'PENICILLIN G',
            },
          ],
        },
        reaction: [
          {
            certainty: 'confirmed',
            onset: '2012-11-07T00:00:00Z',
            manifestation: [{ text: 'Hives' }],
            note: { text: 'Severity low enough to be prescribed if needed.' },
          },
        ],
        note: { text: 'Severity low enough to be prescribed if needed.' },
      },
    },
    {
      fullUrl:
        'https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/AllergyIntolerance/TPcWiBG2h2E114Vh0sRT8fQB',
      link: [
        {
          relation: 'self',
          url:
            'https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/AllergyIntolerance/TPcWiBG2h2E114Vh0sRT8fQB',
        },
      ],
      search: { mode: 'match' },
      resource: {
        resourceType: 'AllergyIntolerance',
        recordedDate: '2015-11-07T20:55:10Z',
        status: 'confirmed',
        criticality: 'CRITL',
        id: 'TPcWiBG2h2E114Vh0sRT8fQB',
        onset: '2010-05-02T00:00:00Z',
        recorder: {
          display: 'MOORE, NICK',
          reference:
            'https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/Practitioner/TItWfhjChtlo0pFh9nzctSQB',
        },
        patient: {
          display: 'Jason Argonaut',
          reference:
            'https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/Patient/Tbt3KuCY0B5PSrJvCu2j-PlK.aiHsu2xUjUM8bWpetXoB',
        },
        substance: {
          text: 'SHELLFISH-DERIVED PRODUCTS',
          coding: [
            {
              system: 'http://hl7.org/fhir/ndfrt',
              code: 'N0000007624',
              display: 'SHELLFISH-DERIVED PRODUCTS',
            },
          ],
        },
        reaction: [
          {
            certainty: 'confirmed',
            onset: '2010-05-02T00:00:00Z',
            manifestation: [{ text: 'Itching' }],
          },
        ],
      },
    },
    {
      fullUrl:
        'https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/AllergyIntolerance/TKebKfLXzu6Sp.LY-IpvpmQB',
      link: [
        {
          relation: 'self',
          url:
            'https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/AllergyIntolerance/TKebKfLXzu6Sp.LY-IpvpmQB',
        },
      ],
      search: { mode: 'match' },
      resource: {
        resourceType: 'AllergyIntolerance',
        recordedDate: '2015-11-07T20:56:34Z',
        status: 'confirmed',
        criticality: 'CRITH',
        id: 'TKebKfLXzu6Sp.LY-IpvpmQB',
        onset: '2014-03-07T00:00:00Z',
        recorder: {
          display: 'MOORE, NICK',
          reference:
            'https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/Practitioner/TItWfhjChtlo0pFh9nzctSQB',
        },
        patient: {
          display: 'Jason Argonaut',
          reference:
            'https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/Patient/Tbt3KuCY0B5PSrJvCu2j-PlK.aiHsu2xUjUM8bWpetXoB',
        },
        substance: {
          text: 'STRAWBERRY',
          coding: [
            {
              system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
              code: '892484',
              display: 'STRAWBERRY',
            },
            {
              system: 'http://fdasis.nlm.nih.gov',
              code: '4J2TY8Y81V',
              display: 'STRAWBERRY',
            },
          ],
        },
        reaction: [
          {
            certainty: 'confirmed',
            onset: '2014-03-07T00:00:00Z',
            manifestation: [{ text: 'Anaphylaxis' }],
          },
        ],
      },
    },
  ];

  sampleAllergies.forEach((aJson) => {
    let oneAllergy = new FhirAllergy(aJson);
    fhirRsrList.push(oneAllergy);
  });

  let sampleImmunizations = [
    {
      fullUrl:
        'https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/Immunization/TUmTlNxD2uFE77.rcuilaBwB',
      link: [
        {
          relation: 'self',
          url:
            'https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/Immunization/TUmTlNxD2uFE77.rcuilaBwB',
        },
      ],
      search: { mode: 'match' },
      resource: {
        resourceType: 'Immunization',
        status: 'completed',
        date: '2016-01-09T00:00:00Z',
        wasNotGiven: false,
        reported: true,
        lotNumber: '12321',
        id: 'TUmTlNxD2uFE77.rcuilaBwB',
        vaccineCode: {
          text: 'DTP-Hib-Hep B',
          coding: [
            {
              system: 'http://hl7.org/fhir/sid/cvx',
              code: '102',
              display: 'DTP-HIB-HEP B',
            },
          ],
        },
        patient: {
          display: 'Jason Argonaut',
          reference:
            'https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/Patient/Tbt3KuCY0B5PSrJvCu2j-PlK.aiHsu2xUjUM8bWpetXoB',
        },
      },
    },
    {
      fullUrl:
        'https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/Immunization/TfHwRVsICbE33tGGsW1GWvgB',
      link: [
        {
          relation: 'self',
          url:
            'https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/Immunization/TfHwRVsICbE33tGGsW1GWvgB',
        },
      ],
      search: { mode: 'match' },
      resource: {
        resourceType: 'Immunization',
        status: 'completed',
        date: '2016-03-02T00:00:00Z',
        wasNotGiven: false,
        reported: true,
        id: 'TfHwRVsICbE33tGGsW1GWvgB',
        vaccineCode: {
          text: 'Cholera',
          coding: [
            {
              system: 'http://hl7.org/fhir/sid/cvx',
              code: '26',
              display: 'CHOLERA',
            },
          ],
        },
        patient: {
          display: 'Jason Argonaut',
          reference:
            'https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/Patient/Tbt3KuCY0B5PSrJvCu2j-PlK.aiHsu2xUjUM8bWpetXoB',
        },
        site: {
          text: 'Left arm',
          coding: [
            {
              system: 'urn:oid:1.2.840.114350.1.13.0.1.7.10.768076.4040',
              code: '14',
              display: 'Left arm',
            },
          ],
        },
        route: {
          text: 'Intravenous',
          coding: [
            {
              system: 'urn:oid:1.2.840.114350.1.13.0.1.7.10.768076.4030',
              code: '6',
              display: 'Intravenous',
            },
          ],
        },
      },
    },
  ];
  sampleImmunizations.forEach((aJson) => {
    let one = new FhirImmunization(aJson);
    fhirRsrList.push(one);
  });

  $scope.fhirRsrList = fhirRsrList;
  console.log('fhirRsrList ', fhirRsrList);

  $scope.rsrTypeList = [];
  let type = 'AllergyIntolerance';
  $scope.rsrTypeList.push({ name: type, display: null });
  $('#cnt2' + type).html('3');
  $('#cnt2' + type).removeClass('bg-warning');
  $('#cnt2' + type).addClass('bg-success');
  $('#cnt2' + type).addClass('text-light');

  type = 'Immunization';
  $scope.rsrTypeList.push({ name: type, display: null });
  $('#cnt2' + type).html(2);
  $('#cnt2' + type).removeClass('bg-warning');
  $('#cnt2' + type).addClass('bg-success');
  $('#cnt2' + type).addClass('text-light');
}
