import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { Formik } from 'formik';
import QuestionContent from './root/QuestionContainer';
import AppSelectSearch from '../app/root/AppSelectSearch';
import useFetchItems from '../hooks/useFetchItems';

export default function QuestionLecturer(props) {
    const [fetchItems] = useFetchItems();
    const [lectures, setLectures] = useState([]);

    useEffect(() => {
        (async () => {
            const { items } = await fetchItems(props.data.options.values_url);
            setLectures(items);
        })();
    }, []);

    const validationSchema = yup.object().shape({
        lecture: yup.string().required(),
    });

    return (
        <Formik
            initialValues={{ lecture: '' }}
            validateOnMount={props.validateOnMount}
            onSubmit={(values) => {
                props.onNext(values.lecture); // send plain string name
            }}
            validationSchema={validationSchema}
        >
            {formikProps => (
                <QuestionContent
                    {...props}
                    onNext={formikProps.submitForm}
                    isValid={
                        (!formikProps.errors.lecture && !!formikProps.values.lecture) ||
                        !props.data.options.is_required
                    }>
                    <AppSelectSearch
                        value={formikProps.values.lecture}
                        items={lectures}
                        placeholder="Выбрать из списка"
                        onChange={value => {
                            formikProps.handleChange('lecture')({ target: { value } });
                        }}
                    />
                </QuestionContent>
            )}
        </Formik>
    );
}
