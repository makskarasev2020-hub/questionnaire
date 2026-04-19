import React, { useState, useContext } from 'react';
import { Modal, Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import ThemeConstants from '../../../constants/Theme';
import { ThemeContext } from '../../../context';
import AppInput from './AppInput';

const AppModalPassword = ({ visible, item, navigateNextPage, closeModal }) => {
    const [inputValue, setInputValue] = useState('');
    const { theme } = useContext(ThemeContext);
    const [showError, setShowError] = useState(false);

    const checkPassword = () => {
        if (inputValue === item.password) {
            navigateNextPage();
            clearState();
        } else {
            setShowError(true);
        }
    };

    const clearState = () => {
        setShowError(false);
        setInputValue('');
        closeModal();
    };

    return (
        <View style={styles.centeredView}>
            <Modal animationType="fade" transparent={true} visible={visible}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {showError ? (
                            <>
                                <Text
                                    style={[
                                        styles.modalText,
                                        {
                                            color: '#D07B79',
                                        },
                                    ]}>
                                    {'Вы ввели неверный пароль'}
                                </Text>
                                <View style={styles.footer}>
                                    <Button
                                        small
                                        style={[
                                            styles.btn,
                                            { backgroundColor: ThemeConstants[theme].background },
                                        ]}
                                        onPress={() => {
                                            clearState();
                                        }}>
                                        <Text style={{ color: '#fff', textAlign: 'center' }}>
                                            {'Закрыть'}
                                        </Text>
                                    </Button>
                                </View>
                            </>
                        ) : (
                            <>
                                <View style={{ marginBottom: 20, width: 135 }}>
                                    <AppInput
                                        value={inputValue}
                                        placholder="Пароль"
                                        onChange={setInputValue}
                                        secureTextEntry
                                        style={{ color: '#000000' }}
                                    />
                                </View>
                                <View style={styles.footer}>
                                    <Button
                                        small
                                        style={[
                                            styles.btn,
                                            { backgroundColor: ThemeConstants[theme].buttonLight },
                                        ]}
                                        onPress={() => checkPassword(inputValue)}>
                                        <Text style={{ color: '#fff', textAlign: 'center' }}>
                                            {'Подтвердить'}
                                        </Text>
                                    </Button>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        width: 300,
        overflow: 'hidden',
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        borderBottomColor: '#ee6e73',
        borderBottomWidth: 1,
        width: '100%',
        paddingVertical: 15,
        fontSize: 18,
        color: '#000',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn: {
        paddingHorizontal: 25,
        backgroundColor: '#ef9a9a',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default AppModalPassword;
