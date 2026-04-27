import React, { useContext, useState, useCallback } from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity, FlatList, Platform } from 'react-native';

import ThemeConstants from '../../../constants/Theme';
import { ThemeContext } from '../../../context';

export default ({
    value = null,
    suggestions = [],
    placholder = '',
    type = 'input',
    isValid = true,
    autoFocus = false,
    secureTextEntry = false,
    keyboardType,
    style = {},
    onBlur = () => { },
    onChange = () => { },
    onSuggestionSelect = () => { },
}) => {
    const { theme } = useContext(ThemeContext);
    const [isFocused, setIsFocused] = useState(false);

    const textAreaStyle = {
        marginTop: 8,
        height: 80,
        justifyContent: 'flex-start',
        textAlignVertical: 'top',
    };

    const handleFocus = () => setIsFocused(true);

    const handleSuggestionPress = (suggestion) => {
        onSuggestionSelect(suggestion);
        setIsFocused(false);
    };

    return (
        <View contrast style={styles.container}>
            <TextInput
                style={[

                    styles.input,
                    {
                        borderColor: ThemeConstants[theme].borderColor,
                        color: ThemeConstants[theme].color,
                    },
                    type === 'inputSearch' ? styles.inputSearch : {},
                    type === 'textArea' ? textAreaStyle : {},
                    !isValid && styles.noValid,
                    style,
                    { color: '#000000' }
                ]}
                importantForAutofill="auto"
                value={value}
                multiline={type === 'textArea'}
                onChangeText={onChange}
                keyboardType={keyboardType}
                placeholder={placholder}
                placeholderTextColor="#9F9F9F"
                secureTextEntry={secureTextEntry}
                autoFocus={autoFocus}
                onFocus={handleFocus}
                onBlur={(e) => {
                    onBlur(e)
                    setTimeout(() => {
                        setIsFocused(false);
                    }, 1000)
                }}
            />
            {isFocused && suggestions.length > 0 && (
                <FlatList
                    data={suggestions}
                    keyExtractor={(item, index) => `suggestion-${index}`}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleSuggestionPress(item)}>
                            <Text style={styles.suggestionItem}>{item.label}</Text>
                        </TouchableOpacity>
                    )}
                    style={styles.suggestionsContainer}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        position: 'relative',
        zIndex: 1000,
        elevation: 1000
    },

    input: {
        height: 40,
        width: '100%',
        ...Platform.select({ android: { paddingVertical: 0 }, ios: {} }),
        textAlignVertical: 'center',

        borderBottomWidth: 1,
        paddingLeft: 5,
        borderColor: '#DE7676',

        color: '#2E2E2E',
    },

    icon: {
        position: 'absolute',
        top: 13,
        left: 16,

        fontSize: 18,
        opacity: 0.5,
    },

    noValid: {
        borderColor: 'red',
        borderBottomWidth: 1.3,
    },

    suggestionsContainer: {
        marginTop: 10,
        backgroundColor: '#FFF',
        borderColor: '#E5E5E5',
        borderWidth: 1,
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        color: '#2E2E2E',
    },
});
