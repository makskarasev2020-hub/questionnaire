import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

import QuestionContent from './root/QuestionContainer';
import ThemeConstants from '../../constants/Theme';
import cities from '../../assets/data/cities';
import { ThemeContext } from '../../context';

const QuestionCity = props => {
    const [value, setValue] = useState(null);
    const [initialCity, setInitialCity] = useState(null);
    const [formattedCities, setFormattedCities] = useState([]);
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        const initialValue = props.defaultValue || cities[0];
        const data = cities.map((city, index) => ({
            id: String(index),
            title: city,
        }));
        setFormattedCities(data);

        const initialItem = data.find(item => item.title === initialValue);

        if (initialItem) {
            setInitialCity(initialItem);
            setValue(initialItem.title);
        }
    }, [props.defaultValue]);

    const handleSelectItem = item => {
        if (item) {
            setValue(item.title);
        }
    };

    return (
        <QuestionContent
            {...props}
            isValid={!!value}
            value={value}
            onNext={() => props.onNext(value)}>
            <View style={styles.container}>
                <AutocompleteDropdown
                    dataSet={formattedCities}
                    initialValue={initialCity ?? { id: '0', title: '' }}
                    clearOnFocus={true}
                    closeOnBlur={false}
                    closeOnSubmit={false}
                    onSelectItem={handleSelectItem}
                    textInputProps={{
                        placeholder: 'Введите город',
                        autoCorrect: false,
                        autoCapitalize: 'none',
                        style: styles.inputStyle,
                    }}
                    suggestionsListContainerStyle={styles.suggestionsList}
                    inputContainerStyle={styles.inputContainer}
                    suggestionsListTextStyle={styles.suggestionsText}
                    EmptyResultComponent={
                        <View style={styles.emptyResult}>
                            <Text>Город не найден</Text>
                        </View>
                    }
                    rightButtonsContainerStyle={styles.rightButton}
                />
            </View>
        </QuestionContent>
    );
};

export default QuestionCity;

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     justifyContent: 'center',
    // },
    // inputStyle: {
    //     height: 40,
    //     fontSize: 16,
    //     color: '#000',
    // },
    // suggestionsList: {
    //     backgroundColor: '#FFF',
    //     borderRadius: 5,
    //     elevation: 3,
    // },
    // inputContainer: {
    //     width: '100%',
    // },
    // suggestionsText: {
    //     fontSize: 16,
    //     color: '#000',
    // },
    // emptyResult: {
    //     padding: 10,
    //     alignItems: 'center',
    // },
    // rightButton: {
    //     height: 30,
    //     alignSelf: 'center',
    // },
});
