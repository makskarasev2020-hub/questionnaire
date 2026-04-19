import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { useNetInfo } from "@react-native-community/netinfo";

const AppSelectSearch = ({
    value = '',
    items = [],
    placeholder = '',
    defaultIndex,
    onChange = () => { },
}) => {
    const [selectedValue, setSelectedValue] = useState(null);

    const netInfo = useNetInfo();

    useEffect(() => {
        const foundItem = items.find(item => item.name === value) ?? {};
        setSelectedValue(foundItem);
    }, [value, items]);

    return (
        <SearchableDropdown
            onTextChange={value => {
                if (!netInfo?.isConnected) {
                    onChange({ target: { value: value } });
                }
            }}
            onItemSelect={item => {
                onChange({ target: { value: item?.name } });
            }}
            containerStyle={pickerSelectStyles.input}
            itemStyle={{
                padding: 10,
                marginTop: 2,
            }}
            defaultIndex={defaultIndex}
            itemTextStyle={{ color: '#222' }}
            itemsContainerStyle={{ maxHeight: 140 }}
            items={items}
            selectedItems={selectedValue}
            resetValue={false}
            underlineColorAndroid="transparent"
            textInputProps={
                {
                    placeholder: placeholder,
                    placeholderTextColor: '#000000',
                    underlineColorAndroid: "transparent",
                    style: {
                        color: '#000000',
                    }
                }
            }
        />
    );
};

const pickerSelectStyles = StyleSheet.create({
    input: {
        borderBottomWidth: 1,
        borderColor: '#DE7676',

        color: '#2E2E2E',
        fontSize: 16,
        padding: 10,
    },
});

export default AppSelectSearch;
