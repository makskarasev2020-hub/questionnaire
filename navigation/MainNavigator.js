import MainTabNavigator from './MainTabNavigator';
import QuestionsScreen from '../screens/QuestionsScreen';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function MainStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                presentation: 'modal',
            }}
        >
            <Stack.Screen name="MainTab" component={MainTabNavigator} />
            <Stack.Screen
                name="Questions"
                component={QuestionsScreen}
                options={{
                    gestureEnabled: false,
                }}
            />
        </Stack.Navigator>
    );
}
