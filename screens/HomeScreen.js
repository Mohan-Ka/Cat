import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; // Import icons from Expo

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleViewPatientData = () => {
    navigation.navigate('Patient Data');
  };

  const handleEditPatientData = () => {
    navigation.navigate('Edit Patient Data');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.section} onPress={handleViewPatientData}>
        <MaterialIcons name="visibility" size={24} color="black" />
        <Text style={styles.sectionText}>View Patient Data</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.section} onPress={handleEditPatientData}>
        <MaterialIcons name="edit" size={24} color="black" />
        <Text style={styles.sectionText}>Edit Patient Data</Text>
      </TouchableOpacity>
    </View>
  );
};

HomeScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: 'Main Home',
  headerRight: () => (
    <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('Main Home')}>
      <MaterialIcons name="home" size={24} color="black" />
    </TouchableOpacity>
  ),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0', // Add background color
  },
  section: {
    flexDirection: 'row', // Align icon and text horizontally
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0', // Lighter border color
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Add background color
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10, // Add space between icon and text
  },
  headerIcon: {
    marginRight: 15,
  },
});

export default HomeScreen;
