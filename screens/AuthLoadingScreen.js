import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { getUserData, saveAuthToken, saveAuthUserData } from '../store/actions/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemeConstants from '../constants/Theme';
import { ThemeContext } from '../context';
import { connect } from 'react-redux';

const AuthLoadingScreen = ({ navigation, saveAuthToken, saveAuthUserData, getUserData }) => {
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // 1. Достаем токен и данные пользователя из "жесткой" памяти
        const userToken = await AsyncStorage.getItem('userToken');
        const userDataRaw = await AsyncStorage.getItem('userData');

        if (userToken) {
          // 2. СРАЗУ записываем токен в Redux (isAuthenticated станет true)
          saveAuthToken(userToken);

          // 3. СРАЗУ восстанавливаем ID пользователя из кэша
          // Это решение проблемы "Ответ сервера 0" - теперь userId не будет undefined
          if (userDataRaw) {
              const userData = JSON.parse(userDataRaw);
              saveAuthUserData(userData);
          }

          // 4. МГНОВЕННО переходим в приложение
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });

          // 5. ФОНОВОЕ ОБНОВЛЕНИЕ: актуализируем профиль с сервера
          // Если интернета нет (авиарежим), сработает .catch в экшене и мы просто продолжим работу
          getUserData({
            token: userToken,
            cb: (status) => {
              if (status === false) {
                 // Если токен совсем протух (сервер вернул 401), можно выкинуть на логин
                 // Но наш экшен getUserData теперь защищен от ошибок сети (возвращает true)
              }
            },
          });

        } else {
          // 6. Если токена нет — полная очистка и на логин
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('userData');
          await AsyncStorage.removeItem('questionPast');
          
          navigation.reset({
            index: 0,
            routes: [{ name: 'Auth' }],
          });
        }
      } catch (e) {
        console.error("Ошибка при загрузке сессии:", e);
        navigation.navigate('Auth');
      }
    };

    bootstrapAsync();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ActivityIndicator
        size="large"
        color={ThemeConstants[theme]?.activityIndicator || '#DE7676'}
      />
    </View>
  );
};

const mapStateToProps = state => ({
  token: state.auth.token,
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = dispatch => ({
  getUserData: payload => dispatch(getUserData(payload)),
  saveAuthToken: payload => dispatch(saveAuthToken(payload)),
  saveAuthUserData: payload => dispatch(saveAuthUserData(payload)), // Добавили сохранение данных
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', 
  },
});