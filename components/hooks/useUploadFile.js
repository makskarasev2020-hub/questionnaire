import { useState } from 'react';
import DocumentPicker from 'react-native-document-picker';

export default function useUploadFile(defaultValue) {
    const [file, setFile] = useState(defaultValue || null);

    const _handleChooseFile = async (cb = () => { }) => {
        try {
            const result = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.allFiles],
            });

            console.log(result);

            const fileUri = result.uri;
            const fileType = result.type;
            const fileName = result.name;
            const fileSize = result.size;

            const fileInfo = {
                uri: fileUri,
                type: fileType,
                name: fileName,
                size: fileSize
            };

            setFile(fileInfo);
            cb(fileInfo);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // Пользователь отменил выбор файла
            } else {
                throw err;
            }
        }
    };

    return { file, _handleChooseFile };
}
