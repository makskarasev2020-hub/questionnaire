import {
    SAVE_ANSWERS_DATA,
    SAVE_ANSWERS_NOT_SEND_ALL_DATA,
    SAVE_ANSWERS_NOT_SEND_DATA,
    REMOVE_ANSWERS_NOT_SEND_DATA,
    SAVE_ANSWERS_SEND_ALL_DATA,
    SAVE_ANSWERS_SEND_DATA,
    SAVE_ANSWER_DATA,
    SAVE_ANSWER_MASS_DATA,
    SAVE_QUESTION_ALL_DATA,
    SAVE_QUESTION_DATA,
    SAVE_QUESTION_LOADING,
    SAVE_QUESTION_PAST_DATA,
    RESET_ANSWER_DATA,
} from '../../action-types';
import { getRenderItem, splitIntoFolders } from '../../../utils/question';

import AsyncStorage from '@react-native-async-storage/async-storage';
import httpClient from '../../../httpClient';
import { prefetchImageToFile } from '../../../utils/imageCache';

const BASE_IMAGE_URL = 'https://promedcs.ursosan.ru/';

const toFullUrl = (path) => {
    if (!path) return null;
    const trimmed = path.trim();
    if (!trimmed) return null;
    return trimmed.startsWith('http') ? trimmed : `${BASE_IMAGE_URL}${trimmed}`;
};

const prefetchQuestionImages = (questionnaires) => {
    if (!questionnaires || !Array.isArray(questionnaires)) return;
    const urls = new Set();
    questionnaires.forEach(q => {
        if (q.icon) { const u = toFullUrl(q.icon); if (u) urls.add(u); }
        if (q.image) { const u = toFullUrl(q.image); if (u) urls.add(u); }
        if (q.images) { const u = toFullUrl(q.images); if (u) urls.add(u); }
        if (q.questions && Array.isArray(q.questions)) {
            q.questions.forEach(question => {
                if (question.images) { const u = toFullUrl(question.images); if (u) urls.add(u); }
                if (question.image_before) {
                    question.image_before.split(',').forEach(img => {
                        const u = toFullUrl(img);
                        if (u) urls.add(u);
                    });
                }
            });
        }
    });
    urls.forEach(url => prefetchImageToFile(url));
};

// Загрузка всех опросников (с поддержкой кэша для оффлайна)
export const loadQuestionAll = () => (dispatch, getState) => {
    const {
        main: { domen },
    } = getState();

    dispatch(saveQuestionLoading(true));

    httpClient
        .get(`${domen}/api/questionnaires/list/full`)
        .then(res => {
            dispatch(saveQuestionLoading(false));
            dispatch(saveQuestionAllData(splitIntoFolders(res.data.questionnaires)));

            AsyncStorage.setItem(
                'questionData',
                JSON.stringify(res.data.questionnaires),
            );

            prefetchQuestionImages(res.data.questionnaires);
        })
        .catch(err => {
            AsyncStorage.getItem('questionData').then(data => {
                dispatch(saveQuestionLoading(false));
                if (data) {
                    dispatch(saveQuestionAllData(splitIntoFolders(JSON.parse(data))));
                }
            });
        });
};

// Загрузка конкретного раздела
export const loadQuestion =
    ({ id, cb = () => { } }) =>
        (dispatch, getState) => {
            const {
                main: { domen },
            } = getState();

            httpClient
                .get(`${domen}/api/folders/${id}/questionnaires`)
                .then(res => {
                    dispatch(saveQuestionData({ data: res.data.questionnaires, id }));
                    cb(res.data.questionnaires);
                    prefetchQuestionImages(res.data.questionnaires);
                })
                .catch(err => {
                    console.log(err);
                    cb(err);
                });
        };

// ОТПРАВКА ОТВЕТОВ (Исправлено для оффлайна)
export const sendAnswers = ({ questionnaireId, questionName, results, cb, uploadCb }) => {
    return (dispatch, getState) => {
        const {
            main: { domen },
            auth: { user, token },
        } = getState();
        
        const userId = user?.id || user?.user_id;
        const url = `${domen}/api/answers/save`;
        const authorization = 'Bearer ' + token;

        httpClient
            .post(
                url,
                {
                    user_id: userId,
                    questionnaire_id: questionnaireId,
                    results: JSON.stringify(results),
                },
                {
                    headers: { Authorization: authorization },
                    onUploadProgress: function (progressEvent) {
                        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        if (uploadCb) uploadCb(percentCompleted);
                    }
                },
            )
            .then(response => {
                if (response.data && response.data.success) {
                    dispatch(
                        saveAnswersSend({
                            userId: userId,
                            questionnaireId: questionnaireId,
                            question_name: questionName,
                            answerId: response.data.answer_id,
                            createdAt: response.data.created_at,
                            data: results,
                        }),
                    );
                } else {
                    // Если сервер ответил ошибкой, сохраняем в "неотправленные"
                    dispatch(saveAnswersNotSend({
                        userId: userId,
                        questionnaireId: questionnaireId,
                        question_name: questionName,
                        data: results,
                    }));
                }
                dispatch(resetAnswerData(questionnaireId));
                if (cb) cb();
            })
            .catch(error => {
                // КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: если интернет пропал, обязательно сохраняем локально
                console.log('Сеть недоступна, сохраняем опрос в очередь');
                dispatch(saveAnswersNotSend({
                    userId: userId,
                    questionnaireId: questionnaireId,
                    question_name: questionName,
                    data: results,
                }));

                dispatch(resetAnswerData(questionnaireId));
                if (cb) cb(); // Вызываем cb, чтобы закрыть экран опроса
            });
    };
};

// ЗАГРУЗКА ИСТОРИИ (Исправлено: защита от белого экрана)
export const loadQuestionPast = currentPage => {
    return (dispatch, getState) => {
        const {
            main: { domen },
            auth: { user, token },
        } = getState();
        
        const userId = user?.id || user?.user_id;
        if (!userId) return Promise.resolve({ answers: [], total: 0 });

        const url = `${domen}/api/${userId}/answers?page=${currentPage}`;
        const authorization = 'Bearer ' + token;

        dispatch(saveQuestionLoading(true));

        return httpClient
            .get(url, {
                headers: { Authorization: authorization },
            })
            .then(response => {
                // Всегда возвращаем структуру, даже если данных нет
                if (response.status === 200 && response.data) {
                    return response.data;
                }
                return { answers: [], total: 0 };
            })
            .catch(error => {
                console.error("Ошибка загрузки истории:", error);
                return { answers: [], total: 0 }; // Возвращаем пустой список вместо ошибки
            })
            .finally(() => {
                dispatch(saveQuestionLoading(false));
            });
    };
};

// Получение локальной истории
export const getQuestionPast = () => {
    return async () => {
        try {
            const questionPast = await AsyncStorage.getItem('questionPast');
            return questionPast ? JSON.parse(questionPast) : [];
        } catch (e) {
            return [];
        }
    };
};

// Проверка связи
export const checkConnection = () => {
    return async (dispatch, getState) => {
        const { main: { domen } } = getState();
        const url = `${domen}/api/folders`;
        try {
            await httpClient.get(url);
            return true;
        } catch (err) {
            return false;
        }
    }
}

// СИНХРОНИЗАЦИЯ НЕОТПРАВЛЕННЫХ (Исправлена защита от краша)
export const sendAnswerNotSend = ({
    questionnaireId,
    results,
    userId,
    index,
    cb = () => { },
}) => {
    return (dispatch, getState) => {
        const {
            main: { domen },
            auth: { user, token },
            question: { main: { answersNotSend } },
        } = getState();

        // ЗАЩИТА: Если данных в Redux уже нет (после логаута), не падаем
        if (!answersNotSend || !answersNotSend[userId] || !answersNotSend[userId][index]) {
            console.warn("Данные для отправки не найдены в стейте");
            return;
        }

        const url = `${domen}/api/answers/save`;
        const authorization = 'Bearer ' + token;

        httpClient
            .post(
                url,
                {
                    user_id: user?.id || user?.user_id,
                    questionnaire_id: questionnaireId,
                    results: JSON.stringify(results),
                },
                { headers: { Authorization: authorization } },
            )
            .then(response => {
                if (response.data && response.data.success) {
                    cb();

                    let currentAnswersNotSend = { ...answersNotSend };
                    let currentAnswer = currentAnswersNotSend[userId][index];

                    dispatch(
                        saveAnswersSend({
                            userId: user?.id || user?.user_id,
                            questionnaireId: questionnaireId,
                            question_name: currentAnswer?.title || "Опрос",
                            data: currentAnswer,
                            answerId: response.data.answer_id,
                            createdAt: response.data.created_at,
                        }),
                    );

                    delete currentAnswersNotSend[userId][index];
                    dispatch(saveAnswersNotSendAll(currentAnswersNotSend));
                    AsyncStorage.setItem('answersNotSend', JSON.stringify(currentAnswersNotSend));
                }
            })
            .catch(error => {
                console.log('Ошибка при синхронизации', error);
            });
    };
};

// Удаление неотправленного
export const removeAnswerNotSend = ({
    questionnaireId,
    cb = () => { },
}) => {
    return (dispatch, getState) => {
        const { auth: { user } } = getState();
        cb();
        dispatch(
            removeAnswersNotSend({
                questionnaireId: questionnaireId,
                userId: user?.id || user?.user_id,
            }),
        );
    };
};

// --- ВСЕ ОСТАЛЬНЫЕ ЭКШЕНЫ БЕЗ ИЗМЕНЕНИЙ ---

export const saveQuestionAllData = payload => ({
    type: SAVE_QUESTION_ALL_DATA,
    payload,
});

export const saveQuestionData = payload => ({
    type: SAVE_QUESTION_DATA,
    payload,
});

export const saveQuestionLoading = payload => ({
    type: SAVE_QUESTION_LOADING,
    payload,
});

export const saveAnswer = payload => ({
    type: SAVE_ANSWER_DATA,
    payload,
});

export const resetAnswerData = payload => ({
    type: RESET_ANSWER_DATA,
    payload,
});

export const saveAnswerMass = payload => ({
    type: SAVE_ANSWER_MASS_DATA,
    payload,
});

export const saveAnswers = payload => ({
    type: SAVE_ANSWERS_DATA,
    payload,
});

export const saveQuestionPast = payload => ({
    type: SAVE_QUESTION_PAST_DATA,
    payload,
});

export const saveAnswersNotSend = payload => ({
    type: SAVE_ANSWERS_NOT_SEND_DATA,
    payload,
});

export const removeAnswersNotSend = payload => ({
    type: REMOVE_ANSWERS_NOT_SEND_DATA,
    payload,
});

export const saveAnswersSend = payload => ({
    type: SAVE_ANSWERS_SEND_DATA,
    payload,
});

export const saveAnswersNotSendAll = payload => ({
    type: SAVE_ANSWERS_NOT_SEND_ALL_DATA,
    payload,
});

export const saveAnswersSendAll = payload => ({
    type: SAVE_ANSWERS_SEND_ALL_DATA,
    payload,
});