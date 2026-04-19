import React, { useState } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Image,
    Platform,
} from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageView from "react-native-image-viewing";

export default function QuestionUpload({ _handleChooseFile, file }) {

    const [modalVisibility, setModalVisibility] = useState(false);

    return (
        <View
            style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
            <TouchableOpacity
                onPress={() => _handleChooseFile()}
                style={styles.dropzone}>
                <View
                    style={{
                        justifyContent: 'center',
                        borderColor: '#52A49A',
                        borderWidth: 1,
                        alignItems: 'center',
                        flexDirection: 'row',
                        padding: 10,
                        borderRadius: 8,
                        marginRight: 8,
                    }}>
                    <Icon
                        style={[styles.downloadIcon]}
                        type="Ionicons"
                        name="cloud-upload"
                    />
                    <Text
                        style={{
                            color: '#52A49A',
                        }}>
                        Прикрепить
                    </Text>
                </View>
            </TouchableOpacity>
            {file && (
                <View
                    style={{
                        minWidth: 150,
                    }}>
                    <TouchableOpacity onPress={() => setModalVisibility(true)}>
                        <Image
                            style={[styles.preview]}
                            source={{ uri: file }}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                    <ImageView
                        images={[{ uri: file }]}
                        imageIndex={0}
                        visible={modalVisibility}
                        onRequestClose={() => setModalVisibility(false)}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    downloadIcon: {
        color: '#909090',
        marginRight: 10,
    },
    preview: {
        backgroundColor: '#f5f5f5',
        minHeight: 50,

        borderRadius: 5,

        shadowColor: 'rgba(62, 44, 90, 0.08)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 13,

        borderWidth: Platform.OS === 'ios' ? 1 : 0,
        borderColor: 'rgba(0, 0, 0, 0.09)',
    },
});
