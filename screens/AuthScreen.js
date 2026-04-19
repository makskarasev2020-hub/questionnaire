import * as Animatable from 'react-native-animatable';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    View,
    Text,
    Alert,
    Linking,
    Platform,
} from 'react-native';
import React, { useContext, useState } from 'react';
import { getStatusBarHeight, ifIphoneX } from 'react-native-iphone-x-helper';

import AuthLogin from '../components/auth/AuthLogin';
import AuthResetPassword from '../components/auth/AuthResetPassword';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ThemeConstants from '../constants/Theme';
import { ThemeContext } from '../context';
import AuthRegister from '../components/auth/AuthRegister';
import { version } from '../const';
import httpClient from '../httpClient';

import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');
const releaseDateVersion = '20260330';

export default function LoginScreen() {
    const [activeComponent, setActiveComponent] = useState('Login');
    const navigation = useNavigation();
    const { theme } = useContext(ThemeContext);

    // Функция перехода на главный экран с проверкой версии
    const goToHome = () => {
        // Ссылки на файлы с актуальной версией
        const url_get =
            Platform.OS === 'ios'
                ? 'https://promedcs.ursosan.ru/download/vers.txt'
                : 'https://promedcs.ursosan.ru/download/vers1.txt';

        httpClient
            .get(url_get, {
                headers: {
                    'Cache-Control': 'no-cache',
                },
                timeout: 5000, // Устанавливаем таймаут 5 секунд
            })
            .then(({ data }) => {
                let url_upoad =
                    Platform.OS === 'ios'
                        ? 'https://promedcs.ursosan.ru/download'
                        : 'https://promedcs.ursosan.ru/download/promedcs.apk';

                // Если текущая версия приложения меньше версии на сервере
                if (version[Platform.OS] < data) {
                    Alert.alert(
                        'Доступно обновление',
                        'Чтобы пользоваться всеми функциями, рекомендуется скачать обновление. Продолжить в оффлайн-режиме?',
                        [
                            {
                                text: 'Скачать',
                                onPress: () => Linking.openURL(url_upoad),
                            },
                            {
                                text: 'Продолжить',
                                onPress: () => navigation.navigate('Main', { screen: 'Home' }),
                            },
                        ],
                    );
                } else {
                    // Версия актуальна — заходим
                    navigation.navigate('Main', {
                        screen: 'Home',
                    });
                }
            })
            .catch(error => {
                // КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ ДЛЯ АВИАРЕЖИМА:
                // Если сервер недоступен (нет интернета), не блокируем вход.
                // Просто переходим на главный экран в оффлайн-режиме.
                console.log('Проверка версии пропущена (оффлайн режим)');
                navigation.navigate('Main', {
                    screen: 'Home',
                });
            });
    };

    return (
        <KeyboardAwareScrollView extraScrollHeight={20} style={{backgroundColor: '#fff'}}>
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        {/* Иконка приложения */}
                        <View style={[styles.imageContainer]}>
                            <Icon
                                type="MaterialCommunityIcons"
                                name="account-group"
                                style={[styles.icon, { color: ThemeConstants[theme].text }]}
                            />
                        </View>

                        {/* Контейнер форм (Логин / Регистрация / Сброс) */}
                        <View style={styles.formContainer}>
                            {activeComponent === 'Login' ? (
                                <Animatable.View
                                    style={{ flex: 1 }}
                                    animation="fadeInRight"
                                    duration={500}
                                    useNativeDriver={true}>
                                    <AuthLogin
                                        theme={theme}
                                        goToHome={() => goToHome()}
                                        setActiveComponent={value => setActiveComponent(value)}
                                    />
                                </Animatable.View>
                            ) : activeComponent === 'Register' ? (
                                <Animatable.View
                                    style={{ flex: 1 }}
                                    animation="fadeInLeft"
                                    duration={500}
                                    useNativeDriver={true}>
                                    <AuthRegister
                                        theme={theme}
                                        goToHome={() => goToHome()}
                                        setActiveComponent={value => setActiveComponent(value)}
                                    />
                                </Animatable.View>
                            ) : (
                                <Animatable.View
                                    style={{ flex: 1 }}
                                    animation="fadeInLeft"
                                    duration={500}
                                    useNativeDriver={true}>
                                    <AuthResetPassword
                                        theme={theme}
                                        setActiveComponent={value => setActiveComponent(value)}
                                    />
                                </Animatable.View>
                            )}
                        </View>
                        <Text style={[styles.versionText, { color: ThemeConstants[theme].text }]}>
                            Версия {releaseDateVersion}
                        </Text>
                    </View>
                </ScrollView>
            </View>
        </KeyboardAwareScrollView>
    );
}

// Отключаем стандартный хедер навигации
LoginScreen.navigationOptions = {
    headerShown: false,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    content: {
        minHeight: height,
        paddingTop: ifIphoneX
            ? getStatusBarHeight() + 20
            : getStatusBarHeight() + 15,
        flex: 1,
    },

    icon: { color: '#DE7676', fontSize: 150 },

    imageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 20,
    },

    formContainer: {
        width: '100%',
        height: '48%',
        paddingHorizontal: 25,
    },

    forgotPassword: {
        textAlign: 'center',
        fontSize: 12,
        color: '#DE7676',
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        opacity: 0.6,
        marginBottom: 16,
    },
});
