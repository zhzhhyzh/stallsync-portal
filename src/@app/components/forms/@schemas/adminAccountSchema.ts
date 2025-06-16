import * as Yup from "yup";

const contactNoRegExp = /^(?:[0-9]?){14}[0-9]$/;
const emailRegExp = /^\w+(?:[.-]\w+)*@\w+(?:[.-]\w+)*(?:\.\w{2,3})+$/;

export const AdminAccountSchema = Yup.object().shape({
  psusrunm: Yup.string().max(50, "Length cannot more than 50").required("Field is required"),
  psusrnam: Yup.string().max(50, "Length cannot more than 50").required("Field is required"),
  psusrphn: Yup.string().matches(contactNoRegExp, "Invalid Contact No format").required("Field is required"),
  //psusreml: Yup.string().max(50, "Email length cannot more than 50").email("Invalid Email format").required("Email is required"),
  psusreml: Yup.string().max(50, "Length cannot more than 50").matches(emailRegExp, "Invalid Email format").required("Field is required"),
  psaplaid: Yup.string().when("isagent", {
    is: "Y",
    then: (schema: any) => schema.required("Field is required"),
    otherwise: (schema: any) => schema.nullable().optional(),
  }),
  psentuid: Yup.string().when("isagent", {
    is: "Y",
    then: (schema: any) => schema.required("Field is required"),
    otherwise: (schema: any) => schema.nullable().optional(),
  }),
});

export const AdminAccountSchemaAdd = Yup.object().shape({
  psusrunm: Yup.string().max(50, "Length cannot more than 50").required("Field is required"),
  psusrnam: Yup.string().max(50, "Length cannot more than 50").required("Field is required"),
  psusrphn: Yup.string().matches(contactNoRegExp, "Invalid Contact No format").required("Field is required"),
  //psusreml: Yup.string().max(50, "Email length cannot more than 50").email("Invalid Email format").required("Email is required"),
  psusreml: Yup.string().max(50, "Length cannot more than 50").matches(emailRegExp, "Invalid Email format").required("Field is required"),
  psusrpwd: Yup.string().required("Field is required"),
  psusrrol: Yup.string().required("Field is required"),
  psaplaid: Yup.string().when("isagent", {
    is: "Y",
    then: (schema: any) => schema.required("Field is required"),
    otherwise: (schema: any) => schema.nullable().optional(),
  }),
  psentuid: Yup.string().when("isagent", {
    is: "Y",
    then: (schema: any) => schema.required("Field is required"),
    otherwise: (schema: any) => schema.nullable().optional(),
  }),
});