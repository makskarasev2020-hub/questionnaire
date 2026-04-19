import React, { useEffect, useState } from 'react';
import QuestionContent from './root/QuestionContainer';
import AppSelectSearch from '../app/root/AppSelectSearch';
import { Formik } from 'formik';
import useFetchItems from '../hooks/useFetchItems';
import * as yup from 'yup';

export default function QuestionWhoOrganized(props) {
    const [fetchItems] = useFetchItems();
    const [organizeds, setOrganizeds] = useState([]);

    useEffect(() => {
        const fetchList = async () => {
            const { items } = await fetchItems(props.data.options.values_url);
            setOrganizeds(items);
        };
        fetchList();
    }, []);

    const validationSchema = yup.object().shape({
        organized: yup.string().required(),
    });

    return (
        <Formik
            initialValues={{
                organized: null,
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
                        (!formikProps.errors.default && formikProps.values.default) ||
                        !props.data.options.is_required
                    }
                    onNext={formikProps.submitForm}>
                    <AppSelectSearch
                        value={formikProps.values.organized}
                        items={organizeds}
                        placeholder="Выбрать из списка"
                        onChange={value => {
                            return formikProps.handleChange('organized')({
                                target: { value },
                            });
                        }}
                    />
                </QuestionContent>
            )}
        </Formik>
    );
}
