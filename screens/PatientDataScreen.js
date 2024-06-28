import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import database from '@react-native-firebase/database'; // Import Firebase Realtime Database
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const PatientDataScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null); // State for selected patient

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const snapshot = await database().ref().once('value');
      const fetchedData = snapshot.val();
      if (fetchedData) {
        const resultsArray = Object.values(fetchedData);
        const updatedResults = resultsArray.map(patient => ({
          ...patient,
          bloodGroup: patient.bloodGroup || '',
          dob: patient.dob || '',
          grade_L: patient.grade_L || '',
          grade_R: patient.grade_R || '',
          leftEyeCataractTypes: patient.leftEyeCataractTypes || [],
          rightEyeCataractTypes: patient.rightEyeCataractTypes || [],
          location: patient.location || '',
          medicalHistory: patient.medicalHistory || [],
          timestamp: patient.timestamp || '',
          visionSymptoms: patient.visionSymptoms || [],
        }));
        setSearchResults(updatedResults);
      } else {
        setSearchResults([]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = () => {
    if (!searchText.trim()) {
      setSearchResults(searchResults);
      return;
    }

    const filteredPatients = searchResults.filter(patient => {
      if (patient && patient.pid) {
        return (
          patient.pid.toString().includes(searchText) ||
          patient.name.toLowerCase().includes(searchText.toLowerCase())
        );
      }
      return false;
    });

    setSearchResults(filteredPatients);
  };

  const handleCardClick = (patientData) => {
    setSelectedPatient(patientData); // Set the selected patient
  };

  const renderCataractType = (patient) => {
    if (patient.grade_L === patient.leftEyeCataractTypes) {
      return (
        <Text style={styles.cardLabel}>Grade (Left Eye): {patient.grade_L}</Text>
      );
    } else {
      return (
        <Text style={styles.cardLabel}>Cataract (Left Eye): {patient.leftEyeCataractTypes.join(', ')}</Text>
      );
    }
  };

  const renderRightEyeCataractType = (patient) => {
    if (patient.grade_R === patient.rightEyeCataractTypes) {
      return (
        <Text style={styles.cardLabel}>Grade (Right Eye): {patient.grade_R}</Text>
      );
    } else {
      return (
        <Text style={styles.cardLabel}>Cataract (Right Eye): {patient.rightEyeCataractTypes.join(', ')}</Text>
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {!selectedPatient && (
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search by PID or Name"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.input}
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchIcon}>
            <Icon name="search" size={20} color="black" />
          </TouchableOpacity>
        </View>
      )}
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : selectedPatient ? (
        <View style={styles.patientDetailsContainer}>
          <Text style={styles.subTitle}>Patient Profile</Text>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>PID:</Text>
            <Text style={styles.detailValue}>{selectedPatient.pid}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Name:</Text>
            <Text style={styles.detailValue}>{selectedPatient.name}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Age:</Text>
            <Text style={styles.detailValue}>{selectedPatient.age}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Sex:</Text>
            <Text style={styles.detailValue}>{selectedPatient.sex}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Blood Group:</Text>
            <Text style={styles.detailValue}>{selectedPatient.bloodGroup}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>DOB:</Text>
            <Text style={styles.detailValue}>{selectedPatient.dob}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Address:</Text>
            <Text style={styles.detailValue}>{selectedPatient.address}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Phone Number:</Text>
            <Text style={styles.detailValue}>{selectedPatient.phone_number}</Text>
          </View>
          {renderCataractType(selectedPatient)}
          {renderRightEyeCataractType(selectedPatient)}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{selectedPatient.location}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Medical History:</Text>
            <Text style={styles.detailValue}>{selectedPatient.medicalHistory.join(', ')}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Timestamp:</Text>
            <Text style={styles.detailValue}>{selectedPatient.timestamp}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Vision Symptoms:</Text>
            <Text style={styles.detailValue}>{selectedPatient.visionSymptoms.join(', ')}</Text>
          </View>
          {selectedPatient.image_urls && Array.isArray(selectedPatient.image_urls) && selectedPatient.image_urls.length > 0 ? (
            <View style={styles.imageContainer}>
              
              {selectedPatient.image_urls.map((imageUrl, imgIndex) => (
                
                <Image key={imgIndex} source={{ uri: imageUrl }} style={styles.patientImage} />
              ))}
            </View>
          ) : (
            <Text>No images available</Text>
          )}
        </View>
      ) : searchResults.length > 0 ? (
        <View style={styles.cardContainer}>
          {searchResults.map((result, index) => {
            if (result.name && result.pid) { // Check if the result has both name and PID
              return (
                <TouchableOpacity key={index} style={styles.card} onPress={() => handleCardClick(result)}>
                  <Text style={styles.cardLabel}>PID: {result.pid}</Text>
                  <Text style={styles.cardLabel}>Name: {result.name}</Text>
                  {result.image_urls && Array.isArray(result.image_urls) && result.image_urls.length > 0 ? (
                    <View style={styles.eyeImagesContainer}>
                      {result.image_urls.map((imageUrl, imgIndex) => (
                        <Image key={imgIndex} source={{ uri: imageUrl }} style={styles.eyeImage} />
                      ))}
                    </View>
                  ) : (
                    <Text>No images available</Text>
                  )}
                </TouchableOpacity>
              );
            } else {
              return null; // Skip rendering if name or PID is missing
            }
          })}
        </View>
      ) : (
        <Text>No results found.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fff',
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: 'skyblue', // Updated border color
    borderRadius: 10,
    padding: 10,
    margin: 5,
    backgroundColor: '#fff', // Added background color
    alignItems: 'center',
    width: 150, // Fixed width for uniform card size
    //height: 200,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    padding: 5,
    textAlign: 'left', // Align text to the left
    alignSelf: 'flex-start', // Align text to the start of its container
    width: '100%', // Ensure text takes full width of container
  },
  eyeImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  
  },
  eyeImage: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    margin: 5, // Add margin for space between images
    borderWidth: 1, // Add border width
    borderColor: 'skyblue', // Add border color
    borderRadius: 5, // Add border radius for a rounded border
  },
  patientDetailsContainer: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: '#fff', // Changed background color
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  subTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#555', // Changed color
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 10,
    width: '100%',
  },
  detailLabel: {
    fontWeight: 'bold',
    width: '40%',
    fontSize: 16,
    color: '#333',
  },
  detailValue: {
    width: '60%',
    fontSize: 16,
    color: '#555',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  patientImage: {
    width: 150,
    height: 150,
    margin: 5, // Add margin for space between images
    borderWidth: 1, // Add border width
    borderColor: 'skyblue', // Add border color
    borderRadius: 5, // Add border radius for a rounded border
  },
  eyeLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
    width: '100%',
    textAlign: 'center',
  },
});

export default PatientDataScreen;
