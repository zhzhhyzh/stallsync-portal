import * as Yup from "yup";

const contactNoRegExp = /^(?:[0-9]?){14}[0-9]$/;
const emailRegExp = /^\w+(?:[.-]\w+)*@\w+(?:[.-]\w+)*(?:\.\w{2,3})+$/;

export const MyProfileSchema = Yup.object().shape({
  psusrnam: Yup.string().max(50, "Length cannot more than 50").required("Field is required"),
  psusrphn: Yup.string().matches(contactNoRegExp, "Invalid Contact No format").required("Field is required"),
  psusreml: Yup.string().max(50, "Length cannot more than 50").matches(emailRegExp, "Invalid Email format").required("Field is required"),
});

export const PasswordSchema = Yup.object().shape({
  oldpassword: Yup.string().max(255, "Length cannot more than 255").required("This field is required"),
  newpassword: Yup.string().max(255, "Length cannot more than 255").required("This field is required")
    .test('password-match', 'New password cannot be same as your current password. Please choose a different password.', function (value) {
      const oldPassword = this.resolve(Yup.ref('oldpassword')) as string;
      return value !== oldPassword;
  }),
  conpassword: Yup.string().max(255, "Length cannot more than 255").required("This field is required")
  .test('newpassword-match', 'New Password & Confirm Password Must be Same.', function (value) {
    const newPassword = this.resolve(Yup.ref('newpassword')) as string;
    return value === newPassword;
  }),
});

export const PopUpPasswordSchema = Yup.object().shape({
  newpassword: Yup.string().max(255, "Length cannot more than 255").required("This field is required"),
  conpassword: Yup.string().max(255, "Length cannot more than 255").required("This field is required")
  .test('newpassword-match', 'New Password & Confirm Password Must be Same.', function (value) {
    const newPassword = this.resolve(Yup.ref('newpassword')) as string;
    return value === newPassword;
  }),
});