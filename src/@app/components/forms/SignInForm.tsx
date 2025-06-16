import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Text,
    useToast,
  } from "@chakra-ui/react";
  import { useFormik } from "formik";
  //import { SignInSchema } from "@app/components/forms/@schemas/authSchema";
  import Link from "next/link";
  import { postLogin } from "@app/redux/app/slice";
  import { useAppDispatch } from "@app/hooks/useRedux";
  import { showModal } from "@app/helpers/modalHelper";
  import useApi from "@app/hooks/useApi";
  import { useRouter } from "next/router";
  import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
  import { useState } from "react";
  
  export default function SignInForm({ toggleForm }: DefaultProps) {
    const router = useRouter();
    const { sendRequest, loading } = useApi({ title: "Sign in" });
  
    const [showPassword, setShowPassword] = useState(false);
  
    const formik = useFormik({
      initialValues: {
        username: "",
        password: "",
      },
      // validationSchema: SignInSchema,
      onSubmit: (values) => {
        onSubmit(values);
      },
    });
  
    async function onSubmit(values: any) {
      const { success } = await sendRequest({
        fn: postLogin(values),
        formik,
      });
  
      if (success) {
        //formik.resetForm()
        router.push("/dashboard");
      }
    }
  
    const handleShowPassword = () => {
      setShowPassword(!showPassword);
    };
  
    return (
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={4}>
          <FormControl id="username" isInvalid={Boolean(formik.errors.username)}>
            <FormLabel>Username</FormLabel>
            <Input
              id="username"
              name="username"
              onChange={formik.handleChange}
              value={formik.values.username}
              placeholder="Enter username"
            />
            {formik.errors.username && (
              <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl id="password" isInvalid={Boolean(formik.errors.password)}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                pr="4.5rem"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              <InputRightElement width="4.5rem">
                <IconButton
                  h="1.75rem"
                  size="sm"
                  variant="ghost"
                  onClick={handleShowPassword}
                  icon={showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  aria-label={""}
                />
              </InputRightElement>
            </InputGroup>
            {formik.errors.password && (
              <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
            )}
          </FormControl>
          <Stack spacing={10}>
            <Stack
              direction={{ base: "column", sm: "row" }}
              align={"start"}
              justify={"end"}
            >
              <Link href="/forgot_password" color={"blue.400"}>
                <Text fontSize="sm">?</Text>
              </Link>
            </Stack>
            <div className="flex flex-col gap-3">
              <Button variant={"primary"} type="submit" isLoading={loading}>
                Sign in
              </Button>
              {/* <Button
                              variant={'secondary'}
                              type='button'
                              onClick={toggleForm}
                          >
                              Create an account
                          </Button> */}
            </div>
          </Stack>
        </Stack>
      </form>
    );
  }
  
  interface DefaultProps {
    toggleForm: () => void
  }
  