import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import ImageScreen from './screens/ImageScreen';
import PatientDataScreen from './screens/PatientDataScreen'; 
import EditPatientDataScreen from './screens/EditPatientDataScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#007bff', // Set background color of the header to blue
      },
      headerTintColor: '#ffffff', // Set text color of the header to white
    }}
  >
    <Stack.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{ 
        title: 'Main Home', 
        headerShown: false // Hide the header for the Home screen 
      }} 
    />
    <Stack.Screen 
      name="Patient Data" 
      component={PatientDataScreen} 
    />
    <Stack.Screen 
      name="Edit Patient Data" 
      component={EditPatientDataScreen} 
    />

    
  </Stack.Navigator>
);

const App = () => {
  return (
    <NavigationContainer initialRouteName="Main Home"> 
<Tab.Navigator
  screenOptions={{
    tabBarActiveTintColor: '#007bff',
    tabBarInactiveTintColor: '#999999',
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    tabBarStyle: {
      backgroundColor: '#000000', // Set background color to black
      borderTopWidth: 1,
      borderTopColor: '#cccccc',
      display: 'flex',
    },
  }}
>
  <Tab.Screen
    name="Image"
    component={ImageScreen}
    options={{
      tabBarIcon: ({ color, size }) => (
        <AntDesign name="picture" size={size} color={color} />
      ),
    }}
  />
  <Tab.Screen
    name="Main Home"
    component={AppNavigator} // Assuming MainHomeScreen is included in AppNavigator
    options={{
      tabBarIcon: ({ color, size }) => (
        <AntDesign name="home" size={size} color={color} />
      ),
    }}
  />
  <Tab.Screen
    name="Report"
    component={DetailScreen} // Assuming ReportScreen is the correct component name
    options={{
      tabBarIcon: ({ color, size }) => (
        <AntDesign name="profile" size={size} color={color} />
      ),
    }}
  />
</Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;