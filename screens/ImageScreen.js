import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  Image, 
  StyleSheet, 
  ActivityIndicator, 
  Modal, 
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import database from '@react-native-firebase/database'; // Import Firebase Realtime Database


const ImageScreen = () => {
  const [pid, setPid] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [leftEyeCataractTypes, setLeftEyeCataractTypes] = useState([]);
  const [rightEyeCataractTypes, setRightEyeCataractTypes] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone_number: '',
    sex: '',
    location: '',
    dob: '',
    address: '',
    bloodGroup: '',
    medicalHistory: [],
    visionSymptoms: [],
    cataractTypes: [],
  });
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const snapshot = await database().ref(`/${pid}`).once('value'); // Fetch data based on PID
      const fetchedData = snapshot.val();
      if (fetchedData && fetchedData.image_urls && Array.isArray(fetchedData.image_urls)) {
        setImageUrls(fetchedData.image_urls);
      } else {
        setImageUrls([]); // Set imageUrls to an empty array if image_urls is not an array or is empty
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching images:', error);
    }
  };

  /*const cataractTypes = [
    { key: 'Normal', label: 'Normal' },
    { key: 'Mature', label: 'Mature' },
    { key: 'MC', label: 'MC' },
    { key: 'PSC', label: 'PSC' },
    { key: 'Nuclear', label: 'Nuclear' },
  ];*/


  const handleFormSubmit = async () => {
    try {
      if (!validateForm()) return;
  
      const dataToSave = {
        name: formData.name,
        age: formData.age,
        phone_number: formData.phone_number,
        sex: formData.sex,
        location: formData.location,
        dob: formData.dob, // Access dob directly from formData
        address: formData.address,
        bloodGroup: formData.bloodGroup,
        medicalHistory: formData.medicalHistory,
        visionSymptoms: formData.visionSymptoms,
        cataractTypes: formData.cataractTypes, // Include cataract types in data to be saved
        leftEyeCataractTypes: leftEyeCataractTypes,
        rightEyeCataractTypes: rightEyeCataractTypes,
        timestamp: new Date().toISOString(),
      };
  
      await database().ref(`/${pid}`).update(dataToSave);
      // Clear form data except cataractTypes
      setFormData({
        ...formData,
        name: '',
        age: '',
        phone_number: '',
        sex: '',
        location: '',
        dob: '',
        address: '',
        bloodGroup: '',
        medicalHistory: [],
        visionSymptoms: [],
      });
      setLeftEyeCataractTypes([]);
      setRightEyeCataractTypes([]);
      setIsFormOpen(false);
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    }
  };
  
  const handleMedicalHistoryToggle = (option) => {
    const updatedHistory = formData.medicalHistory.includes(option)
      ? formData.medicalHistory.filter((item) => item !== option)
      : [...formData.medicalHistory, option];
    setFormData({ ...formData, medicalHistory: updatedHistory });
  };

  const handleVisionSymptomsToggle = (option) => {
    const updatedSymptoms = formData.visionSymptoms.includes(option)
      ? formData.visionSymptoms.filter((item) => item !== option)
      : [...formData.visionSymptoms, option];
    setFormData({ ...formData, visionSymptoms: updatedSymptoms });
  };

  const handleCataractToggle = (type, eye) => {
    if (eye === 'left') {
      handleLeftEyeCataractToggle(type);
    } else if (eye === 'right') {
      handleRightEyeCataractToggle(type);
    }
  };

  const handleLeftEyeCataractToggle = (type) => {
    const updatedLeftEyeTypes = leftEyeCataractTypes.includes(type)
      ? leftEyeCataractTypes.filter((item) => item !== type)
      : [...leftEyeCataractTypes, type];
    setLeftEyeCataractTypes(updatedLeftEyeTypes);
  };
  
  const handleRightEyeCataractToggle = (type) => {
    const updatedRightEyeTypes = rightEyeCataractTypes.includes(type)
      ? rightEyeCataractTypes.filter((item) => item !== type)
      : [...rightEyeCataractTypes, type];
    setRightEyeCataractTypes(updatedRightEyeTypes);
  };
  
  const validateForm = () => {
    if (!formData.name || !/^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/.test(formData.name.trim())) {
      alert('Please enter a valid name containing only words, starting with a capital letter, and with subsequent words starting with capital letters.');
      return false;
    }
    if (!formData.age || isNaN(formData.age)) {
      alert('Please enter a valid age as a number.');
      return false;
    }
    if (!formData.phone_number || !/^[789]\d{9}$/.test(formData.phone_number)) {
      alert('Please enter a valid phone number starting with 7, 8, or 9 and containing 10 digits.');
      return false;
    }
    if (!formData.sex) {
      alert('Please select a gender.');
      return false;
    }
    if (!formData.location || !/^[A-Za-z0-9\s,./:""]*$/.test(formData.location)) {
      alert('Location can only contain numbers, letters, spaces, commas, slashes, periods, colons, and double quotes.');
      return false;
    }
    if (!formData.dob) {
      alert('Please enter Date of Birth.');
      return false;
    }
    if (!formData.address) {
      alert('Please enter Address.');
      return false;
    }
    if (!formData.bloodGroup) {
      alert('Please enter Blood Group.');
      return false;
    }
    if (formData.medicalHistory.length === 0) {
      alert('Please select Medical History.');
      return false;
    }
    if (formData.visionSymptoms.length === 0) {
      alert('Please select Vision Symptoms.');
      return false;
    }
  
    return true;
  };


  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Get Images by PID</Text>
      <TextInput
        placeholder="Enter PID"
        value={pid}
        onChangeText={setPid}
        style={styles.input}
      />
      <Button title="Get Images" onPress={fetchImages} color="black" />
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : imageUrls.length > 0 ? (
        <View style={styles.imageContainer}>
          {imageUrls.map((imageUrl, index) => (
            <View key={index} style={[styles.imageWrapper, { borderColor: 'skyblue' }]}>
            <Image key={index} source={{ uri: imageUrl }} style={styles.image} />
            </View>
          ))}
          

<View style={[styles.checkboxContainer, { alignItems: 'flex-start' }]}>
<Text style={styles.label}>Cataract (left Eye)</Text>
  <CheckBox
    title='Normal'
    checked={leftEyeCataractTypes.includes('Normal')}
    onPress={() => handleCataractToggle('Normal', 'left')}
  />
  <CheckBox
    title='Cortical'
    checked={leftEyeCataractTypes.includes('Cortical')}
    onPress={() => handleCataractToggle('Cortical', 'left')}
  />
  <CheckBox
    title='MC'
    checked={leftEyeCataractTypes.includes('MC')}
    onPress={() => handleCataractToggle('MC', 'left')}
  />
  <CheckBox
    title='PSC'
    checked={leftEyeCataractTypes.includes('PSC')}
    onPress={() => handleCataractToggle('PSC', 'left')}
  />
  <CheckBox
    title='Nuclear'
    checked={leftEyeCataractTypes.includes('Nuclear')}
    onPress={() => handleCataractToggle('Nuclear', 'left')}
  />
</View>



<View style={[styles.checkboxContainer, { alignItems: 'flex-start' }]}>
<Text style={styles.label}>Cataract (Right Eye)</Text>
  <CheckBox
    title='Normal'
    checked={rightEyeCataractTypes.includes('Normal')}
    onPress={() => handleCataractToggle('Normal', 'right')}
  />
  <CheckBox
    title='Cortical'
    checked={rightEyeCataractTypes.includes('Cortical')}
    onPress={() => handleCataractToggle('Cortical', 'right')}
  />
  <CheckBox
    title='MC'
    checked={rightEyeCataractTypes.includes('MC')}
    onPress={() => handleCataractToggle('MC', 'right')}
  />
  <CheckBox
    title='PSC'
    checked={rightEyeCataractTypes.includes('PSC')}
    onPress={() => handleCataractToggle('PSC', 'right')}
  />
  <CheckBox
    title='Nuclear'
    checked={rightEyeCataractTypes.includes('Nuclear')}
    onPress={() => handleCataractToggle('Nuclear', 'right')}
  />
</View>


</View>
) : (
  <Text>No images found for PID: {pid}</Text>
)}



<Button title="Open Form" onPress={() => setIsFormOpen(true)} color="black" />
      
      <Modal visible={isFormOpen} animationType="slide">
        <KeyboardAvoidingView style={styles.formContainer} behavior="padding">
          <ScrollView>
            <Text style={styles.formTitle}>Submit Form for PID: {pid}</Text>
            
            <Text style={styles.label}>Name</Text>
            <TextInput
              placeholder="Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              style={styles.input}
              label="Name"
            />
            <Text style={styles.label}>Age</Text>
            <TextInput
              placeholder="Age"
              value={formData.age}
              onChangeText={(text) => setFormData({ ...formData, age: text })}
              style={styles.input}
              keyboardType="numeric"
              label="Age"
            />
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              placeholder="Phone Number"
              value={formData.phone_number}
              onChangeText={(text) => setFormData({ ...formData, phone_number: text })}
              style={styles.input}
              keyboardType="numeric"
              label="Phone Number"
            />
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

            <Text style={styles.label}>Location</Text>
            <TextInput
              placeholder="Location"
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
              style={styles.input}
              label="Location"
            />
            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              placeholder="Date of Birth"
              value={formData.dob}
              onChangeText={(text) => setFormData({ ...formData, dob: text })}
              style={styles.input}
              label="Date of Birth"
            />
            <Text style={styles.label}>Address</Text>
            <TextInput
              placeholder="Address"
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              style={styles.input}
              label="Address"
            />
            <Text style={styles.label}>Blood Group</Text>
            <TextInput
              placeholder="Blood Group"
              value={formData.bloodGroup}
              onChangeText={(text) => setFormData({ ...formData, bloodGroup: text })}
              style={styles.input}
              label="Blood Group"
            />
            <Text style={styles.label}>Medical History</Text>
            <View style={styles.checkboxContainer}>
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
  
            <Button title="Submit Form" onPress={handleFormSubmit} color="black" />
            <View style={{ marginBottom: 10 }} />
            <Button title="Close Form" onPress={() => setIsFormOpen(false)} color="black" />
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    width: '100%',
    backgroundColor: 'white', // Add background color
  },
  imageWrapper: {
    borderWidth: 2, // Border width
    borderColor: 'skyblue', // Border color
    borderRadius: 5, // Border radius
    margin: 5, // Margin around each image
    overflow: 'hidden', // Ensure image stays within border
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 135,
    height: 135,
    margin: 5,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    borderRadius: 10,
    backgroundColor: 'lightblue',
    marginTop: 20,
    borderWidth: 2, // Border width
    borderColor: 'skyblue', // Border color
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
    
  },
  checkboxContainer: {
    marginBottom: 20, // Add margin bottom to create space between the sections
    borderWidth: 1,
    borderColor: '#ccc', // Border color similar to the detail screen
    borderRadius: 5, // Border radius similar to the detail screen
    padding: 10, // Padding similar to the detail screen
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default ImageScreen;
            

