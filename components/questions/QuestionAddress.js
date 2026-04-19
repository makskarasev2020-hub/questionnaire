import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import QuestionContent from './root/QuestionContainer';

import Text from '../Text';

import AppInput from '../app/root/AppInput';
import AppSelectCity from '../app/root/AppSelectCity';

import { Formik } from 'formik';
import * as yup from 'yup';

import debounce from 'lodash.debounce';

import httpClient from '../../httpClient';

const validationSchema = yup.object().shape({
    //   index: yup.number().required().min(6),
    city: yup.string().required(),
    address: yup.string().required().min(2),
});

const QuestionAddress = props => {
    const [suggestions, setSuggestions] = useState([]);

    const fetchSuggestions = debounce(async (address) => {
        if (!address) return setSuggestions([]);
        const apiKey = 'c5060e76-938d-468c-9102-f39c29f39f75';
        try {
            const response = await httpClient.get(
                `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${apiKey}&geocode=${address}`
            );
            const data = response.data;
            const newSuggestions = data.response.GeoObjectCollection.featureMember.map(member => ({
                value: member.GeoObject.metaDataProperty.GeocoderMetaData.text,
                label: (member.GeoObject.description ? (member.GeoObject.description + ', ') : '') + member.GeoObject.name,
            }));
            setSuggestions(newSuggestions);
        } catch (error) {
            console.error('Ошибка при запросе к Яндекс.Картам: ', error);
        }
    }, 500);

    useEffect(() => {
        return () => {
            fetchSuggestions.cancel();
        };
    }, []);

    return (
        <Formik
            initialValues={{
                // index: props.defaultValue ? props.defaultValue.index : null,
                city: props.defaultValue ? props.defaultValue.city : null,
                address: props.defaultValue ? props.defaultValue.address : null,
            }}
            onSubmit={(values, actions) => {
                props.onNext(values);
            }}
            validationSchema={validationSchema}
        >
            {formikProps => (
                <QuestionContent
                    {...props}
                    isValid={!Object.keys(formikProps.errors).length}
                    value={formikProps.values}
                    onNext={formikProps.submitForm}>

                    {/* <View style={styles.item}>
                        <Text style={styles.lable} light={props.isLight}>
                            Город
                        </Text>

                        <AppSelectCity
                            value={formikProps.values.address}
                            onChange={val => {
                                if (!val) {
                                    return;
                                }
                                formikProps.handleChange('address')(val);
                            }}
                        />
                    </View> */}

                    <View style={styles.item}>
                        <Text style={styles.lable} light={props.isLight}>
                            Адрес
                        </Text>

                        <AppInput
                            style={styles.input}
                            value={formikProps.values.address}
                            placholder="Пушкина 2"
                            suggestions={suggestions}
                            onChange={async (val) => {
                                // if (!val) {
                                //   return;
                                // }
                                await fetchSuggestions(val);
                                formikProps.handleChange('address')(val);
                            }}
                            onSuggestionSelect={(suggestion) => {
                                console.log('onSuggestionSelectonSuggestionSelect')
                                console.log(suggestion)
                                formikProps.handleChange('address')(suggestion.value);
                            }}
                        />
                    </View>
                </QuestionContent>
            )}
        </Formik>
    );
};

export default QuestionAddress;

const styles = StyleSheet.create({
    item: {
        marginBottom: 15,
    },

    lable: {
        marginBottom: 5,
        fontSize: 16,
    },

    input: {
        fontSize: 18,
        color: '#000000'
    },
});
