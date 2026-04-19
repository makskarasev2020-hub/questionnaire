import * as yup from 'yup';
import React, { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import Icon from 'react-native-vector-icons/Ionicons';
import RNPickerSelect from 'react-native-picker-select';
import QuestionContent from './root/QuestionContainer';

export default function QuestionDropdown(props) {
    const [value, setValue] = useState(props.defaultValue);
    const [items, setItems] = useState([]);

    useEffect(() => {
        const options = props.data.options.values.map(val => ({
            label: val,
            value: val,
        }));
        setItems(options);
    }, []);

    useEffect(() => {
        setValue(props.formatValue);
    }, [props.formatValue]);

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
                    value={formikProps.values[typeSchema]}>
                    <RNPickerSelect
                        placeholder={{}}
                        value={formikProps.values[typeSchema]}
                        useNativeAndroidPickerStyle={false}
                        items={items}
                        onValueChange={val => {
                            if (!val) {
                                return;
                            }
                            formikProps.handleChange(typeSchema)(val);
                        }}
                        style={{
                            ...pickerSelectStyles,
                        }}
                        Icon={() => (
                            <Icon type="Ionicons" name="arrow-down" style={styles.icon} />
                        )}
                    />
                </QuestionContent>
            )}
        </Formik>
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
