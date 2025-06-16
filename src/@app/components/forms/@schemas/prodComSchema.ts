import * as Yup from "yup";

export const ProdComSchema = Yup.object().shape({
  psprdcde: Yup.string().nullable().required("Field is required").max(10, "Length cannot more than 10"),
  pscomstp: Yup.string().nullable().required("Field is required").max(10, "Length cannot more than 10"),
  pscomdsg: Yup.string().nullable().required("Field is required").max(10, "Length cannot more than 10"),
  pscomsts: Yup.string().nullable().required("Field is required").max(10, "Field is required"),
  pscombbn: Yup.string().nullable().required("Field is required").max(10, "Field is required"),
  pscomsyr: Yup.number().typeError('Value must be a number').optional().nullable(),
  pscomtyr: Yup.number().typeError('Value must be a number').optional().nullable(),
  pscomosy: Yup.number().typeError('Value must be a number').optional().nullable(),
  pscomoty: Yup.number().typeError('Value must be a number').optional().nullable(),
 
  pscomefd: Yup.string().required("Field is required").nullable(),
 
  pscomfyr: Yup
  .number()
  .typeError("Value must be a number")
  .nullable()
  .when("pscomsts", {
    is: "Y",
    then: (schema) => schema.required("Field is required").positive("Amount must be greater than 0"),
  }),

pscomftc: Yup
  .string().nullable()
  .when("pscomsts", {
    is: "Y",
    then: (schema) => schema.required("Field is required").max(25, "Length cannot more than 25"),
  }),

  pscomofy: Yup.number()
  .typeError('Value must be a number')
  .optional().nullable(),
 
  pscomstc: Yup
  .string().nullable()
  .when("pscomsyr", {
    is: (val: any) => val !== undefined && val !== null && val !== 0,
    then: (schema) => schema.required("Field is required").max(25, "Length cannot more than 25"),
  }),
  pscomttc: Yup
  .string().nullable()
  .when("pscomtyr", {
    is: (val: any) => val !== undefined && val !== null && val !== 0,
    then: (schema) => schema.required("Field is required").max(25, "Length cannot more than 25"),
  }),

  pscomoct: Yup
  .string().nullable()
  .when("pscomofy", {
    is: (val: any) => (val !== undefined && val !== null && val !== 0),
    then: (schema) => schema.required("Field is required").max(25, "Length cannot more than 25"),
  }),
  pscomost: Yup
  .string().nullable()
  .when("pscomosy", {
    is: (val: any) => val !== undefined && val !== null && val !== 0,
    then: (schema) => schema.required("Field is required").max(25, "Length cannot more than 25"),
  }),
  pscomott: Yup
  .string().nullable()
  .when("pscomoty", {
    is: (val: any) => val !== undefined && val !== null && val !== 0,
    then: (schema) => schema.required("Field is required").max(25, "Length cannot more than 25"),
  }),
  pscombbp: Yup
    .number()
    .typeError("Value must be a number")
    
    .nullable()
    .when("pscombbn", {
      is: "Y",
      then: (schema) => schema.required("Field is required").positive("Amount must be greater than 0"),
    }),

  pscombbt: Yup
    .string().nullable()
    .when("pscombbn", {
      is: "Y",
      then: (schema) => schema.required("Field is required").max(25, "Length cannot more than 25"),
    }),

});
