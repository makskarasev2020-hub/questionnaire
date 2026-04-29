import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_DIR = `${RNFS.DocumentDirectoryPath}/img_cache`;
const CACHE_INDEX_KEY = 'img_cache_index_v1';

let cacheIndex = {};

const urlToFilename = (url) => {
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
        const char = url.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    const parts = url.split('.');
    const ext = parts.length > 1 ? parts[parts.length - 1].split('?')[0].slice(0, 5) : 'img';
    return `${Math.abs(hash)}.${ext}`;
};

export const loadCacheIndex = async () => {
    try {
        await RNFS.mkdir(CACHE_DIR);
        const stored = await AsyncStorage.getItem(CACHE_INDEX_KEY);
        if (stored) {
            cacheIndex = JSON.parse(stored);
        }
    } catch {}
};

export const prefetchImageToFile = async (url) => {
    if (!url) return;
    if (cacheIndex[url]) return;
    try {
        const filename = urlToFilename(url);
        const localPath = `${CACHE_DIR}/${filename}`;
        const exists = await RNFS.exists(localPath);
        if (!exists) {
            const result = await RNFS.downloadFile({ fromUrl: url, toFile: localPath }).promise;
            if (result.statusCode !== 200) {
                await RNFS.unlink(localPath).catch(() => {});
                return;
            }
        }
        cacheIndex[url] = localPath;
        await AsyncStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(cacheIndex));
    } catch {}
};

export const getLocalUri = (url) => {
    if (!url) return url;
    const local = cacheIndex[url];
    return local ? `file://${local}` : url;
};
