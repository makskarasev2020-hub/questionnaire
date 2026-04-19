import React, { useContext, useEffect, useState } from 'react';
import { Text } from 'react-native-paper';
import {
    StatusBar,
    StyleSheet,
    Linking,
    Alert,
    Platform,
    View
} from 'react-native';
import {
    loadFolder,
    saveQuestionFolderData,
} from '../store/actions/question/folders';
import {
    loadQuestionAll,
    loadQuestionPast,
    saveAnswers,
    saveAnswersNotSendAll,
    saveAnswersSendAll,
    checkConnection,
} from '../store/actions/question';

import AppCardList from '../components/app/root/AppCardList';
import AppHeaderRight from '../components/app/root/AppHeaderRight';
import AppQuestionCard from '../components/app/root/AppQuestionCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemeConstants from '../constants/Theme';
import { ThemeContext } from '../context';
import { connect } from 'react-redux';
import httpClient from '../httpClient';

import { getRenderItem } from '../utils/question';
import { version } from '../const';

const HomeScreen = ({
    navigation,
    user,
    token,
    foldersData,
    foldersLoading,
    questionLoading,
    loadQuestionAll,
    saveAnswersNotSendAll,
    saveAnswersSendAll,
    loadFolder,
    checkConnection,
}) => {
    const [renderFolder, setRenderFolder] = useState([]);
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        AsyncStorage.getItem('answersNotSend').then(data => {
            if (data) {
                saveAnswersNotSendAll(JSON.parse(data));
            }
        });

        AsyncStorage.getItem('answersSend').then(data => {
            if (data) {
                saveAnswersSendAll(JSON.parse(data));
            }
        });
    }, []);

    useEffect(() => {

        if (foldersData) {
            console.log('getRenderItem({ data: foldersData, user, token })');
            console.log(getRenderItem({ data: foldersData, user, token }));
            setRenderFolder(getRenderItem({ data: foldersData, user, token }));
        }
    }, [foldersData]);

    useEffect(() => {
        navigation.setParams({
            theme: theme,
        });
    }, [theme]);

    const checkVersion = item => {
        // check version - rootVersion
        checkConnection().then(result => {
            if (!result) {
                Alert.alert(
                    'Внимание',
                    'Мы не смогли проверить актуальность данных, поскольку сейчас вы не в сети. Если вы не уверены, что данные актуальны - пожалуйста, сначала подключитесь к интернету.',
                );
            }
        });
        const url_get =
            Platform.OS === 'ios'
                ? 'https://promedcs.ursosan.ru/download/vers.txt'
                : 'https://promedcs.ursosan.ru/download/vers1.txt';
        httpClient(url_get, {
            headers: {
                'Cache-Control': 'no-cache',
            },
        })
            .then(({ data }) => {
                let url_upoad =
                    Platform.OS === 'ios'
                        ? 'https://promedcs.ursosan.ru/download'
                        : 'https://promedcs.ursosan.ru/download/promedcs.apk';
                // Update version 09.07.22
                if (version[Platform.OS] < data) {
                    Alert.alert(
                        'Внимание',
                        'Чтобы пользоваться приложением, необходимо скачать обновление!',
                        [
                            {
                                text: 'Скачать',
                                onPress: () => Linking.openURL(url_upoad),
                            },
                        ],
                    );
                } else {
                    navigation.navigate('PollList', {
                        folderName: item.name,
                        folderId: item.id,
                    });
                }
            })
            .catch(error => {
                console.error(error?.message);

                if (error?.message === 'Network Error') {
                    navigation.navigate('PollList', {
                        folderName: item.name,
                        folderId: item.id,
                    });
                }
            });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <AppCardList
                data={renderFolder}
                loading={foldersLoading}
                renderItem={item => (
                    <View>
                        <AppQuestionCard
                            imageUrl={`https://promedcs.ursosan.ru/${item.icon}`}
                            title={item.name}
                            loading={questionLoading}
                            onOpen={() => {
                                checkVersion(item);
                            }}
                        />
                    </View>
                )
                }
                onRefresh={() => {
                    loadFolder();

                    loadQuestionAll();
                }}
            />
        </View >
    );
};

const mapStateToProps = state => ({
    domen: state.main.domen,
    token: state.auth.token,
    user: state.auth.user,
    isAuthenticated: state.auth.user,
    answers: state.question.main.answers,
    questionData: state.question.main.questionData,
    questionLoading: state.question.main.questionLoading,
    foldersData: state.question.folders.foldersData,
    foldersLoading: state.question.folders.foldersLoading,
});

const mapDispatchToProps = dispatch => ({
    saveAnswers: payload => dispatch(saveAnswers(payload)),
    saveAnswersNotSendAll: payload => dispatch(saveAnswersNotSendAll(payload)),
    saveAnswersSendAll: payload => dispatch(saveAnswersSendAll(payload)),
    saveQuestionFolderData: payload => dispatch(saveQuestionFolderData(payload)),
    loadQuestionAll: payload => dispatch(loadQuestionAll(payload)),
    loadFolder: payload => dispatch(loadFolder(payload)),
    loadQuestionPast: payload => dispatch(loadQuestionPast(payload)),
    checkConnection: payload => dispatch(checkConnection(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
