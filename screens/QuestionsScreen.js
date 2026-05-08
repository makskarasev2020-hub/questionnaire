import * as Animatable from 'react-native-animatable';
import moment from 'moment';
import {
    Alert,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
    ImageBackground,
    BackHandler,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import React, { useEffect, useState, useMemo, useContext } from 'react';
import {
    saveAnswer,
    saveAnswerMass,
    sendAnswers,
} from '../store/actions/question';

import Text from '../components/Text';
import QuestionAddress from '../components/questions/QuestionAddress';
import QuestionAgreement from '../components/questions/QuestionAgreement';
import QuestionCanvas from '../components/questions/QuestionCanvas';
import QuestionCity from '../components/questions/QuestionCity';
import QuestionCongratulations from '../components/questions/root/QuestionCongratulations';
import QuestionInput from '../components/questions/QuestionInput';
import QuestionPageDescriptor from '../components/questions/QuestionPageDescriptor';
import QuestionPhoto from '../components/questions/QuestionPhoto';
import QuestionPoints from '../components/questions/QuestionPoints';
import QuestionSelect from '../components/questions/QuestionSelect';
import QuestionSelectMulti from '../components/questions/QuestionSelectMulti';
import QuestionSlider from '../components/questions/QuestionSlider';
import QuestionFile from '../components/questions/QuestionFile';
import { connect } from 'react-redux';

import ThemeConstants from '../constants/Theme';
import { ThemeContext } from '../context';
import { useHeaderHeight } from '@react-navigation/elements';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
const BASE_IMAGE_URL = 'https://promedcs.ursosan.ru/';
const buildImageUri = (path) => {
    if (!path) return null;
    const trimmed = path.trim();
    if (!trimmed) return null;
    return trimmed.startsWith('http') ? trimmed : `${BASE_IMAGE_URL}${trimmed}`;
};

const components = {
    string: QuestionInput,
    text: props => <QuestionInput {...props} multiline />,
    select: QuestionSelect,
    selectMulti: QuestionSelectMulti,
    agreement: props => <QuestionAgreement {...props} dataProcessing />,
    canvas: QuestionCanvas,
    number: QuestionSlider,
    checkbox: QuestionAgreement,
    points: QuestionPoints,
    city: QuestionCity,
    file: QuestionFile,
    address: QuestionAddress,
    photo: QuestionPhoto,
    'page-descriptor': QuestionPageDescriptor,
};

const QuestionScreen = ({
    navigation,
    route,
    answers,
    saveAnswer,
    saveAnswerMass,
    sendAnswers,
}) => {
    const { theme } = useContext(ThemeContext);
    const [descriptorAnswers, setDescriptorAnswers] = useState({});
    const [questionSendingIsLoading, setQuestionSendingIsLoading] = useState(false);
    const [uploadPercentCompleted, setUploadPercentCompleted] = useState(0);

    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [activeQuestion, setActiveQuestion] = useState({});
    const [time, setTime] = useState(route.params?.durationMin * 60 || 0);
    const [timeStr, setTimeStr] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [currentTime, setCurrentTime] = useState(null);

    const headerHeight = useHeaderHeight();

    const { data = [] } = route.params; 
    const { questionnaireId } = route.params;
    const { questionName } = route.params;

    let ActiveComponent = null;
    if (activeQuestion && activeQuestion.type) {
        if (activeQuestion.type === 'select') {
            ActiveComponent = components[activeQuestion.options?.multiple ? 'selectMulti' : 'select'];
        } else {
            ActiveComponent = components[activeQuestion.type];
        }
    }

    useEffect(() => {
        let interval = '';
        if (time) {
            setStartTime(+moment());
            interval = setInterval(() => {
                setCurrentTime(+moment());
            }, 1000);
        }
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (data && data[activeQuestionIndex]) {
            let activeQuestionTmp = data[activeQuestionIndex];
            setActiveQuestion(activeQuestionTmp);

            let descriptionAnswersTmp = {};
            if (answers && answers[questionnaireId]) {
                Object.keys(answers[questionnaireId]).forEach((key) => {
                    if (answers[questionnaireId][key]?.group === activeQuestionTmp.title) {
                        descriptionAnswersTmp[key] = answers[questionnaireId][key];
                    }
                });
            }
            setDescriptorAnswers(descriptionAnswersTmp);
        }
    }, [answers, activeQuestionIndex, data]);

    useEffect(() => {
        if (currentTime && startTime) {
            const different = Math.ceil(time - (currentTime - startTime) / 1000);
            if (different <= 0) {
                if (answers && answers[questionnaireId]) {
                    setActiveQuestionIndex(data.length - 1);
                    handleSendAnswers();
                } else {
                    navigation.goBack();
                }
            } else {
                let h = Math.floor(different / 60);
                let m = different % 60;
                setTimeStr(`${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`);
            }
        }
    }, [currentTime]);

    const isLigth = useMemo(() => true, []);

    const _handlerNextQuestion = value => {
        let currentQuestion = data[activeQuestionIndex];
        if (!currentQuestion) return;

        let isRight = _getIsRightAnswer({
            answer: value,
            values: currentQuestion.options?.values,
            result: currentQuestion.options?.is_right,
            multiple: currentQuestion.options?.multiple,
        });

        saveAnswer({
            questionnaireId,
            answer: {
                group: currentQuestion.group,
                need_score: true,
                score: 1,
                right_answers: isRight,
                question: currentQuestion.title,
                type: currentQuestion.type,
                question_no: currentQuestion.sort,
                answer: value,
            },
        });

        if (activeQuestionIndex < data.length - 1) {
            setActiveQuestionIndex(activeQuestionIndex + 1);
        }
    };

    const _getIsRightAnswer = ({ result, answer, values, multiple = 0 }) => {
        if (result && values) {
            if (multiple == 1) return '1';
            return `${+(result.indexOf('1') === values.indexOf(answer))}`;
        }
        return 0;
    };

    const handleSendAnswers = () => {
        const results = (answers && answers[questionnaireId])
            ? Object.values(answers[questionnaireId])
            : [];

        setQuestionSendingIsLoading(true);
        sendAnswers({
            questionnaireId,
            questionName,
            results,
            cb: () => setQuestionSendingIsLoading(false),
            uploadCb: (percent) => setUploadPercentCompleted(percent)
        });
    };

    const _handlerPrevQuestion = () => {
        if (activeQuestionIndex > 0) {
            setActiveQuestionIndex(activeQuestionIndex - 1);
        }
    };

    const _handlerConfirmClose = () => {
        Alert.alert('Внимание', 'Вы действительно хотите завершить тест?', [
            { text: 'Отменить', style: 'cancel' },
            {
                text: 'Завершить',
                onPress: () => {
                    if (answers && answers[questionnaireId]) {
                        setActiveQuestionIndex(data.length - 1);
                        handleSendAnswers();
                    } else {
                        navigation.goBack();
                    }
                },
            },
        ]);
    };

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (navigation.isFocused()) {
                _handlerConfirmClose();
                return true;
            }
            return false;
        });
        return () => backHandler.remove();
    }, []);

    return (
        <AutocompleteDropdownContextProvider headerOffset={headerHeight}>
            <ImageBackground
                source={activeQuestion?.images ? {
                    uri: buildImageUri(activeQuestion.images),
                } : null}
                resizeMode="cover"
                style={[styles.container, {backgroundColor: '#fff'}]}>
                
                <View style={styles.wrapper(false)}>
                    {/* Статус-бар всегда темный, чтобы иконки не пропадали на белом фоне */}
                    <StatusBar barStyle="dark-content" />

                    {activeQuestion?.type === 'finally-text' ? (
                        <Animatable.View animation="fadeInUp" style={{ flex: 1, backgroundColor: '#fff' }}>
                            <QuestionCongratulations
                                onStart={handleSendAnswers}
                                onEnd={() => navigation.goBack()}
                                questionSendingIsLoading={questionSendingIsLoading}
                                uploadPercentCompleted={uploadPercentCompleted}
                            />
                        </Animatable.View>
                    ) : (
                        <View style={[styles.content, {backgroundColor: 'rgba(255,255,255,0.8)'}]}>
                            <View style={styles.header}>
                                <Text style={styles.title}>
                                    Вопрос {activeQuestionIndex + 1} из {Math.max(0, data.length - 1)}
                                </Text>
                                <Text style={styles.time}>{timeStr}</Text>
                                <TouchableOpacity style={styles.close} onPress={_handlerConfirmClose}>
                                    <Icon name="close" size={24} style={styles.closeIcon} />
                                </TouchableOpacity>
                            </View>

                            {ActiveComponent && activeQuestion && (
                                <ActiveComponent
                                    navigation={navigation}
                                    data={activeQuestion}
                                    key={activeQuestion.title || 'q-key'}
                                    isLight={false} // Принудительно отключаем светлый режим
                                    questionnaireId={questionnaireId}
                                    defaultValue={
                                        questionnaireId !== 58 ? 
                                        answers?.[questionnaireId]?.[activeQuestion.title]?.answer : 
                                        descriptorAnswers
                                    }
                                    isFirst={activeQuestionIndex === 0}
                                    isLast={activeQuestionIndex === data.length - 2}
                                    onNext={_handlerNextQuestion}
                                    onPrev={_handlerPrevQuestion}
                                    onMassUpdate={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
                                />
                            )}
                        </View>
                    )}
                </View>
            </ImageBackground>
        </AutocompleteDropdownContextProvider>
    );
};

const mapStateToProps = state => ({
    answers: state.question.main.answers,
    // ИСПРАВЛЕНИЕ: Авторизация по токену или флагу
    isAuthenticated: state.auth.isAuthenticated || !!state.auth.token,
});

const mapDispatchToProps = dispatch => ({
    saveAnswer: payload => dispatch(saveAnswer(payload)),
    saveAnswerMass: payload => dispatch(saveAnswerMass(payload)),
    sendAnswers: payload => dispatch(sendAnswers(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(QuestionScreen);

const styles = StyleSheet.create({
    container: { flex: 1 },
    wrapper: (light) => ({
        flex: 1,
        backgroundColor: light ? 'rgba(0,0,0,0.4)' : null,
        paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 44,
    }),
    content: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 5,
    },
    close: { padding: 3 },
    // Иконка теперь всегда черная
    closeIcon: { color: '#000' },
    // ТЕКСТ ТЕПЕРЬ ВСЕГДА ЧЕРНЫЙ
    title: { fontWeight: '900', fontSize: 23, color: '#000' },
    time: { fontWeight: '700', fontSize: 20, color: '#000' },
});