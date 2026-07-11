import * as yup from 'yup';
import React, { useState, useEffect } from 'react';
import QuestionContent from './root/QuestionContainer';
import AppSelectSearch from '../app/root/AppSelectSearch';
import useFetchItems from '../hooks/useFetchItems';
import { Formik } from 'formik';

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
            initialValues={{
                lecture: null,
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
                    onNext={formikProps.submitForm}
                    isValid={
                        (!formikProps.errors.default && formikProps.values.default) ||
                        !props.data.options.is_required
                    }>
                    <AppSelectSearch
                        value={formikProps.values.lecture}
                        items={lectures}
                        placeholder="Выбрать из списка"
                        onChange={value => {
                            return formikProps.handleChange('lecture')({ target: { value } });
                        }}
                    />
                </QuestionContent>
            )}
        </Formik>
    );
}
