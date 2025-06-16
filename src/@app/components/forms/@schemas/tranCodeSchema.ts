import * as Yup from "yup";

export const TranCodeSchema = Yup.object().shape({
  pstrnscd: Yup.string().nullable().max(25, "Length cannot more than 25").required("Field is required"),
  pstrndsc: Yup.string().nullable().max(255, "Length cannot more than 255").required("Field is required"),
  pstrnlds: Yup.string().nullable().max(255, "Length cannot more than 255"),
  pstrndcr: Yup.string().nullable().max(2, "Length cannot more than 2").required("Field is required"),
  pstrnaf1: Yup.string().nullable().max(10, "Length cannot more than 10").required("Field is required"),
  pstrnaf2: Yup.string().nullable().max(10, "Length cannot more than 10"),
  pstrnaf3: Yup.string().nullable().max(10, "Length cannot more than 10"),
  pstrntyp: Yup.string().nullable().max(10, "Length cannot more than 10").required('Field is required'),
  pstrnrev: Yup.string().nullable().max(10, "Length cannot more than 10"),
  pstrnarb: Yup.string().nullable().max(1, "Length cannot more than 1"),
  pstrnect: Yup.string().nullable().max(1, "Length cannot more than 1"),
  pstrnpsq: Yup.number().nullable(),
  });

