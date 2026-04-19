import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Alert, View, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

// Импортируем ваш исправленный Текст и компоненты
import Text from '../components/Text'; 
import AppCardList from '../components/app/root/AppCardList';
import AppHeaderRight from '../components/app/root/AppHeaderRight';
import AppQuestionCard from '../components/app/root/AppQuestionCard';
import AppModalPassword from '../components/app/root/AppModalPassword';

import ThemeConstants from '../constants/Theme';
import { ThemeContext } from '../context';
import { loadQuestion, checkConnection } from '../store/actions/question';
import { getRenderFolderItems } from '../utils/question';

const PollListScreen = ({
    questionData,
    user,
    token,
    loadQuestion,
    isAuthenticated, // Добавлено для проверки авторизации
    checkConnection,
    route
}) => {
    const { theme } = useContext(ThemeContext);
    const [isLoading, setIsLoading] = useState(false);
    const [renderQuestion, setRenderQuestion] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const navigation = useNavigation();

    const { folderId } = route.params;

    useEffect(() => {
        setIsLoading(true);
        loadQuestion({
            id: folderId,
            cb: () => {
                setIsLoading(false);
            },
        });
    }, [folderId]);

    useEffect(() => {
        if (questionData) {
            setRenderQuestion(
                getRenderFolderItems({ data: questionData, user, token }),
            );
        }
    }, [questionData, user, token]);

    const navigateNextPage = () => {
        navigation.navigate('Questions', {
            data: _convertToGroupedQuestion(currentItem.questions),
            questionName: currentItem.title,
            questionnaireId: currentItem.id,
            durationMin: currentItem.duration_min,
        });
    };

    useEffect(() => {
        if (!currentItem) {
            return;
        }
        if (currentItem.password) {
            setShowModal(true);
        } else {
            navigateNextPage();
        }
    }, [currentItem]);

    const _convertToGroupedQuestion = data => {
        const result = [];
        if (!data) return result;

        let pageDescriptor = null;
        data.forEach(question => {
            if (
                pageDescriptor &&
                question.page &&
                question.page.name === pageDescriptor.title
            ) {
                pageDescriptor.items.push(question);
            } else {
                if (question.type === 'page-descriptor') {
                    if (pageDescriptor) result.push(pageDescriptor);
                    pageDescriptor = {
                        title: question.title,
                        type: question.type,
                        question_no: question.question_no,
                        items: [],
                    };
                } else {
                    if (pageDescriptor) {
                        result.push(pageDescriptor);
                        pageDescriptor = null;
                    }
                    result.push(question);
                }
            }
        });
        if (pageDescriptor) result.push(pageDescriptor);
        return result;
    };

    return (
        <View style={styles.container}>
            {/* Гарантируем белый фон и темные иконки статус-бара */}
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            
            <AppCardList
                data={renderQuestion ? renderQuestion[folderId] : []}
                loading={isLoading}
                renderItem={item => (
                    <View key={item.id}>
                        <AppQuestionCard
                            // Убедитесь, что домен совпадает с актуальным (.ru)
                            imageUrl={`https://promedcs.ursosan.ru/${item.image}`}
                            title={item.title}
                            loading={isLoading}
                            onOpen={() => {
                                checkConnection().then(result => {
                                    if (!result) {
                                        Alert.alert(
                                            'Внимание',
                                            'Мы не смогли проверить актуальность данных, поскольку сейчас вы не в сети. Если вы не уверены, что данные актуальны - пожалуйста, сначала подключитесь к интернету.',
                                        );
                                    }
                                });
                                setCurrentItem(item);
                            }}
                        />
                    </View>
                )}
                onRefresh={() => {
                    setIsLoading(true);
                    loadQuestion({
                        id: folderId,
                        cb: () => {
                            setIsLoading(false);
                        },
                    });
                }}
            />

            <AppModalPassword
                visible={showModal}
                item={currentItem}
                navigateNextPage={navigateNextPage}
                closeModal={() => setShowModal(false)}
            />
        </View>
    );
};

const mapStateToProps = state => ({
    token: state.auth.token,
    user: state.auth.user,
    // ИСПРАВЛЕНИЕ: Проверка авторизации по токену для стабильности после сбоев
    isAuthenticated: state.auth.isAuthenticated || !!state.auth.token,
    questionData: state.question.main.questionData,
});

const mapDispatchToProps = dispatch => ({
    loadQuestion: payload => dispatch(loadQuestion(payload)),
    checkConnection: payload => dispatch(checkConnection(payload)),
});

// Настройка заголовка экрана
PollListScreen.navigationOptions = ({ navigation }) => ({
    headerStyle: { backgroundColor: '#DE7676' },
    headerTitle: (
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
            Список опросов
        </Text>
    ),
    headerRight: () => <AppHeaderRight />,
});

export default connect(mapStateToProps, mapDispatchToProps)(PollListScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff', // Принудительно белый фон
    },
});