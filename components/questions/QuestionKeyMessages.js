import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import * as yup from 'yup';
import { Formik } from 'formik';
import QuestionContent from './root/QuestionContainer';
import AppCheckbox from '../app/root/AppCheckbox';
import useUploadImage from '../hooks/useUploadImage';
import QuestionUpload from './QuestionUpload';
import SolidLine from '../../components/SolidLine';

export default function QuestionKeyMessages(props) {
    const values = Object.entries(JSON.parse(props.data.value));
    const [files, setFiles] = useState(
        Object.keys(props.defaultValue ?? {})
            .filter(key => key.startsWith('file'))
            .reduce((acc, key) => ({ ...acc, [key]: props.defaultValue[key] }), {}),
    );
    const { _handleChooseFile } = useUploadImage();

    const handleFiles = (index, file) => {
        const updatedFiles = { ...files, [`file${index + 1}`]: file };
        setFiles(updatedFiles);
        props.onChange({ ...props.formValue, ...updatedFiles });
    };

    const validationSchema = yup.object().shape({
        kc: yup.array().of(yup.string()).required().min(1),
        slides: yup.array().of(yup.string()),
    });

    return (
        <Formik
            initialValues={{
                kc: props.defaultValue?.kc ?? [],
                slides: props.defaultValue?.slides ?? [],
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
                        !Object.keys(formikProps.errors).length ||
                        !props.data.options.is_required
                    }
                    value={formikProps.values}
                    onNext={formikProps.submitForm}
                    onChange={val => {
                        if (!val) {
                            return;
                        }
                        props.onChange({ ...props.formValue, ...val });
                    }}>
                    <View
                        style={{
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}>
                        {values.map(([key, val], index) => (
                            <View style={styles.item} key={key}>
                                <View style={{ flex: 1, marginBottom: 15, }}>
                                    <Text style={{ color: '#000000' }}>
                                        {index + 1}. {val}
                                    </Text>
                                </View>
                                <View style={{ flex: 1, marginBottom: 15 }}>
                                    <AppCheckbox
                                        light={props.isLight}
                                        label={'Прозвучало'}
                                        defaultValue={index}
                                        value={formikProps.values.kc}
                                        onSelet={val => {
                                            if (!val) {
                                                return;
                                            }
                                            formikProps.handleChange('kc')({
                                                target: { value: val },
                                            });
                                        }}
                                    />
                                </View>
                                <View style={{ flex: 1, marginBottom: 15 }}>
                                    <AppCheckbox
                                        light={props.isLight}
                                        label={'Был слайд'}
                                        defaultValue={index}
                                        value={formikProps.values.slides}
                                        onSelet={val => {
                                            if (!val) {
                                                return;
                                            }
                                            formikProps.handleChange('slides')({
                                                target: { value: val },
                                            });
                                        }}
                                    />
                                </View>
                                <View style={{ flex: 1, marginBottom: 15 }}>
                                    <QuestionUpload
                                        file={files[`file${index + 1}`]}
                                        _handleChooseFile={() =>
                                            _handleChooseFile(file => handleFiles(index, file))
                                        }
                                    />
                                </View>
                                <SolidLine />
                            </View>
                        ))}
                    </View>
                </QuestionContent>
            )}
        </Formik>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'column',
        marginBottom: 15,
    },

    lable: {
        marginBottom: 8,
        fontSize: 16,
    },
    downloadIcon: {
        color: '#909090',
        marginRight: 10,
    },
});
