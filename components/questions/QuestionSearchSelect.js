import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as yup from 'yup';

import { useNetInfo } from "@react-native-community/netinfo";

import { Formik } from 'formik';
import QuestionContent from './root/QuestionContainer';
import AppSelectSearch from '../app/root/AppSelectSearch';
import useFetchItems from '../hooks/useFetchItems';

export default function QuestionSearchSelect(props) {
    const [fetchItems] = useFetchItems();
    const [items, setItems] = useState([]);
    const [additionalData, setAdditionalData] = useState([]);
    const [value, setValue] = useState(props.defaultValue);
    const [showCustomInput, setShowCustomInput] = useState(false);

    const netInfo = useNetInfo();

    useEffect(() => {
        (async () => {
            const { items: fetchedItems, additionalItems } = await fetchItems(
                props.data.options.values_url,
            );
            setAdditionalData(additionalItems);
            setItems(fetchedItems);
        })();
    }, []);

    useEffect(() => {
        setValue(props.formValue);
    }, [props.formValue]);

    const typeSchema = 'default';

    const validationSchema = yup.object().shape({
        [typeSchema]: yup.string().required(),
    });

    return (
        <Formik
            initialValues={{
                [typeSchema]: value,
            }}
            validateOnMount={props.validateOnMount}
            validationSchema={validationSchema}
        >
            {formikProps => (
                <QuestionContent
                    {...props}
                    onNext={() => {
                        props.onNext(formikProps.values[typeSchema]);
                    }}
                    isValid={
                        netInfo?.isConnected ?
                            ((!formikProps.errors[typeSchema] &&
                                formikProps.values[typeSchema]) ||
                                !props.data.options.is_required) : true
                    }
                    value={
                        props.data.options.is_required
                            ? formikProps.values[typeSchema]
                            : formikProps.values[typeSchema]
                                ? formikProps.values[typeSchema]
                                : ' '
                    }>
                    {/* {showCustomInput ? (
            <View style={stylesCustomInput.container}>
              <TextInput
                placeholder="Введите свой ответ"
                value={formikProps.values[typeSchema]}
                onChangeText={val => {
                  formikProps.handleChange(typeSchema)(val);
                }}
                placeholderTextColor={
                  props.isLight ? 'rgba(255,255,255, 0.7)' : null
                }
                onBlur={formikProps.handleBlur(typeSchema)}
                style={[StyleSheet.flatten(styles.input(props.isLight))]}
              />
              <TouchableOpacity
                style={stylesCustomInput.button}
                onPress={() => {
                  setShowCustomInput(false);
                  formikProps.handleChange(typeSchema)('');
                }}>
                <Icon name="times-circle" size={20} />
              </TouchableOpacity>
            </View>
          ) : ( */}
                    <AppSelectSearch
                        value={formikProps.values[typeSchema]}
                        defaultIndex={
                            items.findIndex(
                                item => item.name === formikProps.values[typeSchema],
                            ) ?? 0
                        }
                        items={items}
                        placeholder="Начните вводить для поиска"
                        onChange={val => {

                            if (!val || !val.target.value) {
                                return;
                            }


                            // if (val.target.value?.includes('Другие вариации на тему')) {
                            //   setShowCustomInput(true);
                            // } else {
                            formikProps.handleChange(typeSchema)(val);
                            // }
                            if (additionalData.length) {
                                const currentValue = val.target.value;
                                const additionalItem = additionalData.find(
                                    item => item[currentValue] !== undefined,
                                );
                                props.changeAdditionalData(additionalItem[currentValue]);
                            }
                        }}
                    />
                    {/* )} */}
                </QuestionContent>
            )}
        </Formik>
    );
}

const styles = StyleSheet.create({
    input: light => ({
        borderBottomColor: '#DE7676',
        borderBottomWidth: 1,
        width: '100%',
        paddingVertical: 15,
        fontSize: 14,
        padding: 10,
        flex: 4,
        color: light ? 'rgba(255,255,255, 0.8)' : '#000',
    }),
});

const stylesCustomInput = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        marginLeft: 5,
    },
});
