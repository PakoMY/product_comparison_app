import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {FundListScreen} from './src/screens/FundListScreen';
import {CompareScreen} from './src/screens/CompareScreen';
import {colors} from './src/constants/colors';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
        <Stack.Navigator>
          <Stack.Screen
            name="FundList"
            component={FundListScreen}
            options={{title: '基金对比'}}
          />
          <Stack.Screen
            name="Compare"
            component={CompareScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
