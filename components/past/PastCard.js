import Clipboard from '@react-native-clipboard/clipboard';
import React, { useContext } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Button } from 'react-native-paper';
import LayoutConstants from '../../constants/Layout';
import ThemeConstants from '../../constants/Theme';
import { ThemeContext } from '../../context';

const PastCard = ({ title, status, notSended = false, onSend, onRemove, id, createdAt }) => {
    const { theme } = useContext(ThemeContext);

    const handleCopyURL = () => {
        const url = `https://promedcs.ursosan.ru/answers/${id}`;
        Clipboard.setString(url);
        Alert.alert('', 'Вы скопировали ссылку');
    };

    return (
        <View style={styles.container}>
            <Text style={{ color: '#212121', flex: 1 }}>{title}</Text>

            <View style={styles.control}>
                {!status && (
                    <Button
                        small
                        style={[
                            styles.btn,
                            {
                                backgroundColor: ThemeConstants[theme].buttonLight,
                                alignItems: 'center',
                                justifyContent: 'center',
                                alignSelf: 'center',
                            },
                        ]}
                        onPress={onSend}>
                        <Text style={{ color: '#fff', textAlign: 'center' }}>
                            {'Отправить еще раз'}
                        </Text>
                    </Button>
                )}

                {status && title === 'Карточка лекций' && (
                    <Button
                        small
                        style={[
                            styles.btnCopy,
                            {
                                alignItems: 'center',
                                justifyContent: 'center',
                                alignSelf: 'center',
                            },
                        ]}
                        onPress={handleCopyURL}>
                        <Text style={{ color: '#fff', textAlign: 'center' }}>
                            {'Поделиться'}
                        </Text>
                    </Button>
                )}

                <Text style={styles.status}>
                    {status ? 'Отправлено' : 'Не отправлено'}
                </Text>

                {notSended && <Button
                    small
                    style={[
                        styles.btn,
                        {
                            marginTop: 10,
                            backgroundColor: ThemeConstants[theme].buttonLight,
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center',
                        },
                    ]}
                    onPress={onRemove}>
                    <Text style={{ color: '#fff', textAlign: 'center' }}>
                        {'Удалить'}
                    </Text>
                </Button>

                }

                {status && <Text style={styles.status}>{createdAt}</Text>}
            </View>
        </View>
    );
};

export default PastCard;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        paddingVertical: 15,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        borderRadius: 10,
        backgroundColor: '#fff',

        shadowColor: 'rgba(0,0,0,0.14)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 7,
    },

    status: {
        marginTop: LayoutConstants.isSmallDevice ? 10 : 0,
        marginRight: LayoutConstants.isSmallDevice ? 0 : 10,

        color: '#455A64',
        fontSize: 12,
    },

    control: {
        flexDirection: LayoutConstants.isSmallDevice ? 'column' : 'row-reverse',
        alignItems: 'center',
        flex: 2,
    },

    btn: {
        paddingHorizontal: 25,
        paddingVertical: 12,
        backgroundColor: '#ef9a9a',
    },

    btnCopy: {
        paddingHorizontal: 25,
        paddingVertical: 4,
        marginVertical: 10,
        backgroundColor: '#f5cb42',
    },
});
