import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import AppConfetti from '../../app/root/AppConfetti';

const QuestionCongratulations = ({ onStart = () => { }, onEnd = () => { }, questionSendingIsLoading, uploadPercentCompleted }) => {
    const [loadingStartedAt, setLoadingStartedAt] = useState(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        onStart();
        const fallback = setTimeout(() => onEnd(), 10000);
        return () => {
            clearTimeout(fallback);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        console.log('questionSendingIsLoading');
        console.log(questionSendingIsLoading);
        if (questionSendingIsLoading) {
            // Запоминаем время, когда loading стал true
            setLoadingStartedAt(Date.now());
            // Если уже установлен таймер, очищаем его
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        } else if (loadingStartedAt !== null) {

            console.log('loadingStartedAt');
            console.log(loadingStartedAt);
            const loadingDuration = Date.now() - loadingStartedAt;

            console.log('loadingDuration');
            console.log(loadingDuration);

            if (loadingDuration >= 4000) {
                // Если loading был true более 4 секунд, сразу вызываем onEnd
                onEnd();
            } else {
                // Если loading был true менее 4 секунд, устанавливаем таймер на оставшееся время до 4 секунд
                timeoutRef.current = setTimeout(() => {
                    onEnd();
                }, 4000 - loadingDuration);
            }

            // Сброс состояния времени начала loading
            setLoadingStartedAt(null);
        }
    }, [questionSendingIsLoading]);

    // useEffect(() => {
    //     onStart();

    //     return () => {
    //         clearTimeout(timeout);
    //     };
    // }, []);

    // useEffect(() => {
    //     if (!questionSendingIsLoading) {
    //         onEnd();
    //     }
    // }, [questionSendingIsLoading]);

    return (
        <View style={styles.container}>
            <AppConfetti />
            <View style={styles.content}>
                <Text style={styles.title}>Опрос завершен</Text>
                <Text style={styles.desctiption}>
                    Спасибо, Ваши результаты приняты!
                </Text>
                {questionSendingIsLoading && (
                    <View style={{ marginTop: 15, flexDirection: 'column', alignItems: 'center' }}>
                        <Text style={{ color: '#000000', fontWeight: '600', fontSize: 20 }}>Загрузка</Text>
                        <Text style={{ color: '#000000', fontWeight: '600', fontSize: 20 }}>{uploadPercentCompleted}%</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default QuestionCongratulations;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },

    content: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    title: {
        marginBottom: 7,
        fontWeight: '700',
        fontSize: 30,
        color: '#000000',
    },

    desctiption: {
        fontSize: 17,
        color: '#000000',
    },
});
