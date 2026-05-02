import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_DIR = `${RNFS.CachesDirectoryPath}/img_cache`;
const INDEX_KEY = 'img_cache_index';

let index = {};
const inFlight = new Set();

const ensureDir = async () => {
    try {
        const exists = await RNFS.exists(CACHE_DIR);
        if (!exists) await RNFS.mkdir(CACHE_DIR);
    } catch {}
};

export const loadCacheIndex = async () => {
    try {
        const raw = await AsyncStorage.getItem(INDEX_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        const verified = {};
        await Promise.all(
            Object.entries(parsed).map(async ([url, path]) => {
                try {
                    if (await RNFS.exists(path)) verified[url] = path;
                } catch {}
            })
        );
        index = verified;
        await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(index));
    } catch {}
};

const urlToFilename = (url) => {
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
        hash = (Math.imul(31, hash) + url.charCodeAt(i)) | 0;
    }
    const ext = (url.split('?')[0].split('.').pop() || 'img').slice(0, 5);
    return `${Math.abs(hash)}.${ext}`;
};

const persistIndex = async () => {
    try {
        await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(index));
    } catch {}
};

export const prefetchImageToFile = async (url) => {
    if (!url || index[url] || inFlight.has(url)) return;
    inFlight.add(url);
    try {
        await ensureDir();
        const destPath = `${CACHE_DIR}/${urlToFilename(url)}`;
        const result = await RNFS.downloadFile({ fromUrl: url, toFile: destPath }).promise;
        if (result.statusCode >= 200 && result.statusCode < 300) {
            index[url] = destPath;
            await persistIndex();
        } else {
            await RNFS.unlink(destPath).catch(() => {});
        }
    } catch {} finally {
        inFlight.delete(url);
    }
};

export const getLocalUri = (url) => {
    if (!url) return url;
    const local = index[url];
    return local ? `file://${local}` : url;
};
