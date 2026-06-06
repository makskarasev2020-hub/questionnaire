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
            initialValues={{ title: '', titleId: null }}
            validateOnMount={props.validateOnMount}
            onSubmit={(values) => {
                // Backend does Lecture::find((int)$result->answer) — must send numeric ID
                props.onNext(values.titleId ?? values.title);
            }}
            validationSchema={validationSchema}
        >
            {formikProps => (
                <QuestionContent
                    {...props}
                    onNext={formikProps.submitForm}
                    isValid={
                        (!formikProps.errors.title && !!formikProps.values.title) ||
                        !props.data.options.is_required
                    }>
                    <AppSelectSearch
                        value={formikProps.values.title}
                        items={titles}
                        placeholder="Выбрать из списка"
                        onChange={value => {
                            // value is item.name (string) — find the full item to get its id
                            const found = titles.find(t => t.name === value);
                            formikProps.setFieldValue('titleId', found?.id ?? null);
                            formikProps.handleChange('title')({ target: { value } });
                        }}
                    />
                </QuestionContent>
            )}
        </Formik>
    );
}
