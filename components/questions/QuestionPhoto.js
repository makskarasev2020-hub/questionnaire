import React, { useState } from 'react';
import {
    View,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    StatusBar,
    Platform,
    StyleSheet,
} from 'react-native';

import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

import QuestionContent from './root/QuestionContainer';

// import ImagePicker from 'react-native-image-picker';
import useUploadImage from '../hooks/useUploadImage';

const QuestionPhoto = props => {
    const [isLoading, setIsLoading] = useState(false);
    const { file, _handleChooseFile } = useUploadImage(props.defaultValue);

    return (
        <QuestionContent
            {...props}
            isValid={props.data.options.is_required ? !!file : true}
            value={props.data.options.is_required ? file : file ? file : ' '}
            onNext={() => props.onNext(file)}>
            <TouchableOpacity
                onPress={() => !isLoading && _handleChooseFile()}
                style={styles.dropzone}>
                <View
                    style={{
                        height: 50,
                        width: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#4994EC" />
                    ) : (
                        <Icon
                            style={[styles.icon]}
                            type="Ionicons"
                            name="cloud-upload"
                        />
                    )}
                </View>

                <Text style={styles.dropzoneText}>
                    Нажмите сюда чтобы загрузить файлы
                </Text>
            </TouchableOpacity>

            {file && (
                <View style={{ marginTop: 20 }}>
                    <Image
                        style={[styles.dropzone]}
                        source={{ uri: file }}
                        resizeMode="cover"
                    />
                </View>
            )}
        </QuestionContent>
    );
};

export default QuestionPhoto;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    header: {
        marginTop: StatusBar.currentHeight || 44,
        paddingTop: 15,
        paddingBottom: 10,
        paddingHorizontal: 15,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },

    headerTitle: {
        fontWeight: '700',
        fontSize: 20,
    },

    dropzone: {
        minHeight: 170,

        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: '#f5f5f5',

        borderRadius: 5,

        shadowColor: 'rgba(62, 44, 90, 0.08)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 13,

        borderWidth: Platform.OS === 'ios' ? 1 : 0,
        borderColor: 'rgba(0, 0, 0, 0.09)',
    },

    dropzoneText: {
        fontSize: 18,
        fontWeight: '300',
        color: '#909090',
    },

    icon: {
        fontSize: 26,
        fontWeight: '300',
        color: '#909090',
    },

    sizeDescription: {
        marginTop: 10,

        fontSize: 11,
        fontWeight: '600',
        color: '#909090',
    },

    file: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },

    fileText: {
        fontSize: 12,
    },

    fileIcon: {
        fontSize: 18,
        marginRight: 10,
    },
});
