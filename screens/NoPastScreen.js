import { Alert, FlatList, StatusBar, StyleSheet, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
// Наш исправленный черный текст
import Text from '../components/Text'; 
import {
    loadQuestionPast,
    saveQuestionPast,
    sendAnswerNotSend,
    removeAnswerNotSend,
    getQuestionPast,
} from '../store/actions/question';

import AppHeaderRight from '../components/app/root/AppHeaderRight';
import AppNotAuth from '../components/app/root/AppNotAuth';
import PastCard from '../components/past/PastCard';
import ThemeConstants from '../constants/Theme';
import { ThemeContext } from '../context';
import { connect } from 'react-redux';
import RNFS from 'react-native-fs';

const PastScreen = ({
    navigation,
    user,
    answersNotSend,
    isAuthenticated,
    sendAnswerNotSend,
    removeAnswerNotSend,
}) => {
    const { theme } = useContext(ThemeContext);
    // ИСПРАВЛЕНИЕ: Изначально пустой массив [], чтобы .length не вызывал падения
    const [answers, setAnswers] = useState([]); 

    useEffect(() => {
        RNFS.getFSInfo().then(info => {
            let freeSpaceInMegabytes = info.freeSpace / 1048576;
            if (freeSpaceInMegabytes <= 200) {
                Alert.alert('Внимание', 'Необходимо освободить место для корректной отправки ответов!')
            }
        }).catch(error => {
            console.error("Failed to get file system info: ", error);
        });
    }, []);

    useEffect(() => {
        navigation.setParams({ theme: theme });
    }, [theme]);

    // ИСПРАВЛЕНИЕ: Безопасный разбор данных из Redux
    useEffect(() => {
        let res = [];
        if (answersNotSend && typeof answersNotSend === 'object') {
            changeAnswer({ res, data: answersNotSend, isSend: false });
        }
        setAnswers(res);
    }, [answersNotSend]);

    const changeAnswer = ({ res, data, isSend }) => {
        // Используем Object.keys вместо for...in для исключения ошибок прототипа
        Object.keys(data).forEach(userId => {
            const answersUser = data[userId];
            
            // Если ветка пользователя пустая - пропускаем
            if (!answersUser || typeof answersUser !== 'object') return;

            Object.keys(answersUser).forEach(index => {
                const answer = answersUser[index];

                // КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: 
                // Если опрос уже был отправлен и в этой ячейке пусто (undefined/null) - пропускаем
                if (!answer || typeof answer !== 'object') return;

                // Проверка авторизации пользователя для конкретного опроса
                if (!isSend || (isSend && user && userId == (user.id || user.user_id))) {
                    res.push(
                        createAnswer({
                            title: answer.title || 'Опрос',
                            answers: answer.answers,
                            userId,
                            questionnaireId: answer.questionnaireId,
                            status: isSend,
                            id: answer.id || index, // Защита ID
                            index: index,
                        }),
                    );
                }
            });
        });
    };

    const createAnswer = ({ title, userId, answers, questionnaireId, status, index, id }) => {
        return { title, answers, userId, questionnaireId, status, index, id };
    };

    const _onSend = item => {
        // Дополнительная проверка перед отправкой
        if (!item || !item.answers) return;

        sendAnswerNotSend({
            questionnaireId: item.questionnaireId,
            results: item.answers,
            userId: item.userId,
            index: item.index,
            cb: () => {
                Alert.alert('Успех', 'Ваши ответы успешно отправлены');
            },
        });
    };

    const _onRemove = item => {
        removeAnswerNotSend({
            questionnaireId: item.questionnaireId,
            cb: () => {
                Alert.alert('Успех', 'Ваши ответы успешно удалены');
            },
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: '#fff' }]}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            <View style={{ flex: 1 }}>
                {!isAuthenticated ? (
                    <View style={[styles.contentContainer, { flex: 1 }]}>
                        <AppNotAuth />
                    </View>
                ) : (
                    <View style={{ flex: 1 }}>
                        {/* ИСПРАВЛЕНИЕ: Проверка answers.length теперь безопасна */}
                        {answers && answers.length > 0 ? (
                            <FlatList
                                contentContainerStyle={styles.contentContainer}
                                data={answers}
                                // Уникальный ключ для стабильности
                                keyExtractor={(item, idx) => `${item.userId}-${item.id}-${idx}`}
                                renderItem={({ item, index }) => (
                                    <View
                                        style={[
                                            styles.item,
                                            // Исправлено: используем длину всего массива answers
                                            answers.length - 1 === index && { marginBottom: 100 },
                                        ]}>
                                        <PastCard
                                            title={item.title}
                                            status={item.status}
                                            id={item.id}
                                            notSended={true}
                                            onSend={() => _onSend(item)}
                                            onRemove={() => _onRemove(item)}
                                        />
                                    </View>
                                )}
                            />
                        ) : (
                            <View style={styles.notification}>
                                <Text style={{ fontSize: 20, color: '#000' }}>Здесь еще пусто!</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </View>
    );
};

const mapStateToProps = state => ({
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated || !!state.auth.token,
    answersNotSend: state.question.main.answersNotSend,
});

const mapDispatchToProps = dispatch => ({
    sendAnswerNotSend: payload => dispatch(sendAnswerNotSend(payload)),
    removeAnswerNotSend: payload => dispatch(removeAnswerNotSend(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PastScreen);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    contentContainer: { paddingHorizontal: 15, paddingVertical: 30 },
    item: { width: '100%', marginBottom: 15 },
    notification: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});