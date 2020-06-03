// Load patient demographic, and conformance first
function loadFhirData($scope, $http) {
  // Clear existing data if any
  $scope.fhirRsrList = [];
  $scope.rawFhirRsrList = [];

  loadAllFhirResources($scope, $http);
}

async function loadAllFhirResources($scope, $http) {
  await getPatData({ name: 'Conformance' }, $scope, $http);

  $scope.rsrTypeList.forEach((type) => {
    console.log('loading ... ', type);
    getPatData({ name: type }, $scope, $http);
  });
}

function displayConformance(data, $scope) {
  $scope.rsrTypeList = [];

  for (i = 0; i < data.rest[0].resource.length; i++) {
    let type = data.rest[0].resource[i].type;

    let searchParam = data.rest[0].resource[i].searchParam;
    let patientSearch = false;
    console.log(data.rest[0].resource[i]);

    if (searchParam != null) {
      searchParam.forEach((search) => {
        if (search.name == 'patient') {
          patientSearch = true;
        }
      });

      if (patientSearch || type === 'Patient') {
        $scope.rsrTypeList.push(type);
      }
    }
  }
  console.log('resource types: ', $scope.rsrTypeList);
}

// Load other Fhir resources after Demographics and Conformance
function loadFhirResources($scope, $http) {
  getPatData({ name: 'AllergyIntolerance' }, $scope, $http);
  getPatData({ name: 'Immunization' }, $scope, $http);
  getPatData({ name: 'MedicationOrder' }, $scope, $http);
  getPatData(
    {
      name: 'Observation',
      queryFilter: 'category=laboratory',
      displayOverride: 'Observation-laboratory',
    },
    $scope,
    $http
  );
}

// Retrive patient data
async function getPatData(resource, $scope, $http) {
  var url = $scope.fhirEndpointUrl;

  // Conformance
  if (resource.name === 'Conformance') {
    //getResource(resource, metadataUrl);
    url = $scope.fhirMetaUrl;
  }

  // Resources w/o qualifier
  else if (resource.name === 'Patient') {
    //getResource(resource, endpointUrl + resource.name + '/' + patientID, accessToken);
    url = url + '/' + resource.name + '/' + $scope.patient;
  }

  // Resources with qualifier
  else if (resource.queryFilter) {
    //getResource(resource, endpointUrl + resource.name + '?patient=' + patientID + '&' + resource.queryFilter, accessToken);
    url =
      url +
      '/' +
      resource.name +
      '?patient=' +
      $scope.patient +
      '&' +
      resource.queryFilter;
  }

  // patient Demographics
  else {
    //getResource(resource, endpointUrl + resource.name + '?patient=' + patientID, accessToken);
    url = url + '/' + resource.name + '?patient=' + $scope.patient;
  }

  $http.defaults.headers.common['Authorization'] =
    'Bearer ' + $scope.accessToken;

  try {
    const response = await $http({
      method: 'GET',
      url: url,
    });

    const substance = response.data; //.entry[0];
    const jsonString = JSON.stringify(substance, undefined, 2);

    $scope.rawFhirRsrList.push({
      type: resource.name,
      json: jsonString,
      full: substance,
    });

    $('#data' + resource.name).html(jsonString);

    if (substance['resourceType'] === 'Bundle') {
      entityCount = substance.total;
    } else {
      entityCount = 1;
    }
    $('#cnt' + resource.name).html(entityCount);
    $('#cnt' + resource.name).addClass('bg-warning');
    $('#cnt2' + resource.name).html(entityCount);
    $('#cnt2' + resource.name).addClass('bg-success');
    $('#cnt2' + resource.name).addClass('text-light');
    $('#cnt2' + resource.name).removeClass('bg-warning');
    $('#' + resource.name).html(jsonString);

    displayData(resource, substance, $scope);
  } catch (error) {
    console.log('Error loading ', resource.name, ': ', error);
    $('#cnt2' + resource.name).html('Error');
    $('#cnt2' + resource.name).addClass('bg-danger');
    $('#cnt2' + resource.name).removeClass('bg-warning');
    $('#' + resource.name).html(error.status + ' ' + error.statusText);
  }

  /*     function (error) {
      $('#data' + resource.name).html(
        'Error retrieving patient data: ' +
          error.status +
          ' - ' +
          error.statusText
      );
    } 
  ); */
}

function displayData(resource, data, $scope) {
  if (resource.name === 'Patient') {
    displayPatient(data, $scope);
  } else if (resource.name === 'AllergyIntolerance') {
    displayAllergy(data, $scope);
  } else if (resource.name === 'Immunization') {
    extractImmunization(data, $scope);
  } else if (resource.name === 'MedicationOrder') {
    extractMedication(data, $scope);
  }
  //*RLI 7/24/17
  else if (resource.name === 'Observation') {
    extractLab(data, $scope);
  } else if (resource.name === 'Conformance') {
    displayConformance(data, $scope);
  }
}

function displayPatient(data, $scope) {
  var patient = {
    Name: '',
    'FHIR ID': '',
    Gender: '',
    'Date of Birth': '',
    Address: '',
    'Home Phone': '',
    'Work Phone': '',
    'Mobile Phone': '',
    Email: '',
  };
  var address;
  var phone;
  var tmp;

  patient['Date of Birth'] = data.birthDate;
  patient['Gender'] = data.gender;
  patient['FHIR ID'] = data.id;
  patient['Name'] = data.name[0].given + ' ' + data.name[0].family;

  for (ln = 0; ln < data.address.length; ln++) {
    if (data.address[ln].use === 'home') {
      address = data.address[ln].line.join(' ');
      address =
        address +
        ', ' +
        data.address[ln].city +
        ', ' +
        data.address[ln].state +
        ' ' +
        data.address[ln].postalCode +
        ', ' +
        data.address[ln].country;
    }
  }
  patient['Address'] = address;

  for (ln = 0; ln < data.telecom.length; ln++) {
    tmp = data.telecom[ln];
    if (tmp.system === 'phone') {
      if (tmp.use === 'home') {
        patient['Home Phone'] = tmp.value;
      } else if (tmp.use === 'work') {
        patient['Work Phone'] = tmp.value;
      } else if (tmp.use === 'mobile') {
        patient['Mobile Phone'] = tmp.value;
      }
    } else if (tmp.system === 'email') {
      patient['Email'] = tmp.value;
    }
  }

  var fhirRsr = {
    Type: 'Demographics',
    Name: patient.Name,
    Resource: patient,
    SourceLink: $scope.fhirMetaUrl,
    SourceName: $scope.orgName,
    Full_Resource: data.fullUrl,
  };
  $scope.fhirRsrList.push(fhirRsr);
  //console.log(fhirRsr);
  $scope.patientDemo = patient;
}

function displayAllergy(data, $scope) {
  var tmpEntry;
  var tmpStr = '';
  var fhirRsr;

  if (data.total < 1) {
    return;
  }

  var allergies = new Array(data.total);

  try {
    for (ln = 0; ln < data.total; ln++) {
      var oneAllergy = {
        Substance: '',
        Status: '',
        'Recorded Date': '',
        Reaction: '',
        Note: '',
      };
      allergies[ln] = oneAllergy;

      tmpEntry = data.entry[ln].resource;

      oneAllergy['Substance'] = tmpEntry.substance.text;
      oneAllergy['Status'] = tmpEntry.status;
      oneAllergy['Recorded Date'] = tmpEntry.recordedDate.split('T')[0];

      if (typeof tmpEntry['reaction'] == 'undefined') {
        oneAllergy['Reaction'] = '';
      } else {
        tmpStr = '';
        for (ln2 = 0; ln2 < tmpEntry.reaction.length; ln2++) {
          if (ln2 > 0) {
            tmpStr = tmpStr + ', ';
          }
          tmpStr = tmpStr + tmpEntry.reaction[ln2].manifestation[0].text;
        }
        oneAllergy['Reaction'] = tmpStr;
      }

      if (typeof tmpEntry['note'] == 'undefined') {
        oneAllergy['Note'] = '';
      } else {
        oneAllergy['Note'] = tmpEntry.note.text;
      }
      //allergies[ln] = oneAllergy;

      fhirRsr = {
        Type: 'Allergy',
        Name: oneAllergy.Substance,
        Resource: oneAllergy,
        SourceLink: $scope.fhirMetaUrl,
        SourceName: $scope.orgName,
        Full_Resource: data.entry[ln].fullUrl,
      };
      $scope.fhirRsrList.push(fhirRsr);
      //console.log(fhirRsr);
    }
  } catch (error) {
    /* ignore */
  }

  //$scope.allergies = allergies;
}

function extractImmunization(data, $scope) {
  var tmpEntry;
  var tmpStr = '';

  if (data.total < 1) {
    return;
  }

  var immunizations = new Array(data.total);

  try {
    for (ln = 0; ln < data.total; ln++) {
      tmpEntry = data.entry[ln].resource;
      if (tmpEntry.resourceType === 'Immunization') {
        var oneImm = {
          Vaccine: '',
          Date: '',
          Site: '',
          Route: '',
        };
        immunizations[ln] = oneImm;

        oneImm['Vaccine'] = tmpEntry.vaccineCode.text;
        oneImm['Date'] = tmpEntry.date.split('T')[0];

        if (typeof tmpEntry['site'] == 'undefined') {
          oneImm['Site'] = '';
        } else {
          oneImm['Site'] = tmpEntry.site.text;
        }

        if (typeof tmpEntry['route'] == 'undefined') {
          oneImm['Route'] = '';
        } else {
          oneImm['Route'] = tmpEntry.route.text;
        }
      }
    }
  } catch (error) {}

  $scope.immunizations = immunizations;
}

//*RLI 7/24/17
function extractLab(data, $scope) {
  var tmpEntry;
  var tmpStr = '';
  var unit = '';

  if (data.total < 1) {
    return;
  }

  var labs = new Array(data.total);

  try {
    for (ln = 0; ln < data.total; ln++) {
      tmpEntry = data.entry[ln].resource;
      if (tmpEntry.resourceType === 'Observation') {
        var oneLab = {
          Test: '',
          Date: '',
          Status: '',
          'Result Value': '',
          'Reference Range': '',
          Unit: '',
        };
        labs[ln] = oneLab;

        oneLab['Test'] = tmpEntry.code.text;
        oneLab['Date'] = tmpEntry.effectiveDateTime.split('T')[0];
        oneLab['Status'] = tmpEntry.status;

        tmpStr = '';
        unit = '';
        if (typeof tmpEntry['valueQuantity'] != 'undefined') {
          tmpStr = tmpEntry.valueQuantity.value;
          unit = tmpEntry.valueQuantity.unit;
        } else if (typeof tmpEntry['valueRatio'] != 'undefined') {
          tmpStr =
            tmpEntry.valueRatio.denominator.value +
            '/' +
            tmpEntry.valueRatio.numerator.value;
        } else {
        }
        oneLab['Result Value'] = tmpStr;

        tmpStr = '';
        if (typeof tmpEntry['referenceRange'] == 'undefined') {
          tmpStr = '';
        } else {
          tmpStr = tmpEntry.referenceRange[0].text;
          tmpStr = tmpStr.split(unit)[0];
        }
        oneLab['Reference Range'] = tmpStr;
        oneLab['Unit'] = unit;
      }
    }
  } catch (error) {
    alert(error);
  }

  $scope.labs = labs;
}

function extractMedication(data, $scope) {
  var tmpEntry;
  var tmpStr = '';

  if (data.total < 1) {
    return;
  }

  var medications = new Array(data.total);

  try {
    for (ln = 0; ln < data.total; ln++) {
      tmpEntry = data.entry[ln].resource;
      if (tmpEntry.resourceType === 'MedicationOrder') {
        var oneMed = {
          Medication: '',
          Date: '',
          Status: '',
          Prescriber: '',
          'Dosage Instruction': '',
        };
        medications[ln] = oneMed;

        oneMed['Medication'] = tmpEntry.medicationReference.display;
        oneMed['Date'] = tmpEntry.dateWritten.split('T')[0];
        oneMed['Status'] = tmpEntry.status;

        if (typeof tmpEntry['prescriber'] == 'undefined') {
          oneMed['Prescriber'] = '';
        } else {
          oneMed['Prescriber'] = tmpEntry.prescriber.display;
        }

        if (typeof tmpEntry['dosageInstruction'] == 'undefined') {
          oneMed['Dosage Instruction'] = '';
        } else {
          oneMed['Dosage Instruction'] = tmpEntry.dosageInstruction[0].text;
        }

        fhirRsr = {
          Type: 'Medication',
          Name: oneMed.Medication,
          Resource: oneMed,
          SourceLink: $scope.fhirMetaUrl,
          SourceName: $scope.orgName,
          Full_Resource: data.entry[ln].fullUrl,
        };
        $scope.fhirRsrList.push(fhirRsr);
        //console.log(fhirRsr);
      }
    }
  } catch (error) {}

  //$scope.medications = medications;
}
