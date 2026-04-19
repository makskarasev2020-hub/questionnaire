import React, { useContext, useEffect } from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import AppHeaderRight from '../components/app/root/AppHeaderRight';
import AppNotAuth from '../components/app/root/AppNotAuth';
import ProfileResetPassword from '../components/profile/ProfileResetPassword';
import ProfileTemplate from '../components/profile/ProfileTemplate';
import ThemeConstants from '../constants/Theme';
import { ThemeContext } from '../context';
import { connect } from 'react-redux';

const ProfileScreen = ({ navigation, isAuthenticated, themeColors }) => {
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        navigation.setParams({
            theme: theme,
        });
    }, [theme]);

    return (
        <View style={[styles.container, { backgroundColor: '#fff' }]}>
            {/* Статус-бар с темными иконками для белого фона */}
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            
            <ScrollView
                contentContainerStyle={[
                    styles.contentContainer,
                    !isAuthenticated && { flex: 1 },
                ]}
                showsVerticalScrollIndicator={false}>
                
                {isAuthenticated ? (
                    <View>
                        {/* Принудительно задаем черный цвет заголовка, если он есть */}
                        <Text style={[styles.title, { color: themeColors.text }]}>
                            Настройки профиля
                        </Text>
                        
                        <ProfileResetPassword />

                        <View style={{ marginTop: 40 }}>
                            <ProfileTemplate />
                        </View>
                    </View>
                ) : (
                    // Если авторизация не распознана, показываем экран входа
                    <AppNotAuth />
                )}
            </ScrollView>
        </View>
    );
};

const mapStateToProps = state => {
    // Получаем цвета текущей темы
    const themeName = state.main.theme || 'men';
    const themeColors = ThemeConstants[themeName] || ThemeConstants['men'];

    return {
        // ИСПРАВЛЕНИЕ БАГА: 
        // Если флаг isAuthenticated сбросился после вылета, 
        // но токен (token) в памяти остался — считаем, что пользователь авторизован.
        isAuthenticated: state.auth.isAuthenticated || !!state.auth.token,
        token: state.auth.token,
        themeColors: themeColors
    };
};

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    contentContainer: {
        paddingHorizontal: 15,
        paddingVertical: 30,
    },

    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },

    notification: {
        width: '100%',
        height: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    notificationText: {
        width: '80%',
        marginTop: '20%',
        marginBottom: 30,
        textAlign: 'center',
        fontSize: 17,
    },

    icon: { color: '#DE7676', fontSize: 150 },
});