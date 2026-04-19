import { ScrollView, StyleSheet, View, StatusBar, ActivityIndicator, FlatList, Alert, TouchableOpacity } from 'react-native';
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AppNotAuth from '../components/app/root/AppNotAuth';
import AppHeaderRight from '../components/app/root/AppHeaderRight';
import PastCard from '../components/past/PastCard';
import Text from '../components/Text'; 
import { ThemeContext } from '../context';
import { saveAuthToken } from '../store/actions/auth'; 
import { loadQuestionPast } from '../store/actions/question';

const HistoriesScreen = ({ 
    isAuthenticated, 
    reduxToken, 
    saveAuthToken, 
    loadQuestionPast, 
    questionLoading 
}) => {
    const { theme } = useContext(ThemeContext);
    const [historyData, setHistoryData] = useState([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    // ФУНКЦИЯ ДЕБАГА (Вызывается при нажатии кнопки по центру)
    const runDebug = async () => {
        try {
            const sToken = await AsyncStorage.getItem('userToken');
            const nSend = await AsyncStorage.getItem('answersNotSend');
            
            let report = `--- SYSTEM CHECK ---\n`;
            report += `1. Storage Token: ${sToken ? 'OK (Есть)' : 'MISSING (Нету!)'}\n`;
            report += `2. Redux Auth: ${isAuthenticated ? 'TRUE' : 'FALSE'}\n`;
            report += `3. Redux Token: ${reduxToken ? 'OK (Есть)' : 'EMPTY (Пусто)'}\n`;
            
            const res = await loadQuestionPast(1);
            report += `4. Server Data: ${res?.answers ? 'Пришли данные (' + res.answers.length + ')' : 'Сервер вернул пустоту'}\n`;
            
            Alert.alert("ОТЧЕТ ОТЛАДКИ", report);
            
            // Если токен есть, а Redux пустой - чиним прямо здесь
            if (sToken && !reduxToken) {
                saveAuthToken(sToken);
            }
            
            if (res?.answers) {
                setHistoryData(res.answers.filter(i => i !== null));
            }
        } catch (err) {
            Alert.alert("ОШИБКА", err.message);
        }
    };

    useEffect(() => {
        const init = async () => {
            const token = await AsyncStorage.getItem('userToken');
            if (token && !reduxToken) {
                saveAuthToken(token);
            }
            const res = await loadQuestionPast(1);
            if (res?.answers) {
                setHistoryData(res.answers.filter(i => i !== null));
            }
            setIsInitialLoading(false);
        };
        init();
    }, []);

    const loggedIn = isAuthenticated || !!reduxToken;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            
            {loggedIn ? (
                <View style={{ flex: 1 }}>
                    {historyData.length > 0 ? (
                        <FlatList
                            data={historyData}
                            contentContainerStyle={styles.contentContainer}
                            keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.item}>
                                    <PastCard
                                        title={item?.title}
                                        status={item?.status_name}
                                        id={item?.id}
                                        createdAt={item?.created_at}
                                        onSend={() => {}} 
                                    />
                                </View>
                            )}
                        />
                    ) : (
                        // ЦЕНТРАЛЬНАЯ КНОПКА ЕСЛИ ПУСТО
                        <View style={styles.centerContainer}>
                            <Text style={styles.emptyText}>Здесь еще пусто!</Text>
                            <TouchableOpacity style={styles.debugButton} onPress={runDebug}>
                                <Text style={styles.debugButtonText}>ПРОВЕРИТЬ ЛОГИ И ОБНОВИТЬ</Text>
                            </TouchableOpacity>
                            {questionLoading && <ActivityIndicator style={{marginTop: 20}} color="red" />}
                        </View>
                    )}
                </View>
            ) : (
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    <AppNotAuth />
                </View>
            )}
        </View>
    );
};

HistoriesScreen.navigationOptions = ({ navigation }) => ({
    headerStyle: { backgroundColor: '#DE7676' },
    headerTitle: <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Прошедшие</Text>,
    headerRight: () => <AppHeaderRight />,
});

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    reduxToken: state.auth.token,
    questionLoading: state.question.main.questionLoading,
});

const mapDispatchToProps = dispatch => ({
    saveAuthToken: (token) => dispatch(saveAuthToken(token)),
    loadQuestionPast: (page) => dispatch(loadQuestionPast(page)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HistoriesScreen);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    contentContainer: { paddingTop: 15, paddingHorizontal: 15, paddingBottom: 50 },
    item: { marginBottom: 15 },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    emptyText: {
        fontSize: 20,
        marginBottom: 30,
        color: '#000'
    },
    debugButton: {
        backgroundColor: 'red',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
    },
    debugButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center'
    }
});