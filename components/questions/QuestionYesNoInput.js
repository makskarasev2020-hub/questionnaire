import * as yup from 'yup';
import React, { useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Formik } from 'formik';
import QuestionContent from './root/QuestionContainer';
import AppRadio from '../app/root/AppRadio';
import AppInput from '../app/root/AppInput';
import AppRoundButton from '../app/root/AppRoundButton';

export default function QuestionYesNoInput(props) {
    const items = [
        { label: 'Да', value: 'yes' },
        { label: 'Нет', value: 'no' },
    ];
    const [value, setValue] = useState(props.defaultValue ?? items[1].value);
    const [countInputs, setCountInputs] = useState(1);
    const [inputsData, setInputsData] = useState([]);

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
            onSubmit={(values, actions) => {
                props.onNext(values);
            }}
            validationSchema={validationSchema}
        >
            {formikProps => (
                <QuestionContent
                    {...props}
                    isValid={
                        (!formikProps.errors[typeSchema] &&
                            formikProps.values[typeSchema]) ||
                        !props.data.options.is_required
                    }
                    onNext={formikProps.submitForm}
                    value={formikProps.values[typeSchema]}
                    onChange={val => {
                        props.onChange([val, ...inputsData]);
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                        }}>
                        {items.map((item, index) => (
                            <View style={{ flex: 1 }} key={index}>
                                <AppRadio
                                    light={props.isLight}
                                    label={item.label}
                                    defaultValue={item.value}
                                    value={formikProps.values[typeSchema]}
                                    onSelet={value => {
                                        if (!value) {
                                            return;
                                        }
                                        return formikProps.handleChange(typeSchema)(value);
                                    }}
                                />
                            </View>
                        ))}
                    </View>
                    {props.data.options.show_input_on ===
                        formikProps.values[typeSchema] &&
                        Array.from({ length: countInputs }).map((_, index) => (
                            <View
                                key={index}
                                style={{
                                    flexDirection: 'row',
                                    marginTop: 20,
                                }}>
                                <View
                                    style={{
                                        flex: 3,
                                    }}>
                                    <AppInput
                                        value={inputsData[index]}
                                        placholder="Введите ваш вопрос"
                                        onChange={val => {
                                            setInputsData(prev => {
                                                prev[index] = val;
                                                return prev;
                                            });
                                            props.onChange([
                                                [formikProps.values[typeSchema], ...inputsData],
                                            ]);
                                        }}
                                        style={{ color: '#000000' }}
                                    />
                                </View>
                                {index + 1 === countInputs && (
                                    <View
                                        style={{
                                            flex: 1,
                                        }}>
                                        <AppRoundButton
                                            onPress={() => setCountInputs(countInputs + 1)}
                                        />
                                    </View>
                                )}
                            </View>
                        ))}
                </QuestionContent>
            )}
        </Formik>
    );
}
