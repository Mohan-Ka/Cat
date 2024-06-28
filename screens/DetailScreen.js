import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Image, StyleSheet, ActivityIndicator, Dimensions, Alert } from 'react-native';
import database from '@react-native-firebase/database'; // Import Firebase Realtime Database
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import * as Permissions from 'expo-permissions';


const windowWidth = Dimensions.get('window').width;

const DetailScreen = () => {
  const [pid, setPid] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [dob, setDob] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const snapshot = await database().ref(`/${pid}`).once('value');
      const fetchedData = snapshot.val();
      if (fetchedData) {
        setData(fetchedData);
        setLocation(fetchedData.location);
        setBloodGroup(fetchedData.bloodGroup);
        setDob(fetchedData.dob);
      } else {
        setData(null);
        setLocation('');
        setBloodGroup('');
        setDob('');
        Alert.alert('Error', 'Data not found for this ID');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
    }
  };

  const downloadData = async () => {
    try {
      if (!data) {
        Alert.alert('Error', 'No data to download');
        return;
      }

      const { status } = await Permissions.askAsync(Permissions.WRITE_EXTERNAL_STORAGE);
      if (status !== 'granted') {
        // Permission not granted, show alert
        Alert.alert(
          'Permission Required',
          'Please grant permission to write files to the device\'s storage.',
          [{ text: 'OK', onPress: () => console.log('Permission request dismissed') }]
        );
        return;
      }
  
      // Define the HTML content for the PDF
      const htmlContent = `
        <html>
          <body>
            <h1>Patient Report</h1>
            <p>PID: ${data.pid}</p>
            <p>Name: ${data.name}</p>
            <p>Age: ${data.age}</p>
            <p>Sex: ${data.sex}</p>
            <p>Blood Group: ${bloodGroup}</p>
            <p>DOB: ${dob}</p>
            <p>Location: ${location}</p>
            <p>Timestamp: ${data.timestamp}</p>
            ${renderGradeRight() ? `<p>${renderGradeRight()}</p>` : ''}
            ${renderGradeLeft() ? `<p>${renderGradeLeft()}</p>` : ''}
            ${data.image_urls && Array.isArray(data.image_urls) ? 
              data.image_urls.map(imageUrl => `<img src="${imageUrl}" />`).join('') 
              : ''
            }
          </body>
        </html>
      `;

      const htmlContentt = `
      <html>
        <body>
          <h1>Patient Report</h1>
  
        </body>
      </html>
    `;
  
      // Generate the PDF
      const options = {
        html: htmlContentt,
        fileName: `patient_report_${pid}`,
        directory: 'Downloads',
      };
  
      const file = await RNHTMLtoPDF.convert(options);
      console.log('path',file)
      if (file.filePath) {
        console.log('PDF saved at:', file.filePath);
        Alert.alert('Success', 'PDF generated successfully');
      } else {
        console.log('path',file.filePath)
        console.error('Error generating PDF:', file.error);
        Alert.alert('Error', 'Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF');
    }
  };
  
  const renderGradeRight = () => {
    if (!data || !data.grade_R || !data.rightEyeCataractTypes) return null;

    const { grade_R, rightEyeCataractTypes } = data;
    const cataractTypes = Array.isArray(rightEyeCataractTypes) ? rightEyeCataractTypes.join(", ") : rightEyeCataractTypes;


    return (
      <View style={styles.formRow}>
        {grade_R === rightEyeCataractTypes ? (
          <>
            <Text style={styles.formLabel}>Grade (Right Eye):</Text>
            <Text style={styles.formData}>{grade_R}</Text>
          </>
        ) : (
          <>
            <Text style={styles.formLabel}>Cataract (Right Eye):</Text>
            <Text style={styles.formData}>{cataractTypes}</Text>
          </>
        )}
      </View>
    );
  };

  const renderGradeLeft = () => {
    if (!data || !data.grade_L || !data.leftEyeCataractTypes) return null;

    const { grade_L, leftEyeCataractTypes } = data;
    const cataractTypes = Array.isArray(leftEyeCataractTypes) ? leftEyeCataractTypes.join(", ") : leftEyeCataractTypes;

    return (
      <View style={styles.formRow}>
        {grade_L === leftEyeCataractTypes ? (
          <>
            <Text style={styles.formLabel}>Grade (Left Eye):</Text>
            <Text style={styles.formData}>{grade_L } </Text>
          </>
        ) : (
          <>
            <Text style={styles.formLabel}>Cataract (Left Eye):</Text>
            <Text style={styles.formData}> {cataractTypes} </Text>
          </>
        )}
      </View>
    );
  };

  const renderReport = () => {
    if (!data) return null;

    return (
      <View style={styles.reportContainer}>
        <View style={styles.formBorder}>
          <Text style={styles.formTitle}>
            <Text style={styles.underline}>CataractCare</Text>
          </Text>
          <Text style={styles.formTitle}>Patient Report</Text>
          <View style={styles.formContent}>
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>PID:</Text>
              <Text style={styles.formData}>{data.pid}</Text>
            </View>
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Name:</Text>
              <Text style={styles.formData}>{data.name}</Text>
            </View>
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Age:</Text>
              <Text style={styles.formData}>{data.age}</Text>
            </View>
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Sex:</Text>
              <Text style={styles.formData}>{data.sex}</Text>
            </View>
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Blood Group:</Text> 
              <Text style={styles.formData}>{bloodGroup}</Text>
            </View>
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>DOB:</Text> 
              <Text style={styles.formData}>{dob}</Text>
            </View>
            {renderGradeRight()}
            {renderGradeLeft()}
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Location:</Text>
              <Text style={styles.formData}>{location}</Text>
            </View>
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Timestamp:</Text>
              <Text style={styles.formData}>{data.timestamp}</Text>
            </View>
            
            {data.image_urls && Array.isArray(data.image_urls) && (
              <View style={styles.imageContainer}>
                {data.image_urls.map((imageUrl, index) => (
                  <View key={index} style={[styles.imageItem, { marginRight: index % 2 === 0 ? 10 : 0 }]}>
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                    <Text style={styles.label}>{index % 2 === 0 ? 'Left' : 'Right'}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Get Data by PID</Text>
      <TextInput
        placeholder="Enter PID"
        value={pid}
        onChangeText={setPid}
        style={styles.input}
      />
      <Button title="Fetch Data" onPress={fetchData} color="#000000" />
      {loading ? (
        <ActivityIndicator size="large" color="#000000" />
      ) : (
        <>
          {renderReport()}
          
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    color: '#333333',
  },
  buttonContainer: {
    marginTop: 20,
  },
  reportContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  formBorder: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  formContent: {
    width: '100%',
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  formLabel: {
    width: '40%',
    fontWeight: 'bold',
  },
  formData: {
    width: '60%',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 10,
  },
  imageItem: {
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: (windowWidth - 150) / 2,
    height: 150,
    borderWidth: 1,
    borderColor: 'black',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default DetailScreen;
