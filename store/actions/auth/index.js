import {
    DELETE_AUTH_USER_DATA,
    SAVE_AUTH_TOKEN,
    SAVE_AUTH_USER_DATA,
} from '../../action-types';

import AsyncStorage from '@react-native-async-storage/async-storage';
import httpClient from '../../../httpClient';

// РЕГИСТРАЦИЯ
export const register = ({
    name,
    fullName,
    email,
    password,
    cb,
    err = () => { },
}) => {
    return (dispatch, getState) => {
        const { main: { domen } } = getState();
        const url = `${domen}/api/register`;

        httpClient
            .post(url, { first_name: name, last_name: fullName, email, password })
            .then(async (response) => {
                if (response.data && response.data.status) {
                    const token = response.data.token;
                    const userData = response.data;

                    // КЭШИРУЕМ ВСЁ: и токен, и данные пользователя
                    await AsyncStorage.setItem('userToken', token);
                    await AsyncStorage.setItem('userData', JSON.stringify(userData));
                    
                    // Чистим старые опросы
                    await AsyncStorage.removeItem('questionPast');
                    await AsyncStorage.removeItem('answersNotSend');

                    dispatch(saveAuthToken(token));
                    dispatch(saveAuthUserData(userData));

                    cb();
                } else {
                    err('Такой логин уже занят.');
                }
            })
            .catch(e => {
                err(e.response ? Object.values(e.response.data).join('\n') : 'Отсутствует интернет соединение');
            });
    };
};

// ЛОГИН (С жестким кэшированием ID пользователя)
export const login = ({ email, password, cb, err = () => { } }) => {
    return (dispatch, getState) => {
        const { main: { domen } } = getState();
        const url = `${domen}/api/login`;

        httpClient
            .post(url, { email, password })
            .then(async (response) => {
                if (response.data && response.data.status) {
                    const token = response.data.token;
                    const userData = response.data.user || response.data;

                    // СОХРАНЯЕМ В ПАМЯТЬ ТЕЛЕФОНА
                    // Теперь после краша мы мгновенно восстановим userId из userData
                    await AsyncStorage.setItem('userToken', token);
                    await AsyncStorage.setItem('userData', JSON.stringify(userData));
                    
                    // Чистим кэш опросов для новой сессии
                    await AsyncStorage.removeItem('questionPast');
                    await AsyncStorage.removeItem('answersNotSend');

                    dispatch(saveAuthToken(token));
                    dispatch(saveAuthUserData(userData));

                    cb();
                } else {
                    err('Не удалось найти пользователя. Проверьте логин или пароль.');
                }
            })
            .catch(error => {
                err(error?.response?.data?.message || 'Отсутствует интернет соединение');
            });
    };
};

// ПОЛУЧЕНИЕ ДАННЫХ (Защита от оффлайна)
export const getUserData = ({ token, cb }) => {
    return (dispatch, getState) => {
        const { main: { domen } } = getState();
        const url = `${domen}/api/users/${token}`;

        httpClient
            .get(url)
            .then(async (response) => {
                if (response.data && response.data.status) {
                    // Обновляем кэш профиля в памяти телефона
                    await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
                    
                    dispatch(saveAuthUserData(response.data.user));
                    cb(true);
                } else {
                    cb(false);
                }
            })
            .catch(err => {
                // КРИТИЧЕСКИ ВАЖНО ДЛЯ АВИАРЕЖИМА: 
                // Если интернета нет, мы НЕ выходим из системы!
                console.log('Оффлайн: данные профиля не обновлены, работаем на кэше');
                cb(true); 
            });
    };
};

// СБРОС ПАРОЛЯ
export const resetPassword = ({ email, cb, err }) => {
    return (dispatch, getState) => {
        const { main: { domen } } = getState();
        httpClient.post(`${domen}/api/resetpass`, { email })
            .then(res => { if (res.status === 200) cb(); })
            .catch(() => err('Пользователь не найден.'));
    };
};

// СМЕНА ПАРОЛЯ
export const resetPasswordAuth = ({ oldPassword, newPassword, cb, err }) => {
    return (dispatch, getState) => {
        const { main: { domen }, auth: { token } } = getState();
        const url = `${domen}/api/password/change`;

        httpClient.post(url, 
            { old_password: oldPassword, new_password: newPassword },
            { headers: { Authorization: 'Bearer ' + token } }
        )
        .then(async (res) => {
            if (res.data.status) {
                await AsyncStorage.setItem('userToken', res.data.token);
                dispatch(saveAuthToken(res.data.token));
                cb();
            } else {
                err('Старый пароль неверный.');
            }
        })
        .catch(() => err('Ошибка при смене пароля.'));
    };
};

// ЭКШЕНЫ
export const saveAuthToken = payload => ({
    type: SAVE_AUTH_TOKEN,
    payload,
});

export const saveAuthUserData = payload => ({
    type: SAVE_AUTH_USER_DATA,
    payload,
});

// ЛОГАУТ (Полная очистка кэша)
export const deleteAuthUserData = payload => {
    return async (dispatch) => {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userData');
        await AsyncStorage.removeItem('questionPast');
        await AsyncStorage.removeItem('answersNotSend');

        dispatch({
            type: DELETE_AUTH_USER_DATA,
            payload,
        });
    };
};