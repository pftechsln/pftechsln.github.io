function loadSampleData($scope) {

    var patient = {
        "Name": "Jason Fhir",
        "FHIR ID": "abcdefghijklmnopqrstuvwxyz0123456789",
        "Gender": "Male",
        "Date of Birth": "01/01/1988",
        "Address": "1234 Main Streat, Seattle, WA 98001",
        "Home Phone": "206-234-5678",
        "Work Phone": "405-123-4567",
        "Mobile Phone": "918-987-6543",
        "Email": "jason.fhir@healthonfhir.com"
    }
    var fhirRsr = {
      "Type": "Demographics",
      "Name": patient.Name,
      "Resource": patient,
      "Source": "Sample Data",
      "FhirURL": "https://sampledata.com/demo"
    }
    var fhirRsrList=[];
    fhirRsrList[0] = fhirRsr;

    var allergies = [
    {
       "Substance": "PENICILLIN G",
       "Status": "confirmed",
       "Recorded Date": "2015-08-24",
       "Reaction": "Hives",
       "Note": "Severity low enough to be prescribed if needed.",
    },
    {
       "Substance": "SHELLFISH-DERIVED PRODUCTS",
       "Status": "confirmed",
       "Recorded Date": "2015-11-07",
       "Reaction": "Itching",
       "Note": "",
    },
    {
        "Substance": "UNKONW",
        "Status": "confirmed",
        "Recorded Date": "2019-11-07",
        "Reaction": "Vomit",
        "Note": "It's serious. Patient needs to be very careful about it.",
     }
    ];
    fhirRsr = {
      "Type": "Allergy",
      "Name": allergies[0].Substance,
      "Resource": allergies[0],
      "Source": "Sample Data",
      "FhirURL": "https://sampledata.com/allergy/1"
    }
    fhirRsrList[1] = fhirRsr;
    fhirRsr = {
      "Type": "Allergy",
      "Name": allergies[1].Substance,
      "Resource": allergies[1],
      "Source": "Sample Data",
      "FhirURL": "https://sampledata.com/allergy/2"
    }
    fhirRsrList[2] = fhirRsr;

    var medications = [
    {
        "Medication": "Amoxillian",
        "Date": "2017-10-10",
        "Status": "Active",
        "Prescriber": "Dr. Andrew Wong",
        "Dosage Instruction": "Take 1 pill every 6 hours."
    },
    {
        "Medication": "Advil",
        "Date": "2018-10-20",
        "Status": "Active",
        "Prescriber": "Dr. Andrew Wong",
        "Dosage Instruction": "Take 1 pill every 4 hours. No more than 4 pills in 24 hours period."
    }
    ];
    fhirRsr = {
      "Type": "Medication",
      "Name": medications[0].Medication,
      "Resource": medications[0],
      "Source": "Sample Data",
      "FhirURL": "https://sampledata.com/medication/1"
    }
    fhirRsrList[3] = fhirRsr;
    fhirRsr = {
      "Type": "Medication",
      "Name": medications[1].Medication,
      "Resource": medications[1],
      "Source": "Sample Data",
      "FhirURL": "https://sampledata.com/medication/2"
    }
    fhirRsrList[4] = fhirRsr;

    var immunizations = [
    {
        "Vaccine": "Chicken Pot",
        "Date": "1978-10-23",
        "Site": "Right Arm",
        "Route": "Shot",
    },
    {
        "Vaccine": "Hapties B",
        "Date": "2000-01-01",
        "Site": "Thing",
        "Route": "Shot",
    }
    ];
    fhirRsr = {
      "Type": "Immunization",
      "Name": immunizations[0].Vaccine,
      "Resource": immunizations[0],
      "Source": "Sample Data",
      "FhirURL": "https://sampledata.com/immunization/1"
    }
    fhirRsrList[5] = fhirRsr;
    fhirRsr = {
      "Type": "Immunization",
      "Name": immunizations[1].Vaccine,
      "Resource": immunizations[1],
      "Source": "Sample Data",
      "FhirURL": "https://sampledata.com/immunization/2"
    }
    fhirRsrList[6] = fhirRsr;

    var labs = [
    {
        "Test": "Test A",
        "Date": "1999-10-23",
        "Status": "completed",
        "Result Value": "234.23",
        "Reference Range": "100-500",
        "Unit": "ml"
    },
    {
        "Test": "Test B",
        "Date": "2018-10-23",
        "Status": "Pending",
        "Result Value": "34",
        "Reference Range": "30-5-",
        "Unit": "bp"
    }
    ];
    fhirRsr = {
      "Type": "Lab Test",
      "Name": labs[0].Test,
      "Resource": labs[0],
      "Source": "Sample Data",
      "FhirURL": "https://sampledata.com/labtest/1"
    }
    fhirRsrList[7] = fhirRsr;
    fhirRsr = {
      "Type": "Lab Test",
      "Name": labs[1].Test,
      "Resource": labs[1],
      "Source": "Sample Data",
      "FhirURL": "https://sampledata.com/labtest/2"
    }
    fhirRsrList[8] = fhirRsr;

    $scope.patientDemo = patient;
    $scope.allergies = allergies;
    $scope.medications = medications;
    $scope.immunizations = immunizations;
    $scope.labs = labs;
    $scope.fhirRsrList = fhirRsrList;
}
