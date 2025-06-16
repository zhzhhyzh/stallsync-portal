import * as Yup from 'yup';

export const TestSchema = Yup.object().shape({
    input1: Yup.string().required(),
    input2: Yup.string().required(),
});
