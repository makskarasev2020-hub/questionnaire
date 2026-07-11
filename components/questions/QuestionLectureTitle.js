import React, { useEffect, useState } from 'react';
import * as yup from 'yup';

import { Formik } from 'formik';
import QuestionContent from './root/QuestionContainer';
import AppSelectSearch from '../app/root/AppSelectSearch';
import useFetchItems from '../hooks/useFetchItems';

export default function QuestionLectureTitle(props) {
    const [fetchItems] = useFetchItems();
    const [titles, setTitles] = useState([]);

    useEffect(() => {
        (async () => {
            const { items } = await fetchItems(props.data.options.values_url);
            setTitles(items);
        })();
    }, []);

    const validationSchema = yup.object().shape({
        title: yup.string().required(),
    });

    return (
        <Formik
            initialValues={{
                title: '',
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
                        value={formikProps.values.title}
                        items={titles}
                        placeholder="Выбрать из списка"
                        onChange={value => {
                            return formikProps.handleChange('title')({ target: { value } });
                        }}
                    />
                </QuestionContent>
            )}
        </Formik>
    );
}
