import React from 'react';
import { Platform, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '../screens/HomeScreen';
import PollListScreen from '../screens/PollListScreen';
import PastScreen from '../screens/PastScreen';
import NoPastScreen from '../screens/NoPastScreen';

import ProfileScreen from '../screens/ProfileScreen';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';


import AppHeaderRight from '../components/app/root/AppHeaderRight';
import ThemeConstants from '../constants/Theme';
import { ThemeContext } from '../context';

import TabBar from '../components/TabBar';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                headerBackTitle: Platform.OS === 'web' ? undefined : 'Назад',
            }}
        >
            <Stack.Screen name="Home" component={HomeScreen}
                options={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor:
                            ThemeConstants[ThemeContext._currentValue.theme]?.background || '#000',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontSize: 20,
                        fontWeight: 'bold',
                    },
                    headerTitle: () => <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Папки</Text>,
                    headerRight: () => (
                        <View >
                            <AppHeaderRight />
                        </View>
                    ),
                }} />
            <Stack.Screen name="PollList" component={PollListScreen} options={({ route, navigation }) => ({
                headerShown: true,
                headerTintColor: 'white',
                headerStyle: {
                    backgroundColor:
                        ThemeConstants[ThemeContext._currentValue.theme].background,
                },
                headerTitle: () => (
                    <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
                        {route.params?.folderName || 'Poll list'}
                    </Text>
                ),
                headerRight: () => (
                    <View>
                        <AppHeaderRight />
                    </View>
                ),
            })} />
        </Stack.Navigator>
    );
}

function PastStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
            }}
        >
            <Stack.Screen name="Past" component={PastScreen} options={({ route, navigation }) => ({
                headerStyle: {
                    backgroundColor:
                        ThemeConstants[ThemeContext._currentValue.theme].background,
                },
                headerTitle: () => <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
                    Прошедшие
                </Text>,
                headerRight: () => (
                    <View>
                        <AppHeaderRight />
                    </View>
                ),
            })} />
        </Stack.Navigator>
    );
}

function NoPastStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
            }}
        >
            <Stack.Screen name="NoPast" component={NoPastScreen} options={({ route, navigation }) => ({
                headerStyle: {
                    backgroundColor:
                        ThemeConstants[ThemeContext._currentValue.theme].background,
                },
                headerTitle: () => <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
                    К отправке
                </Text>,
                headerRight: () => (
                    <View>
                        <AppHeaderRight />
                    </View>
                ),
            })} />
        </Stack.Navigator>
    );
}

function ProfileStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
                headerBackTitle: Platform.OS === 'web' ? undefined : 'Назад',
            }}
        >
            <Stack.Screen name="Profile" component={ProfileScreen} options={({ route, navigation }) => ({
                headerStyle: {
                    backgroundColor:
                        ThemeConstants[ThemeContext._currentValue.theme].background,
                },
                headerTitle: () => <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Профиль</Text>,
                headerRight: () => (
                    <View>
                        <AppHeaderRight />
                    </View>
                ),
            })} />
        </Stack.Navigator>
    );
}

export default function TabNavigator() {
    return (
        <Tab.Navigator
            tabBar={(props) => <TabBar {...props} />}
            screenOptions={({ route }) => ({
                tabBarAccessibilityLabel: route.name,
                headerShown: false,
                tabBarLabel: route.name,
                tabBarIcon: ({ focused }) => {
                    let iconName;
                    switch (route.name) {
                        case 'Home':
                            iconName = 'home-outline';
                            break;
                        case 'NoPast':
                            iconName = 'playlist-minus';
                            break;
                        case 'Past':
                            iconName = 'playlist-check';
                            break;
                        case 'Profile':
                            iconName = 'account-circle-outline';
                            break;
                        default:
                            iconName = 'home-outline';
                    }

                    return (
                        <Icon
                            style={{ color: '#fff', fontSize: 22 }}
                            type="MaterialCommunityIcons"
                            name={iconName}
                        />
                    );
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeStack}
                options={{
                    tabBarLabel: 'Главная',
                }}
            />
            <Tab.Screen
                name="NoPast"
                component={NoPastStack}
                options={{
                    tabBarLabel: 'К отправке',
                }}
            />
            <Tab.Screen
                name="Past"
                component={PastStack}
                options={{
                    tabBarLabel: 'Прошедшие',
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileStack}
                options={{
                    tabBarLabel: 'Профиль',
                }}
            />
        </Tab.Navigator>
    );
}
