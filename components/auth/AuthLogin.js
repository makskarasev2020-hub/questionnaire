import * as yup from 'yup';

import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
} from 'react-native';
import React, { useState, useEffect } from 'react';

import AppButton from '../app/root/AppButton';
import AppInput from '../app/root/AppInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import ThemeConstants from '../../constants/Theme';
import { connect } from 'react-redux';
import { login } from '../../store/actions/auth';

const AuthLogin = ({
    theme,
    login,
    goToHome = () => { },
    setActiveComponent = () => { },
}) => {
    let [formValues, setFormValues] = useState({ email: '', password: '' });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Подгружаем сохраненный логин при запуске
    useEffect(() => {
        AsyncStorage.getItem('userLogin').then(value => {
            if (value) {
                setFormValues({ ...formValues, email: value });
            }
        });
    }, []);

    const handleLogin = async ({ email, password }) => {
        setIsLoading(true);

        // ВАЖНО: Здесь добавляется .ru для сервера
        login({
            email: email + '@promedcs.ru', 
            password,
            cb: () => {
                // Сохраняем только префикс почты
                AsyncStorage.setItem('userLogin', email);
                setIsLoading(false);
                goToHome();
                if (error) setError(null);
            },
            err: error => {
                setIsLoading(false);
                setError(error);
            },
            errNetwork: error => {
                if (error) setError(null);
                setIsLoading(false);
                Alert.alert('Упсс!', 'Отсутствует интернет соединение', [
                    { text: 'Вход без пароля', onPress: _handlerGoNoPassword },
                ]);
            },
        });
    };

    const _handlerGoNoPassword = () => {
        goToHome();
    };

    const validationSchema = yup.object().shape({
        email: yup.string().label('Email').required('Введите логин'),
        password: yup.string().label('Password').required('Введите пароль').min(4).max(20),
    });

    return (
        <View style={styles.container}>
            <Formik
                initialValues={formValues}
                enableReinitialize={true}
                onSubmit={(values) => {
                    handleLogin({
                        email: values.email,
                        password: values.password,
                    });
                }}
                validationSchema={validationSchema}>
                {formikProps => (
                    <View>
                        {/* Поле Ввода Почты + Домен */}
                        <View style={styles.inputRow}>
                            <View style={{ width: Dimensions.get('window').width - 180 }}>
                                <AppInput
                                    placholder="Почта"
                                    value={formikProps.values.email}
                                    onChange={formikProps.handleChange('email')}
                                    onBlur={formikProps.handleBlur('email')}
                                    isValid={
                                        !formikProps.errors.email || !formikProps.touched.email
                                    }
                                    style={{ color: '#000000' }}
                                />
                            </View>
                            
                            {/* Блок с доменом .ru */}
                            <View style={[styles.domainBox, { borderColor: ThemeConstants[theme].borderColor }]}>
                                <Text style={{ fontSize: 13, color: ThemeConstants[theme].text }}>
                                    @promedcs.ru
                                </Text>
                            </View>
                        </View>

                        {/* Поле Ввода Пароля */}
                        <View style={{ marginBottom: 40 }}>
                            <AppInput
                                value={formikProps.values.password}
                                placholder="Пароль"
                                onChange={formikProps.handleChange('password')}
                                onBlur={formikProps.handleBlur('password')}
                                isValid={
                                    !formikProps.errors.password || !formikProps.touched.password
                                }
                                secureTextEntry
                                style={{ color: '#000000' }}
                            />
                        </View>

                        {/* Кнопки */}
                        <View style={{ marginBottom: 15 }}>
                            <AppButton
                                text="Войти"
                                round
                                loading={isLoading}
                                onPress={formikProps.handleSubmit}
                            />
                        </View>
                        
                        <View style={{ marginBottom: 6 }}>
                            <AppButton
                                text="Зарегистрироваться"
                                round
                                onPress={() => setActiveComponent('Register')}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={() => setActiveComponent('ResetPassword')}
                            style={{ paddingTop: 9, paddingBottom: 25 }}>
                            <Text style={[styles.forgotPassword, { color: ThemeConstants[theme].text }]}>
                                Забыли пароль?
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>

            {!!error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
    login: payload => dispatch(login(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthLogin);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputRow: {
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    domainBox: {
        width: 110,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height: '100%',
        borderBottomWidth: 1,
    },
    forgotPassword: {
        textAlign: 'center',
        fontSize: 12,
    },
    errorText: {
        marginTop: 50,
        textAlign: 'center',
        fontSize: 16,
        color: 'red',
    },
});