import AsyncStorage from '@react-native-async-storage/async-storage';

let RNFS = null;
try {
    RNFS = require('react-native-fs');
} catch {}

const getCacheDir = () => RNFS ? `${RNFS.DocumentDirectoryPath}/img_cache` : null;
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
    if (!RNFS) return;
    try {
        const cacheDir = getCacheDir();
        await RNFS.mkdir(cacheDir);
        const stored = await AsyncStorage.getItem(CACHE_INDEX_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            const valid = {};
            await Promise.all(
                Object.entries(parsed).map(async ([url, path]) => {
                    try {
                        if (await RNFS.exists(path)) {
                            valid[url] = path;
                        }
                    } catch {}
                })
            );
            cacheIndex = valid;
            await AsyncStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(valid));
        }
    } catch {}
};

export const prefetchImageToFile = async (url) => {
    if (!RNFS || !url) return;
    if (cacheIndex[url]) return;
    try {
        const cacheDir = getCacheDir();
        const filename = urlToFilename(url);
        const localPath = `${cacheDir}/${filename}`;
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
