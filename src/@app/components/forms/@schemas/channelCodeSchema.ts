import * as Yup from "yup";

export const ChannelCodeSchema = Yup.object().shape({
    pschncde: Yup.string().max(10, "Length cannot longer than 10 characters").required("Field is required"),
    pschntyp: Yup.string().max(10, "Length cannot longer than 10 characters").required("Field is required"),
    pschndsc: Yup.string().max(255, "Length cannot longer than 255 characters").required("Field is required"),
    pschnlds: Yup.string().max(255, "Length cannot longer than 255 characters").optional(),
    pschnenp: Yup.string().required("Field is required"),

    pschnscc: Yup.string().optional(),
    pschnsnd: Yup.string().max(255, "Length cannot longer than 255 characters").optional(),
    pschnsts: Yup.string().optional(),
    pschnstd: Yup.date().optional(),
    pschnprt: Yup.string().optional(),

    pschnaut: Yup.string().max(10, "Length cannot longer than 10 characters").required("Field is required"),

    pschnunm: Yup.string().when('pschnaut', {
        is: 'PWD', 
        then: (schema: any) => schema.required("Field is required"),
        otherwise: (schema: any) => schema.optional(), 
    }),
    pschnpwd: Yup.string().when('pschnaut', {
        is: 'PWD', 
        then: (schema: any) => schema.required("Field is required"),
        otherwise: (schema: any) => schema.optional(), 
    }),

    pschnapk: Yup.string().when('pschnaut', {
        is: 'APISK', 
        then: (schema: any) => schema.required("Field is required"),
        otherwise: (schema: any) => schema.optional(), 
    }),
    pschnsrt: Yup.string().when('pschnaut', {
        is: 'APISK', 
        then: (schema: any) => schema.required("Field is required"),
        otherwise: (schema: any) => schema.optional(), 
    }),


});