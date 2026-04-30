import {
    SAVE_QUESTION_FOLDER_DATA,
    SAVE_QUESTION_FOLDER_LOADING,
} from '../../action-types';

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

const prefetchFolderImages = (folders) => {
    if (!folders || !Array.isArray(folders)) return;
    folders.forEach(f => {
        const iconUrl = toFullUrl(f.icon);
        const imageUrl = toFullUrl(f.image);
        if (iconUrl) prefetchImageToFile(iconUrl);
        if (imageUrl) prefetchImageToFile(imageUrl);
    });
};

export const loadFolder = () => (dispatch, getState) => {
    const {
        main: { domen },
    } = getState();

    console.log('domendomendomen');
    console.log(domen);

    const url = `${domen}/api/folders`;

    dispatch(saveQuestionFoldreLoading(true));

    httpClient
        .get(url)
        .then(res => {
            if (res.data.status) {
                dispatch(saveQuestionFoldreLoading(false));

                console.log(res.data.folders);

                dispatch(saveQuestionFolderData(res.data.folders));
                AsyncStorage.setItem('folders', JSON.stringify(res.data.folders));
                prefetchFolderImages(res.data.folders);
            }
        })
        .catch(err => {
            AsyncStorage.getItem('folders').then(data => {
                dispatch(saveQuestionFoldreLoading(false));

                if (data) {
                    dispatch(saveQuestionFolderData(JSON.parse(data)));
                }
            });
        });
};

export const saveQuestionFolderData = payload => ({
    type: SAVE_QUESTION_FOLDER_DATA,
    payload,
});

export const saveQuestionFoldreLoading = payload => ({
    type: SAVE_QUESTION_FOLDER_LOADING,
    payload,
});
