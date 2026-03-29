import React from 'react';
import {StatusBar, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaFrameContext, SafeAreaInsetsContext} from 'react-native-safe-area-context';
import {FundListScreen} from './src/screens/FundListScreen';
import {CompareScreen} from './src/screens/CompareScreen';
import {colors} from './src/constants/colors';
import {FALLBACK_SAFE_AREA_FRAME, FALLBACK_SAFE_INSETS} from './src/constants/safeArea';

const Stack = createStackNavigator();

export default function App() {
  return (
    <View style={{flex: 1, backgroundColor: colors.bg}}>
      <SafeAreaFrameContext.Provider value={FALLBACK_SAFE_AREA_FRAME}>
        <SafeAreaInsetsContext.Provider value={FALLBACK_SAFE_INSETS}>
          <NavigationContainer>
            <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
            <Stack.Navigator>
              <Stack.Screen name="FundList" component={FundListScreen} options={{title: '基金对比'}} />
              <Stack.Screen name="Compare" component={CompareScreen} options={{headerShown: false}} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaInsetsContext.Provider>
      </SafeAreaFrameContext.Provider>
    </View>
  );
}
