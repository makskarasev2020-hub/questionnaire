import AuthScreen from '../screens/AuthScreen';
import { Platform } from 'react-native';
import React from 'react';
import TabBarIcon from '../components/TabBarIcon';
import { createStackNavigator } from '@react-navigation/stack';

const config = Platform.select({
    web: { headerMode: 'screen' },
    default: {},
});

const Stack = createStackNavigator();

function AuthStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                headerBackTitle: Platform.OS === 'web' ? undefined : 'Назад',
            }}>
            <Stack.Screen name="Auth" component={AuthScreen} />
        </Stack.Navigator>
    );
}

export default function RootStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                headerBackTitle: Platform.OS === 'web' ? undefined : 'Назад',
            }}
        >
            <Stack.Screen
                name="AuthStack"
                component={AuthStack}
                options={{
                    tabBarLabel: 'Login',
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon
                            component="Ionicons"
                            focused={focused}
                            name={
                                Platform.OS === 'ios'
                                    ? `information-circle${focused ? '' : '-outline'}`
                                    : 'information-circle'
                            }
                        />
                    ),
                }}
            />
        </Stack.Navigator>
    );
}
