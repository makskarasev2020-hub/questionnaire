import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="AuthLoading"
                screenOptions={{
                    headerShown: false,
                    presentation: 'modal'
                }}
            >
                <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
                <Stack.Screen name="Auth" component={AuthNavigator} />
                <Stack.Screen name="Main" component={MainNavigator}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}