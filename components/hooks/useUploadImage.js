import { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';

export default function useUploadImage(defaultValue) {
    const [file, setFile] = useState(defaultValue || null);

    const _handleChooseFile = (cb = () => { }) => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                includeBase64: true,
            },
            response => {
                if (!response?.didCancel && response?.assets[0]?.base64) {
                    const base64 = `data:${response?.assets[0].type};base64,${response.assets[0].base64}`;
                    setFile(base64);
                    cb(base64);
                }
            },
        );
    };

    return { file, _handleChooseFile };
}


