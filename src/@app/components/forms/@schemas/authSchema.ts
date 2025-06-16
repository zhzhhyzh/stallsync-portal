import * as Yup from 'yup';

const emailRegExp = /^\w+(?:[.-]\w+)*@\w+(?:[.-]\w+)*(?:\.\w{2,3})+$/;

export const SignInSchema = Yup.object().shape({
    username: Yup.string().required(),
    password: Yup.string().required(),
});

export const SignUpSchema = Yup.object().shape({
    username: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().min(6).required(),
    password2: Yup.string().min(6).oneOf([Yup.ref('password')], 'Passwords must match').required("Field is required"),
});

export const ForgotPasswordSchema = Yup.object().shape({
    //username: Yup.string().required("Username is a required field"),
    email: Yup.string().matches(emailRegExp, "Invalid Email format").required("Field is required"),
});