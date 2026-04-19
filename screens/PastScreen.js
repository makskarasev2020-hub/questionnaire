import {
    Alert,
    FlatList,
    StatusBar,
    StyleSheet,
    ActivityIndicator,
    View,
    TouchableOpacity
} from 'react-native';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Импортируем для дебага
// Импортируем ваш кастомный Текст, который мы сделали черным
import Text from '../components/Text'; 
import {
    loadQuestionPast,
    sendAnswerNotSend,
} from '../store/actions/question';

import AppNotAuth from '../components/app/root/AppNotAuth';
import PastCard from '../components/past/PastCard';
import ThemeConstants from '../constants/Theme';
import { ThemeContext } from '../context';
import { connect } from 'react-redux';
import Pagination from '../components/Pagination';

const PastScreen = ({
    navigation,
    isAuthenticated, 
    reduxToken, // Добавили для дебага
    sendAnswerNotSend,
    loadQuestionPast,
    questionLoading,
}) => {
    const { theme } = useContext(ThemeContext);
    const [answers, setAnswers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // --- ФУНКЦИЯ ГЛОБАЛЬНОЙ ОТЛАДКИ ---
    const runFullDebug = async () => {
        try {
            const sToken = await AsyncStorage.getItem('userToken');
            
            let report = `--- HARD DEBUG (PastScreen) ---\n`;
            report += `1. Кэш Токена в телефоне: ${sToken ? 'ЕСТЬ' : 'НЕТУ'}\n`;
            report += `2. Redux Auth (флаг): ${isAuthenticated ? 'TRUE' : 'FALSE'}\n`;
            report += `3. Redux Token (строка): ${reduxToken ? 'ЕСТЬ' : 'НЕТ'}\n`;
            
            // Проверка загрузки данных
            const res = await loadQuestionPast(currentPage);
            report += `4. Ответ сервера: ${res?.answers ? 'ОК (' + res.answers.length + ' шт)' : 'ПУСТО/ОШИБКА'}\n`;
            
            Alert.alert("LOG REPORT", report);
        } catch (err) {
            Alert.alert("CRITICAL ERR", err.message);
        }
    };

    const loadData = useCallback(async () => {
        try {
            const response = await loadQuestionPast(currentPage);
            if (response && response.answers) {
                setTotalPages(Math.ceil((response.total || 0) / 10));
                const formattedAnswers = response.answers
                    .filter(q => q !== null && q !== undefined) 
                    .map(question => ({
                        title: question?.title || 'Без названия',
                        userId: question?.user_id,
                        answers: question?.result,
                        questionnaireId: question?.questionnaire_id,
                        status: question?.status_name || 'Завершен',
                        id: question?.id,
                        createdAt: question?.created_at,
                    }));
                setAnswers(formattedAnswers);
            } else {
                setAnswers([]);
            }
        } catch (error) {
            setAnswers([]);
        }
    }, [currentPage, loadQuestionPast]);

    useEffect(() => {
        navigation.setParams({ theme });
    }, [theme]);

    useEffect(() => {
        if (isAuthenticated) {
            loadData();
        }
    }, [currentPage, isAuthenticated, loadData]);

    const _onSend = (item) => {
        if (!item || !item.answers) return;
        sendAnswerNotSend({
            questionnaireId: item.questionnaireId,
            results: item.answers,
            userId: item.userId,
            index: item.id,
            cb: () => {
                Alert.alert('Успех', 'Ваши ответы успешно отправлены');
                loadData(); 
            },
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            <View style={{ flex: 1 }}>
                {!isAuthenticated ? (
                    <View style={{ flex: 1 }}>
                        <AppNotAuth />
                    </View>
                ) : (
                    <View style={{ flex: 1 }}>
                        {questionLoading ? (
                            <ActivityIndicator
                                style={styles.loader}
                                color={ThemeConstants[theme].activityIndicator}
                                size="large"
                            />
                        ) : answers && answers.length > 0 ? (
                            <FlatList
                                contentContainerStyle={styles.contentContainer}
                                data={answers}
                                keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={[styles.item, answers.length - 1 === index && { marginBottom: 100 }]}>
                                        <PastCard
                                            title={item?.title}
                                            status={item?.status}
                                            id={item?.id}
                                            createdAt={item?.createdAt}
                                            onSend={() => _onSend(item)}
                                        />
                                    </View>
                                )}
                                ListFooterComponent={() => (
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onChangePage={page => setCurrentPage(page)}
                                    />
                                )}
                            />
                        ) : (
                            <View style={styles.notification}>
                                <Text style={{ fontSize: 20 }}>Здесь еще пусто!</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>

            {/* --- КНОПКА ОТЛАДКИ ПОВЕРХ ВСЕГО --- */}
            <TouchableOpacity 
                style={styles.floatingDebugButton} 
                onPress={runFullDebug}
            >
                <Text style={styles.debugText}>DEBUG SYSTEM</Text>
            </TouchableOpacity>
        </View>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated || !!state.auth.token,
    reduxToken: state.auth.token, // Добавили для отчета отладки
    questionLoading: state.question.main.questionLoading,
});

const mapDispatchToProps = dispatch => ({
    loadQuestionPast: payload => dispatch(loadQuestionPast(payload)),
    sendAnswerNotSend: payload => dispatch(sendAnswerNotSend(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PastScreen);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    contentContainer: { paddingHorizontal: 15, paddingVertical: 30 },
    loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    item: { width: '100%', marginBottom: 15 },
    notification: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    
    // СТИЛИ КНОПКИ ОТЛАДКИ
    floatingDebugButton: {
        position: 'absolute',
        bottom: 90, // Чуть выше, чтобы не перекрывать нижние вкладки
        right: 20,
        left: 20,
        backgroundColor: 'black',
        padding: 15,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 10,
        zIndex: 9999,
    },
    debugText: {
        color: 'yellow',
        fontWeight: 'bold',
        fontSize: 14
    }
});