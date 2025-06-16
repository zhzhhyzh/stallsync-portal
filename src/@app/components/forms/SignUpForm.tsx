import { Button, FormControl, FormErrorMessage, FormLabel, Input, Stack, useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import { SignUpSchema } from "@app/components/forms/@schemas/authSchema";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useAppDispatch } from "@app/hooks/useRedux";
//import { postRegister } from "@app/redux/app/slice";
//import { showToast } from "@app/helpers/toastHelper";
import { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { showModal } from "@app/helpers/modalHelper";

export default function SignUpForm({ toggleForm }: DefaultProps) {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { sendRequest, loading } = useApi({ title: "Create an account" })

    const formik = useFormik({
        initialValues: {
            email: '',
            username: '',
            password: '',
            password2: '',
        },
        // validationSchema: SignUpSchema,
        onSubmit: (values) => {
            onSubmit(values)
        },
    })

    async function onSubmit(values: any) {
        formik.resetForm()
        toggleForm()
        showModal(dispatch, {
            title: "Create an account",
            message: "Please login"
        })
        return
        // const { payload } = await sendRequest({
        //     // fn: () => postLogin(values),
        //     formik,
        // })
        // if (payload?.success) {
        //     formik.resetForm()
        //     router.push('/dashboard')
        // }
    }

    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack spacing={4}>
                <FormControl isInvalid={Boolean(formik.errors.username)}>
                    <FormLabel>Username</FormLabel>
                    <Input
                        id="username"
                        name='username'
                        onChange={formik.handleChange}
                        value={formik.values.username}
                        placeholder='Enter username'
                    />
                    {
                        formik.errors.username && <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
                    }
                </FormControl>
                <FormControl isInvalid={Boolean(formik.errors.email)}>
                    <FormLabel>Email</FormLabel>
                    <Input
                        id="email"
                        name='email'
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        placeholder='Enter email'
                    />
                    {
                        formik.errors.email && <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                    }
                </FormControl>
                <FormControl isInvalid={Boolean(formik.errors.password)}>
                    <FormLabel>Password</FormLabel>
                    <Input
                        type="password"
                        id="password"
                        name='password'
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        placeholder='Enter password'
                    />
                    {
                        formik.errors.password && <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                    }
                </FormControl>
                <FormControl isInvalid={Boolean(formik.errors.password2)}>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                        type="password"
                        id="password2"
                        name='password2'
                        onChange={formik.handleChange}
                        value={formik.values.password2}
                        placeholder='Enter confirm password'
                    />
                    {
                        formik.errors.password2 && <FormErrorMessage>{formik.errors.password2}</FormErrorMessage>
                    }
                </FormControl>
                <Stack spacing={3}>
                    <Button
                        variant='danger'
                        type='submit'
                    >
                        Sign Up
                    </Button>
                    <Button
                        type='button'
                        onClick={toggleForm}
                    >
                        Back to sign in
                    </Button>
                </Stack>
            </Stack>
        </form>
    )
}

interface DefaultProps {
    toggleForm: () => void
}