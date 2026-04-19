import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import QuestionContainer from './root/QuestionContainer';

import { useFormik } from 'formik';
import * as yup from 'yup';

import QuestionAddress from './QuestionAddress';
import QuestionAgreement from './QuestionAgreement';
import QuestionCanvas from './QuestionCanvas';
import QuestionCity from './QuestionCity';
import QuestionInput from './QuestionInput';
import QuestionPhoto from './QuestionPhoto';
import QuestionPoints from './QuestionPoints';
import QuestionSelect from './QuestionSelect';
import QuestionSelectMulti from './QuestionSelectMulti';
import QuestionSlider from './QuestionSlider';
import QuestionDatepicker from './QuestionDatepicker';
import QuestionKeyMessages from './QuestionKeyMessages';
import QuestionDropwdown from './QuestionDropwdown';
import QuestionYesNoInput from './QuestionYesNoInput';
import QuestionSearchSelect from './QuestionSearchSelect';

const components = {
    string: QuestionInput,
    text: props => <QuestionInput {...props} multiline />,
    select: QuestionSelect,
    selectMulti: QuestionSelectMulti,
    agreement: props => <QuestionAgreement {...props} dataProcessing />,
    canvas: QuestionCanvas,
    number: QuestionSlider,
    checkbox: QuestionAgreement,
    points: QuestionPoints,
    city: QuestionCity,
    address: QuestionAddress,
    photo: QuestionPhoto,
    'lecture-title': QuestionSearchSelect,
    datepicker: QuestionDatepicker,
    lecturer: QuestionSearchSelect,
    'key-messages-checkboxes': QuestionKeyMessages,
    'who-organized': QuestionSearchSelect,
    'brand-mention': QuestionDropwdown,
    'yesno-with-input': QuestionYesNoInput,
};

const QuestionPageDescriptor = props => {
    const validations = {};
    const [coreMessages, setCoreMessages] = useState(() => {

        const defaultValue = '{"kc1": " НАЖБП – мультисистемное заболевание, характеризуется высокими рискам", "kc3": "Условие старта медикаментозной терапии НАЖБП – стеатоз + наличие хотя бы одног", "kc4": "Урсосан действует на ведущую причину НАЖБП - выводит лишний жир из печени за с", "kc5": "Урсосан снижает кардиометаболические риски пациента – нормализует липидный и углеводный обмен"}'

        AsyncStorage.getItem('coreMessages').then((storedValue) => {
            if (storedValue) {
                setCoreMessages(JSON.parse(storedValue));
            }
        }).catch((error) => {
            console.error('Error retrieving data from AsyncStorage:', error);
        });
        return defaultValue;
    });
    useEffect(() => {
        AsyncStorage.setItem('coreMessages', JSON.stringify(coreMessages))
            .catch((error) => {
                console.error('Error saving data to AsyncStorage:', error);
            });
    }, [coreMessages]);

    const [valideForm, setValideForm] = useState(false);

    const [initialValuesState, setInitialValuesState] = useState({});

    const [addressVisibility, setAddressVisibility] = useState(true)

    // console.log('_initialValuesState_initialValuesState');
    // console.log(_initialValuesState);

    const changeAdditionalData = data => {
        setCoreMessages(data);
    };

    useEffect(() => {
        // console.log('props.iiii');
        // console.log(formik.values);
        // console.log('props.defaultValue props.defaultValuepagedescription');
        // console.log(props.defaultValue)

        const _initialValuesState = {};
        props.data.items.forEach((item, index) => {
            // _initialValuesState[`${index}`] = null;
            if (props?.defaultValue) {
                Object.keys(props.defaultValue).forEach((key, index) => {
                    if (props.defaultValue[key].group === props.data.title) {
                        _initialValuesState[`${index}`] = props.defaultValue[key].answer;
                    }
                });
            }
            validations[`${index}`] = item.options.is_required
                ? yup.string().required()
                : yup.string();
        });
        setInitialValuesState(_initialValuesState);

        // console.log('_initialValuesState_initialValuesState');
        // console.log(_initialValuesState);
    }, [props.defaultValue])

    const validationSchema = yup.object().shape(validations);

    const formik = useFormik({
        initialValues: initialValuesState,

        validationSchema,

        validateOnMount: false,

        enableReinitialize: true,

        onSubmit: async ({ email, password }) => {
            // console.log('onSubmit');
        },
    });

    useEffect(() => {
        // Hide address for "Карточка лекций"
        if (props.questionnaireId === 58 && formik.values['1'] === 'Онлайн') {
            setAddressVisibility(false);
            formik.handleChange(`6`)("");
        } else {
            setAddressVisibility(true);
        }
    }, [props.questionnaireId, formik.values]);

    useEffect(() => {
        let _isValide = true;
        Object.entries(props.data.items).forEach(([key, item]) => {
            if (item.options.is_required && !formik.values[key]) {
                _isValide = false;
            }
        });
        console.log('_isValide', _isValide);
        console.log('formik.values', formik.values);
        setValideForm(_isValide);
    }, [formik.values, props.data.items]);

    return (
        <QuestionContainer
            {...props}
            isValid={valideForm}
            onNext={() => {
                const res = {};

                Object.keys(formik.values).forEach(key => {
                    res[props.data.items[key].title] = formik.values[key];
                });

                props.onMassUpdate(res);
            }}
            onPrev={() => {
                props.onPrev();
            }}>
            {/* {console.log('props', props)} */}
            {props.data.items.map((item, index) => {
                let ActiveComponent = null;

                // console.log('item.type:', item.type);
                // console.log('testtest')
                // console.log(props.defaultValue[item.title]);

                if (item.type === 'select') {
                    ActiveComponent =
                        components[item.options.multiple ? 'selectMulti' : 'select'];
                } else {
                    if (item.type === 'address' && !addressVisibility) {
                        ActiveComponent = null;
                    } else {
                        ActiveComponent = components[item.type];
                    }
                }
                return (
                    <View key={item.title}>
                        {(ActiveComponent) && (<ActiveComponent
                            pageDesctiptor
                            data={
                                item.title === 'Ключевые сообщения'
                                    ? {
                                        ...item,
                                        value: coreMessages,
                                    }
                                    : item
                            }
                            isLight={props.isLight}
                            validateOnMount={false}
                            formValue={formik.values[`${index}`]}
                            defaultValue={
                                props.defaultValue &&
                                props.defaultValue[item.title] &&
                                props.defaultValue[item.title].answer
                            }
                            changeAdditionalData={changeAdditionalData}
                            onChange={(value = {}) => {
                                if (!value.hasOwnProperty('target')) {
                                    value = { target: { value } };
                                }
                                formik.handleChange(`${index}`)(value);
                            }}
                        />

                        )}
                        {/* {console.log('sdf3', JSON.parse(coreMessages))} */}
                    </View>
                );
            })}
        </QuestionContainer>
    );
};

export default QuestionPageDescriptor;
