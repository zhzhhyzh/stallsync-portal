import * as Yup from "yup";

export const FileManagementSchema = Yup.object().shape({
  // pstblnme: Yup.string().max(255, "Length cannot more than 255").required("Field is required"),
  pstbltyp: Yup.string().required("Field is required"),
  // pstblkey: Yup.string().max(10, "Length cannot more than 10").required("Field is required"),
  pstbldsc: Yup.string().max(255, "Length cannot more than 255").required("Field is required"),
  pstbllds: Yup.string().max(255, "Length cannot more than 255").optional(),
  // pstblpnt: Yup.string().max(255, "Length cannot more than 255").optional(),

  pstblnme: Yup.string().max(255, "Length cannot more than 255").required("Field is required"),
  pstblpnt: Yup.string().optional().notOneOf([Yup.ref('pstblnme')], 'File name and parent file cannot be same'),

});