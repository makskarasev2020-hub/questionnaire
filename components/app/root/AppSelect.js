import React from 'react';
import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import RNPickerSelect from 'react-native-picker-select';

const PrifileHeaderFormInput = ({
    items,
    value,
    onChange = () => { },
}) => {
    useEffect(() => {
        if (!value && items) {
            onChange(items[0].value);
        }
    }, []);

    return (
        <View style={styles.content}>

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




            {/* <Picker
                selectedValue={value}
                onValueChange={(itemValue, itemIndex) => onChange(itemValue)}>
                {items.map((item, index) => (
                    <Picker.Item
                        style={{ fontSize: 18 }}
                        label={item}
                        value={item}
                        key={index}
                    />
                ))}
            </Picker> */}
        </View>
    );
};

export default PrifileHeaderFormInput;

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
