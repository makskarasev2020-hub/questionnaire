import { Image } from 'react-native';

const prefetched = new Set();

export const loadCacheIndex = async () => {};

export const prefetchImageToFile = async (url) => {
    if (!url || prefetched.has(url)) return;
    prefetched.add(url);
    try {
        await Image.prefetch(url);
    } catch {}
};

export const getLocalUri = (url) => url;
