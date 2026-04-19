import React, { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import RNPickerSelect from 'react-native-picker-select';
import QuestionContent from './root/QuestionContainer';

export default function QuestionBrandMention(props) {
    const [value, setValue] = useState(
        props.defaultValue || props.data.options.values[0],
    );
    const [items, setItems] = useState([]);

    useEffect(() => {
        const options = props.data.options.values.map((val, index) => ({
            label: val,
            val,
            key: index,
        }));
        setItems(options);
    }, []);

    const onChange = val => {
        console.log('val', val);
    };

    return (
        <QuestionContent
            {...props}
            isValid={true}
            value={value}
            onNext={() => props.onNext(value)}>
            <RNPickerSelect
                placeholder={{}}
                value={value}
                useNativeAndroidPickerStyle={false}
                items={items}
                onValueChange={onChange}
                style={{
                    ...pickerSelectStyles,
                }}
                Icon={() => (
                    <Icon type="Ionicons" name="arrow-down" style={styles.icon} />
                )}
            />

        </QuestionContent>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },

    icon: {
        fontSize: 14,
        color: '#DE7676',
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        height: 40,
        width: '100%',
        paddingBottom: 0.3,

        borderBottomWidth: 1,
        paddingLeft: 5,
        borderColor: '#DE7676',

        color: '#2E2E2E',

        fontSize: 16,
    },
    inputAndroid: {
        height: 40,
        width: '100%',
        paddingBottom: 0.3,

        borderBottomWidth: 1,
        paddingLeft: 5,
        borderColor: '#DE7676',

        color: '#2E2E2E',
    },

    iconContainer: {
        height: 40,
        marginRight: 5,

        justifyContent: 'center',
    },
});
