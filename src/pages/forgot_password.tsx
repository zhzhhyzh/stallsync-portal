import { Button, FormControl, FormErrorMessage, FormLabel, Input, Stack, Text, useToast, Box } from "@chakra-ui/react";
import { useFormik } from "formik";
import type { NextPage } from 'next';
import { ForgotPasswordSchema } from "@app/components/forms/@schemas/authSchema";
import Link from "next/link";
import { postLogin } from "@app/redux/app/slice";
import { useAppDispatch } from "@app/hooks/useRedux";
// import { showToast } from "@app/helpers/ModalDialog";
import useApi from "@app/hooks/useApi";
import { useRouter } from "next/router";
import { showModal } from "@app/helpers/modalHelper";
import Layout from "@app/components/@Layout/Layout";
import Colors from "@app/constants/Colors";
import { postForgotPW } from "@app/redux/app/slice";
import Card from "@app/components/common/Card/Card";


const ForgotPassword = () => {
    const router = useRouter()
    const dispatch = useAppDispatch();
    const { sendRequest, loading } = useApi({title: "Forgot Password"})

    const initialValues = {
        username: "",
        email: "",
      };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        validationSchema: ForgotPasswordSchema,
        onSubmit: (values) => {
          onSubmit(values);
        },
      });


    async function onSubmit(values: any) {
        const { success, message } = await sendRequest({
          fn: postForgotPW({
            username: values.username,
            email: values.email,
          }),
          formik,
        });

        if (success) {
          setTimeout(() => {
            showModal(dispatch, {
            title: "Forgot Password",
            message:  (<>
            A password reset email has been sent to your registered email address.
            <br />
            If you do not receive the email in your in box, kindly check your spam or junk folder.
          </>)
            });
            router.back();
          }, 200);
        }
      }

    return (
        <div className="flex flex-col items-center justify-center w-full h-full" style={{
            // backgroundColor: "turquoise",
            flex: 1,
            // backgroundImage: `url('${bgImage.src}')`,
            // backgroundPosition: "right center",
            // backgroundSize: "contain",
            // backgroundRepeat: "no-repeat",
            minHeight: "70vh",
            top: 0,
            left: 0,
            position: "relative",
            // width: "100vw",
            // height: "100vh",
            width: "100%",
            height: "100%",
          }}>
          
        <form onSubmit={formik.handleSubmit} style={{
        }}>
            <Card p={8}>
            <Text textAlign='center' fontSize='2xl' mt={3} color={Colors.PRIMARY}>Forgot Password ?</Text>
            <Text textAlign='center' fontSize="md" mt={3} mb={5} color={Colors.INFO}>Please enter your Email Address</Text>
                {/* <FormControl id="username" isInvalid={Boolean(formik.errors.username)}>
                    <FormLabel>Username</FormLabel>
                    <Input
                        id="username"
                        name='username'
                        onChange={formik.handleChange}
                        value={formik.values.username}
                        placeholder="Enter username"
                        width={"md"}
                    />
                    {
                        formik.errors.username && <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
                    }
                </FormControl> */}
                <FormControl id="email" isInvalid={Boolean(formik.errors.email)} style={{
                  marginTop: 10
                }}>
                    <FormLabel></FormLabel>
                    <Input
                        id="email"
                        name='email'
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        placeholder="Enter email address"
                        width={"md"}
                    />
                    {
                        formik.errors.email && <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                    }
                </FormControl>


                <Stack spacing={10} pt={5} pb={4}>
                    <div className="flex flex-col gap-3">
                        <Button
                            variant={'primary'}
                            type='submit'
                            isLoading={loading}
                            // width={"fit-content"}
                            // onClick={(values) => onSubmit(
                            //   values
                            // )}
                        >
                            SUBMIT
                        </Button>
                        <Button
                            variant={"solid"}
                            type='button'
                            // width={}
                            onClick={() => router.back()}
                        >
                            BACK
                        </Button>
                    </div>
                </Stack>
            </Card>
        </form>
        </div>
    )
}

export default ForgotPassword;

// interface DefaultProps {
//     toggleForm: () => void
// }