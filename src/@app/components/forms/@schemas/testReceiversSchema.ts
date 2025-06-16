import * as Yup from 'yup';

export const TestReceiversSchema = Yup.object().shape({
    psusrunm: Yup.string().max(255, "Length cannot longer than 255 characters").required("Field is required"),
    pstrctyp: Yup.string().max(10, "Length cannot more than 10").required("Field is required"),
    pstrcphn: Yup.string().max(255, "Length cannot more than 255"),
});