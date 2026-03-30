import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {RootStackParamList} from './src/types';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import RecipeEntryScreen from './src/screens/RecipeEntryScreen';
import RecipeResultScreen from './src/screens/RecipeResultScreen';
import HealthifyResultScreen from './src/screens/HealthifyResultScreen';
import SavedRecipesScreen from './src/screens/SavedRecipesScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('jwt_token').then(token => {
      setInitialRoute(token ? 'Home' : 'Login');
    });
  }, []);

  if (!initialRoute) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#2d7a4f" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{
            headerStyle: {backgroundColor: '#2d7a4f'},
            headerTintColor: '#fff',
            headerTitleStyle: {fontWeight: '700'},
          }}>
          <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{title: 'Create Account'}} />
          <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
          <Stack.Screen name="RecipeEntry" component={RecipeEntryScreen} options={{title: 'New Recipe'}} />
          <Stack.Screen name="RecipeResult" component={RecipeResultScreen} options={{title: 'Review Recipe'}} />
          <Stack.Screen name="HealthifyResult" component={HealthifyResultScreen} options={{title: 'Healthified!'}} />
          <Stack.Screen name="SavedRecipes" component={SavedRecipesScreen} options={{title: 'Saved Recipes'}} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
