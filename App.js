import {
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text, // Импортируем стандартный текст
    TextInput, // Импортируем ввод
    View,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import AppNavigator from './navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LayoutsDefault from './layouts/LayoutsDefault';
import { Provider } from 'react-redux';
import { ThemeContext } from './context';
import store from './store/index';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { loadCacheIndex } from './utils/imageCache';

// --- ГЛОБАЛЬНАЯ НАСТРОЙКА ТЕКСТА ---
// Этот код заставляет ВЕСЬ текст в приложении быть черным по умолчанию
// и игнорировать системные настройки темной темы.
if (Text.defaultProps) {
    Text.defaultProps.style = { color: '#000000' };
} else {
    Text.defaultProps = { style: { color: '#000000' } };
}

if (TextInput.defaultProps) {
    TextInput.defaultProps.style = { color: '#000000' };
} else {
    TextInput.defaultProps = { style: { color: '#000000' } };
}
// ----------------------------------

const lightTheme = {
    ...MD3LightTheme,
    dark: false,
    colors: {
        ...MD3LightTheme.colors,
        background: '#ffffff',
        surface: '#ffffff',
        onSurface: '#000000', // Цвет текста для Paper компонентов
        onSurfaceVariant: '#000000', // Цвет текста для подписей
    },
};

const App = () => {
    const [theme, setTheme] = useState('men');
    const [cacheReady, setCacheReady] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem('designTemplate').then(value => {
            if (value) {
                setTheme(value);
            }
        });
        loadCacheIndex().finally(() => setCacheReady(true));
    }, []);

    if (!cacheReady) return null;

    return (
        <Provider store={store}>
            <PaperProvider theme={lightTheme}>
                <View style={styles.container}>
                    {/* Принудительно темные иконки в статус-баре */}
                    <StatusBar 
                        barStyle="dark-content" 
                        backgroundColor="#ffffff" 
                        translucent={false} 
                    />

                    <LayoutsDefault>
                        <ThemeContext.Provider
                            value={{ theme, changeTheme: theme => setTheme(theme) }}>
                            <AppNavigator />
                        </ThemeContext.Provider>
                    </LayoutsDefault>
                </View>
            </PaperProvider>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // Принудительно белый фон всего приложения
        backgroundColor: '#ffffff',
    },
});

export default App;