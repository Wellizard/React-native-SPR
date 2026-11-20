import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ReportProvider } from './AppContext';
import { C } from './theme';
import HomeScreen from './screens/HomeScreen';
import ConditionsScreen from './screens/ConditionsScreen';
import DateTimeScreen from './screens/DateTimeScreen';
import ParticipantsScreen from './screens/ParticipantsScreen';
import LocationScreen from './screens/LocationScreen';
import SketchScreen from './screens/SketchScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ReportProvider>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: C.blue },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '700' },
            headerBackTitle: 'Назад',
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Conditions" component={ConditionsScreen} options={{ title: 'Умови оформлення' }} />
          <Stack.Screen name="DateTime" component={DateTimeScreen} options={{ title: 'Дата та час' }} />
          <Stack.Screen name="Participants" component={ParticipantsScreen} options={{ title: 'Учасники' }} />
          <Stack.Screen name="Location" component={LocationScreen} options={{ title: 'Місце події' }} />
          <Stack.Screen name="Sketch" component={SketchScreen} options={{ title: 'Схема ДТП' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ReportProvider>
  );
}