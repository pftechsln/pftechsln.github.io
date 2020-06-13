import { FhirResource } from './fhirModel.js';

function loadFhirFile(fileUrl, resourceType, $scope) {
  fetch(fileUrl)
    .then((response) => {
      response.json().then((data) => {
        console.log(`fetch ${resourceType}: `, data);

        if (resourceType === 'Patient') {
          let temp = { entry: [data] };
          data = temp;
        }
        data.entry.forEach((aJson) => {
          let one = FhirResource.createResource(aJson, resourceType);
          $scope.fhirRsrList.push(one);
        });

        let type = resourceType;
        $scope.rsrTypeList.push({ name: type, display: null });

        $scope.orgName = 'Sample Data';
        angular.element(document).ready(() => {
          $('#cnt2' + type).html(data.entry.length);
          $('#cnt2' + type).removeClass('bg-warning');
          $('#cnt2' + type).addClass('bg-success');
          $('#cnt2' + type).addClass('text-light');
          $('#' + type).html(JSON.stringify(data, undefined, 2));
        });

        $scope.$apply();
      });
    })
    .catch((error) => {
      console.log('sample data error: ', error);
    });
}

export function loadSampleData($scope) {
  $scope.rsrTypeList = [];
  $scope.fhirRsrList = [];

  loadFhirFile(
    'https//pftechsln.github.io/data/Patient.json',
    'Patient',
    $scope
  );
  loadFhirFile(
    'https//pftechsln.github.io/data/AllergyList.json',
    'AllergyIntolerance',
    $scope
  );
  loadFhirFile(
    'https//pftechsln.github.io/data/Immunizations.json',
    'Immunization',
    $scope
  );
  loadFhirFile(
    'https//pftechsln.github.io/data/Medications.json',
    'MedicationOrder',
    $scope
  );
  loadFhirFile(
    'https//pftechsln.github.io/data/Observations.json',
    'Observation-laboratory',
    $scope
  );
}
