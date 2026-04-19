import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import DatePicker from 'react-native-date-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as yup from 'yup';
import { Formik } from 'formik';
import QuestionContent from './root/QuestionContainer';

export default function QuestionDatepicker(props) {
    const [value, setValue] = useState({
        date: props.defaultValue?.date ?? '',
        from: props.defaultValue?.from ?? '',
        to: props.defaultValue?.to ?? '',
    });

    const [lectureDate, setLectureDate] = useState(null);
    const [lectureDateModalOpen, setLectureDateModalOpen] = useState(false);

    const [lectureStartTime, setLectureStartTime] = useState(null);
    const [lectureStartTimeModalOpen, setLectureStartTimeModalOpen] = useState(false);

    const [lectureEndTime, setLectureEndTime] = useState(null);
    const [lectureEndTimeModalOpen, setLectureEndTimeModalOpen] = useState(false);

    useEffect(() => {
        setValue(props.formValue);
    }, [props.formValue]);

    const typeSchema = 'default';

    const validationSchema = yup.object().shape({
        [typeSchema]: yup.object().shape({
            date: yup.date().required(),
            from: yup.date().required(),
            to: yup.date().required(),
        }),
    });

    const isIOS = Platform.OS === 'ios';

    return (
        <Formik
            initialValues={{
                [typeSchema]: {
                    date: value?.date,
                    from: value?.from,
                    to: value?.to,
                },
            }}
            validateOnMount={props.validateOnMount}
            validationSchema={validationSchema}
        >
            {formikProps => (
                <QuestionContent
                    {...props}
                    isValid={
                        formikProps.values[typeSchema].date &&
                        formikProps.values[typeSchema].from &&
                        formikProps.values[typeSchema].to
                    }
                    value={
                        props.data.options.is_required
                            ? formikProps.values[typeSchema]
                            : formikProps.values[typeSchema]
                                ? formikProps.values[typeSchema]
                                : ' '
                    }
                    onNext={() => {
                        props.onNext(formikProps.values[typeSchema]);
                    }}
                >
                    <View
                        style={{
                            width: '100%',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                        }}
                    >
                        <View
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 20,
                                marginRight: 20,
                            }}
                        >
                            <TouchableOpacity
                                style={{ alignItems: 'center' }}
                                onPress={() => setLectureDateModalOpen(true)}
                            >
                                <Text style={{ color: '#000000' }}>Дата лекции</Text>
                                <Text style={{ color: '#000000' }}>
                                    {lectureDate ? lectureDate.toLocaleDateString('ru-RU') : '--------'}
                                </Text>
                            </TouchableOpacity>
                            {isIOS ? (
                                (
                                    <DateTimePicker
                                        value={lectureDate || new Date()}
                                        mode="date"
                                        display="default"
                                        locale="ru-RU"
                                        style={{
                                            width: 100
                                        }}
                                        onChange={(event, selectedDate) => {
                                            setLectureDateModalOpen(false);

                                            if (selectedDate) {
                                                setLectureDate(selectedDate);

                                                const values = { ...formikProps.values[typeSchema] };
                                                values.date = selectedDate.toISOString().split('T')[0];
                                                formikProps.handleChange(typeSchema)({
                                                    target: { value: values },
                                                });
                                            }
                                        }}
                                    />
                                )
                            ) : (
                                <DatePicker
                                    modal
                                    open={lectureDateModalOpen}
                                    date={formikProps.values[typeSchema].date ? new Date(formikProps.values[typeSchema].date) : new Date()}
                                    mode="date"
                                    locale="ru"
                                    title="Выберите дату"
                                    confirmText="Подтвердить"
                                    cancelText="Отмена"
                                    onConfirm={(date) => {
                                        setLectureDate(date);
                                        setLectureDateModalOpen(false);

                                        const values = { ...formikProps.values[typeSchema] };
                                        values.date = date.toISOString().split('T')[0];
                                        formikProps.handleChange(typeSchema)({
                                            target: { value: values },
                                        });
                                    }}
                                    onCancel={() => setLectureDateModalOpen(false)}
                                />
                            )}
                        </View>

                        <View
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 20,
                                marginRight: 20,
                            }}
                        >
                            <TouchableOpacity
                                style={{ alignItems: 'center' }}
                                onPress={() => setLectureStartTimeModalOpen(true)}
                            >
                                <Text style={{ color: '#000000' }}>Время начала лекции</Text>
                                <Text style={{ color: '#000000' }}>
                                    {lectureStartTime ? lectureStartTime.toLocaleTimeString('ru-RU') : '--------'}
                                </Text>
                            </TouchableOpacity>
                            {isIOS ? (
                                (
                                    <DateTimePicker
                                        value={lectureStartTime || new Date()}
                                        mode="time"
                                        display="default"
                                        locale="ru-RU"
                                        style={{
                                            width: 70
                                        }}
                                        is24Hour={true}
                                        onChange={(event, selectedTime) => {
                                            setLectureStartTimeModalOpen(false);

                                            if (selectedTime) {
                                                setLectureStartTime(selectedTime);

                                                const values = { ...formikProps.values[typeSchema] };
                                                values.from = selectedTime;
                                                formikProps.handleChange(typeSchema)({
                                                    target: { value: values },
                                                });
                                            }
                                        }}
                                    />
                                )
                            ) : (
                                <DatePicker
                                    modal
                                    open={lectureStartTimeModalOpen}
                                    date={formikProps.values[typeSchema].from ? new Date(formikProps.values[typeSchema].from) : new Date()}
                                    mode="time"
                                    locale="ru"
                                    title="Выберите время начала"
                                    confirmText="Подтвердить"
                                    cancelText="Отмена"
                                    is24hourSource="locale"
                                    onConfirm={(time) => {
                                        setLectureStartTime(time);
                                        setLectureStartTimeModalOpen(false);

                                        const values = { ...formikProps.values[typeSchema] };
                                        values.from = time;
                                        formikProps.handleChange(typeSchema)({
                                            target: { value: values },
                                        });
                                    }}
                                    onCancel={() => setLectureStartTimeModalOpen(false)}
                                />
                            )}
                        </View>

                        <View
                            style={{
                                marginBottom: 20,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <TouchableOpacity
                                style={{ alignItems: 'center' }}
                                onPress={() => setLectureEndTimeModalOpen(true)}
                            >
                                <Text style={{ color: '#000000' }}>Время окончания лекции</Text>
                                <Text style={{ color: '#000000' }}>
                                    {lectureEndTime ? lectureEndTime.toLocaleTimeString('ru-RU') : '--------'}
                                </Text>
                            </TouchableOpacity>
                            {isIOS ? (
                                (

                                    <DateTimePicker
                                        value={lectureEndTime || new Date()}
                                        mode="time"
                                        display="inline"
                                        locale="ru-RU"
                                        is24Hour={true}
                                        style={{
                                            width: 85
                                        }}
                                        onChange={(event, selectedTime) => {
                                            setLectureEndTimeModalOpen(false);
                                            if (selectedTime) {
                                                setLectureEndTime(selectedTime);

                                                const values = { ...formikProps.values[typeSchema] };
                                                values.to = selectedTime;
                                                formikProps.handleChange(typeSchema)({
                                                    target: { value: values },
                                                });
                                            }
                                        }}
                                    />
                                )
                            ) : (
                                <DatePicker
                                    modal
                                    open={lectureEndTimeModalOpen}
                                    date={formikProps.values[typeSchema].to ? new Date(formikProps.values[typeSchema].to) : new Date()}
                                    mode="time"
                                    locale="ru"
                                    title="Выберите время окончания"
                                    confirmText="Подтвердить"
                                    cancelText="Отмена"
                                    is24hourSource="locale"
                                    minimumDate={formikProps.values[typeSchema].from ? new Date(formikProps.values[typeSchema].from) : new Date()}
                                    onConfirm={(time) => {
                                        setLectureEndTime(time);
                                        setLectureEndTimeModalOpen(false);

                                        const values = { ...formikProps.values[typeSchema] };
                                        values.to = time;
                                        formikProps.handleChange(typeSchema)({
                                            target: { value: values },
                                        });
                                    }}
                                    onCancel={() => setLectureEndTimeModalOpen(false)}
                                />
                            )}
                        </View>
                    </View>
                </QuestionContent>
            )}
        </Formik>
    );
}
