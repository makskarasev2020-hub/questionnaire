import * as yup from 'yup';

import React, { createRef, useContext, useEffect } from 'react';
import { StyleSheet, TextInput, Text, Platform } from 'react-native';

import { Formik } from 'formik';
import QuestionContent from './root/QuestionContainer';
import ThemeConstants from '../../constants/Theme';
import { ThemeContext } from '../../context';

const keyboardTypes = {
    default: 'default',
    phone: 'phone-pad',
    email: 'email-address',
    numerical: 'numeric',
};

const QuestionInput = props => {
    const { theme } = useContext(ThemeContext);

    const typeSchema =
        !!props.data &&
            props.data.validation &&
            props.data.validation !== '' &&
            props.data.validation !== '0' &&
            props.data.validation !== 0
            ? props.data.options && props.data.options.is_required
                ? props.data.validation
                : 'default1'
            : 'default';

    const validations = {
        default1: yup
            .string()
            .test('last_name', 'Last Name test message', function (value) {
                return true;
            }),
        default: yup.string(),
        email: yup.string().label('Email').email().required(),
        phone: yup.number().label('Phone').required().min(10),
        numerical: yup.number().label('numerical').required(),
    };

    const validationSchema = yup.object().shape({
        [typeSchema]: validations[typeSchema],
    });

    useEffect(() => {
        console.log('props.defaultValueprops.defaultValueprops.defaultVal')
        console.log(props.defaultValue);
    }, [])

    return (
        <Formik
            initialValues={{
                [typeSchema]: props.defaultValue,
            }}
            validateOnMount={props.validateOnMount}
            validationSchema={validationSchema}
        >
            {formikProps => (
                <QuestionContent
                    {...props}
                    onNext={() => props.onNext(formikProps.values[typeSchema])}
                    value={
                        props.data.options.is_required
                            ? formikProps.values[typeSchema]
                            : formikProps.values[typeSchema]
                                ? formikProps.values[typeSchema]
                                : ' '
                    }
                    isValid={
                        (!formikProps.errors[typeSchema] &&
                            formikProps.values[typeSchema]) ||
                        !props.data.options.is_required
                    }>
                    <TextInput
                        placeholder="Введите свой ответ"
                        value={formikProps.values[typeSchema]}
                        multiline={props.multiline}
                        numberOfLines={props.multiline ? 4 : 1}
                        keyboardType={keyboardTypes[typeSchema]}
                        onChangeText={formikProps.handleChange(typeSchema)}
                        placeholderTextColor={
                            props.isLight ? 'rgba(255,255,255, 0.7)' : '#000000'
                        }
                        onBlur={formikProps.handleBlur(typeSchema)}
                        style={[
                            StyleSheet.flatten(styles.input(props.isLight)),
                            Platform.OS === 'ios' && !props.multiline
                                ? {
                                    height: undefined,
                                    minHeight: 44,
                                    paddingTop: 12,
                                    paddingBottom: 10,
                                    borderBottomColor: ThemeConstants[theme].borderColor,
                                }
                                : {
                                    height: props.multiline ? 90 : 50,
                                    borderBottomColor: ThemeConstants[theme].borderColor,
                                },
                        ]}
                    />
                </QuestionContent>
            )}
        </Formik>
    );
};

export default QuestionInput;

const styles = StyleSheet.create({
    input: light => ({
        borderBottomColor: '#ee6e73',
        borderBottomWidth: 1,
        width: '100%',
        ...Platform.select({ android: { paddingVertical: 0 }, ios: {} }),
        textAlignVertical: 'center',
        fontSize: 18,
        color: light ? 'rgba(255,255,255, 0.8)' : '#000',
    }),
});
