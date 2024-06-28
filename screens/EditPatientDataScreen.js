import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,  FlatList, TextInput, Button, Keyboard, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database'; // Import Firebase Realtime Database
import { CheckBox } from 'react-native-elements';

const EditPatientDataScreen = () => {
  const navigation = useNavigation();
  const [patientsData, setPatientsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone_number: '',
    sex: '',
    location: '',
    dob: '',
    address: '',
    bloodGroup: '',
    medicalHistory: '',
    visionSymptoms: '',
  });
  const [searchText, setSearchText] = useState('');
  const [showSearch, setShowSearch] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const snapshot = await database().ref().once('value');
      const data = snapshot.val();
      if (data) {
        const patientsArray = Object.values(data);
        setPatientsData(patientsArray);
      } else {
        setPatientsData([]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
    }
  };

  const handleCardClick = (patientData) => {
    setSelectedPatient(patientData);
    setFormData(patientData);
    setShowSearch(false);
    Keyboard.dismiss();
  };

  const handleFormSubmit = async () => {
    try {
      // Perform form validation if needed

      // Update the selected patient data in the database
      await database().ref(`/${selectedPatient.pid}`).update(formData);
      alert('Patient data updated successfully!');
      navigation.goBack(); // Go back to previous screen after submission
    } catch (error) {
      console.error('Error updating patient data:', error);
      alert('Failed to update patient data. Please try again.');
    }
  };

  const handleCloseForm = () => {
    setShowSearch(true);
    setSelectedPatient(null);
    setFormData({
      name: '',
      age: '',
      phone_number: '',
      sex: '',
      location: '',
      dob: '',
      address: '',
      bloodGroup: '',
      medicalHistory: '',
      visionSymptoms: '',
    });
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const filteredPatients = patientsData.filter(patient => {
    if (patient.pid && patient.name) {
      return (
        patient.pid.toString().includes(searchText) ||
        patient.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    return false;
  });

  const renderPatientCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleCardClick(item)}
    >
      <Text style={styles.cardLabel}>PID: {item.pid}</Text>
      <Text style={styles.cardLabel}>Name: {item.name}</Text>
    </TouchableOpacity>
  );

  const handleVisionSymptomsToggle = (symptom) => {
    const updatedSymptoms = [...formData.visionSymptoms];
  
    if (updatedSymptoms.includes(symptom)) {
      // Remove the symptom if it already exists
      const index = updatedSymptoms.indexOf(symptom);
      updatedSymptoms.splice(index, 1);
    } else {
      // Add the symptom if it doesn't exist
      updatedSymptoms.push(symptom);
    }
  
    // Update the form data with the updated symptoms
    setFormData({ ...formData, visionSymptoms: updatedSymptoms });
  };

  const handleMedicalHistoryToggle = (condition) => {
    const updatedHistory = [...formData.medicalHistory];
  
    if (updatedHistory.includes(condition)) {
      // Remove the condition if it already exists
      const index = updatedHistory.indexOf(condition);
      updatedHistory.splice(index, 1);
    } else {
      // Add the condition if it doesn't exist
      updatedHistory.push(condition);
    }
  
    // Update the form data with the updated medical history
    setFormData({ ...formData, medicalHistory: updatedHistory });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : showSearch ? (
        <TextInput
          placeholder="Search by PID or Name"
          value={searchText}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
      ) : null}
      {selectedPatient ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.fullScreenForm}>
            <Text style={styles.formTitle}>Edit Patient Data</Text>
            <View style={styles.formContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                placeholder="Name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                style={styles.input}
              />
            </View>
            <View style={styles.formContainer}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                placeholder="Age"
                value={formData.age}
                onChangeText={(text) => setFormData({ ...formData, age: text })}
                style={styles.input}
                keyboardType="numeric"
              />
            </View>
            {/* Add other TextInput components with labels */}
            <View style={styles.formContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                placeholder="Phone Number"
                value={formData.phone_number}
                onChangeText={(text) => setFormData({ ...formData, phone_number: text })}
                style={styles.input}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.formContainer}>
  <Text style={styles.label}>Sex</Text>
  <View style={styles.checkboxContainer}>
    <CheckBox
      title='Male'
      checked={formData.sex === 'Male'}
      onPress={() => setFormData({ ...formData, sex: 'Male' })}
    />
    <CheckBox
      title='Female'
      checked={formData.sex === 'Female'}
      onPress={() => setFormData({ ...formData, sex: 'Female' })}
    />
    <CheckBox
      title='Others'
      checked={formData.sex === 'Others'}
      onPress={() => setFormData({ ...formData, sex: 'Others' })}
    />
  </View>
</View>
            <View style={styles.formContainer}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                placeholder="Location"
                value={formData.location}
                onChangeText={(text) => setFormData({ ...formData, location: text })}
                style={styles.input}
              />
            </View>
            <View style={styles.formContainer}>
              <Text style={styles.label}>Date of Birth</Text>
              <TextInput
                placeholder="Date of Birth"
                value={formData.dob}
                onChangeText={(text) => setFormData({ ...formData, dob: text })}
                style={styles.input}
              />
            </View>
            <View style={styles.formContainer}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                placeholder="Address"
                value={formData.address}
                onChangeText={(text) => setFormData({ ...formData, address: text })}
                style={styles.input}
              />
            </View>
            <View style={styles.formContainer}>
              <Text style={styles.label}>Blood Group</Text>
              <TextInput
                placeholder="Blood Group"
                value={formData.bloodGroup}
                onChangeText={(text) => setFormData({ ...formData, bloodGroup: text })}
                style={styles.input}
              />
            </View>
            
<View style={styles.formContainer}>
  <Text style={styles.label}>Medical History</Text>
  <View style={styles.checkboxGrid}>
    <View style={styles.checkboxRow}>
      <CheckBox
        title='Nearsightedness'
        checked={formData.medicalHistory.includes('Nearsightedness')}
        onPress={() => handleMedicalHistoryToggle('Nearsightedness')}
      />
      <CheckBox
        title='Farsightedness'
        checked={formData.medicalHistory.includes('Farsightedness')}
        onPress={() => handleMedicalHistoryToggle('Farsightedness')}
      />
    </View>
    <View style={styles.checkboxRow}>
      <CheckBox
        title='Astigmatism'
        checked={formData.medicalHistory.includes('Astigmatism')}
        onPress={() => handleMedicalHistoryToggle('Astigmatism')}
      />
      <CheckBox
        title='Glaucoma'
        checked={formData.medicalHistory.includes('Glaucoma')}
        onPress={() => handleMedicalHistoryToggle('Glaucoma')}
      />
    </View>
    <View style={styles.checkboxRow}>
      <CheckBox
        title='Inflammation'
        checked={formData.medicalHistory.includes('Inflammation')}
        onPress={() => handleMedicalHistoryToggle('Inflammation')}
      />
      <CheckBox
        title='Allergies'
        checked={formData.medicalHistory.includes('Allergies')}
        onPress={() => handleMedicalHistoryToggle('Allergies')}
      />
    </View>
    <View style={styles.checkboxRow}>
      <CheckBox
        title='Dry eye syndrome'
        checked={formData.medicalHistory.includes('Dry eye syndrome')}
        onPress={() => handleMedicalHistoryToggle('Dry eye syndrome')}
      />
      <CheckBox
        title='Diabetic retinopathy'
        checked={formData.medicalHistory.includes('Diabetic retinopathy')}
        onPress={() => handleMedicalHistoryToggle('Diabetic retinopathy')}
      />
    </View>
    <View style={styles.checkboxRow}>
      <CheckBox
        title='Vitreous detachment'
        checked={formData.medicalHistory.includes('Vitreous detachment')}
        onPress={() => handleMedicalHistoryToggle('Vitreous detachment')}
      />
      <CheckBox
                title='None'
                checked={formData.medicalHistory.includes('None')}
                onPress={() => handleMedicalHistoryToggle('None')}
              />
            
    </View>
  </View>
</View>

<View style={styles.formContainer}>
  <Text style={styles.label}>Vision Symptoms</Text>
  <View style={styles.checkboxContainer}>
    <CheckBox
      title='Blurred Vision'
      checked={formData.visionSymptoms.includes('Blurred Vision')}
      onPress={() => handleVisionSymptomsToggle('Blurred Vision')}
    />
    <CheckBox
      title='Cloudy or Dimmed Vision'
      checked={formData.visionSymptoms.includes('Cloudy or Dimmed Vision')}
      onPress={() => handleVisionSymptomsToggle('Cloudy or Dimmed Vision')}
    />
    <CheckBox
      title='Glare'
      checked={formData.visionSymptoms.includes('Glare')}
      onPress={() => handleVisionSymptomsToggle('Glare')}
    />
    <CheckBox
      title='Double Vision'
      checked={formData.visionSymptoms.includes('Double Vision')}
      onPress={() => handleVisionSymptomsToggle('Double Vision')}
    />
    <CheckBox
      title='Reduced Night Vision'
      checked={formData.visionSymptoms.includes('Reduced Night Vision')}
      onPress={() => handleVisionSymptomsToggle('Reduced Night Vision')}
    />
    <CheckBox
      title='Poor Contrast Sensitivity'
      checked={formData.visionSymptoms.includes('Poor Contrast Sensitivity')}
      onPress={() => handleVisionSymptomsToggle('Poor Contrast Sensitivity')}
    />
    <CheckBox
      title='Difficulty with Reading and Near Vision'
      checked={formData.visionSymptoms.includes('Difficulty with Reading and Near Vision')}
      onPress={() => handleVisionSymptomsToggle('Difficulty with Reading and Near Vision')}
    />
    <CheckBox
                title='None'
                checked={formData.visionSymptoms.includes('None')}
                onPress={() => handleVisionSymptomsToggle('None')}
              />
  </View>
</View>


            <Button title="Submit" onPress={handleFormSubmit} />
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseForm}>
              <Text style={styles.closeButtonText}>Close Form</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )       : (
        <FlatList
          data={filteredPatients}
          renderItem={renderPatientCard}
          keyExtractor={(item) => item.pid.toString()}
          numColumns={2} // Adjust the number of columns as needed
          contentContainerStyle={styles.flatListContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  searchInput: {
    borderWidth: 2,
    borderColor: 'gray',
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ADD8E6', // Sky blue border color
    borderRadius: 10,
    padding: 10,
    margin: 5,
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  formContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  closeButton: {
    backgroundColor: 'lightgray',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  flatListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default EditPatientDataScreen;