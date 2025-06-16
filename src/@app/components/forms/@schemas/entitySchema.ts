import * as Yup from "yup";

const contactNoRegExp = /^(?:[0-9]?){14}[0-9]$/;
const emailRegExp = /^\w+(?:[.-]\w+)*@\w+(?:[.-]\w+)*(?:\.\w{2,3})+$/;
const postcodeRegExp = /^\d{5}$/;

export const EntityAddSchema = Yup.object().shape({
    psentuid: Yup.string().max(5, "Length cannot more than 5").required("Field is required"),
    // psenttyp: Yup.string().max(10, "Length cannot more than 10").required("Field is required"),
    psentpid: Yup.string().max(50, "Length cannot more than 50").optional(),
    // psentssm: Yup.string().max(150, "Length cannot more than 150").required("Field is required"),
    // psentkpn: Yup.string().max(255, "Length cannot more than 255").required("Field is required"),
    // psentkpd: Yup.mixed().required("Field is required"),
    psentnme: Yup.string().max(255, "Length cannot more than 255").required("Field is required"),
    psentjdt: Yup.mixed().required("Field is required"),
    // psentdoi: Yup.mixed().optional(),
    psentad1: Yup.string().max(255, "Length cannot more than 255").required("Field is required"),
    // psentad2: Yup.string().max(255, "Length cannot more than 255").optional(),
    psentpos: Yup.string().max(10, "Length cannot more than 10").matches(postcodeRegExp, "Invalid format").required("Field is required"),
    psentcty: Yup.string().max(100, "Length cannot more than 100").required("Field is required"),
    psentsta: Yup.string().max(10, "Length cannot more than 10").required("Field is required"),
    psentpic: Yup.string().max(255, "Length cannot more than 255").required("Field is required"),
    psentphn: Yup.string().max(50, "Length cannot more than 50").matches(contactNoRegExp, "Invalid format").required("Field is required"),
    psentpem: Yup.string().max(255, "Length cannot more than 255").matches(emailRegExp, "Invalid format").required("Field is required"),
    psentpc2: Yup.string().max(255, "Length cannot more than 255"),
    psentpn2: Yup.string().max(50, "Length cannot more than 50").matches(contactNoRegExp, "Invalid format"),
    psentpm2: Yup.string().max(255, "Length cannot more than 255").matches(emailRegExp, "Invalid format"),

  });

export const EntityUpdateSchema = Yup.object().shape({
  // psentuid: Yup.string().max(50, "Length cannot more than 50").required("Field is required"),
    // psenttyp: Yup.string().max(10, "Length cannot more than 10").required("Field is required"),
    psentpid: Yup.string().max(50, "Length cannot more than 50").optional(),
    // psentssm: Yup.string().max(150, "Length cannot more than 150").required("Field is required"),
    // psentkpn: Yup.string().max(255, "Length cannot more than 255").required("Field is required"),
    // psentkpd: Yup.mixed().required("Field is required"),
    psentnme: Yup.string().max(255, "Length cannot more than 255").required("Field is required"),
    psentjdt: Yup.mixed().required("Field is required"),
    // psentdoi: Yup.mixed().optional(),
    psentad1: Yup.string().max(255, "Length cannot more than 255").required("Field is required"),
    // psentad2: Yup.string().max(255, "Length cannot more than 255").optional(),
    psentpos: Yup.string().max(10, "Length cannot more than 10").matches(postcodeRegExp, "Invalid format").required("Field is required"),
    psentcty: Yup.string().max(100, "Length cannot more than 100").required("Field is required"),
    psentsta: Yup.string().max(10, "Length cannot more than 10").required("Field is required"),
    psentpic: Yup.string().max(255, "Length cannot more than 255").required("Field is required"),
    psentphn: Yup.string().max(50, "Length cannot more than 50").matches(contactNoRegExp, "Invalid format").required("Field is required"),
    psentpem: Yup.string().max(255, "Length cannot more than 255").matches(emailRegExp, "Invalid format").required("Field is required"),
    psentsts: Yup.string().max(10, "Length cannot more than 10").required("Field is required"),
    psentpc2: Yup.string().max(255, "Length cannot more than 255"),
    psentpn2: Yup.string().max(50, "Length cannot more than 50").matches(contactNoRegExp, "Invalid format"),
        psentpm2: Yup.string().max(255, "Length cannot more than 255").matches(emailRegExp, "Invalid format"),
});
