// Chakra imports
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
  Stack,
} from "@chakra-ui/react";
// assets
import React, { useState } from "react";

import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";
import { IoSave } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";

import { showModal } from "@app/helpers/modalHelper";
import { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import { changeUserPassword } from "@app/redux/user/slice";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { PasswordSchema } from "@app/components/forms/@schemas/profileSchema";
import Colors from "@app/constants/Colors";
import { logout } from "@app/redux/app/slice";
import Buttons from "@app/components/common/Buttons/Buttons";
import { Form, Space } from "antd";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";

export default function MyProfileForm() {
  const { sendRequest, loading } = useApi({title:"My Profile"})
  const dispatch = useAppDispatch();
  const router = useRouter()
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);
  const mode = String(router.query?.mode);

  const formik = useFormik({
      enableReinitialize: true,
      initialValues: {
        oldpassword: "",
        newpassword: "",
        conpassword: ""
      },
      validationSchema: PasswordSchema,
      onSubmit: (values) => {
        let { oldpassword, newpassword, conpassword } = values;
        let postData = {
          password: oldpassword,
          newpassword,
          conpassword
        }
        onSubmit(postData);
      },
  });

  async function onSubmit(data: any) {
    const { success } = await sendRequest({
      fn: changeUserPassword(data),
      formik,
    })

    if (success) {
        setTimeout(() => {
          showModal(dispatch, {
            title: "Change Password",
            message: "Record Updated",
          });
          formik.resetForm();
          if(mode === "FORCE") {
            dispatch(logout());
            router.replace("/");
          }
      }, 200);
    }
  }

  const handleShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };

  const handleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleShowConPassword = () => {
    setShowConPassword(!showConPassword);
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit} style={mode === "FORCE" ? { display: "flex", flexDirection: "column", alignItems: "center"} : {}}>
        {
           mode !== "FORCE" ? (
            <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
              <Flex direction={"column"} alignSelf={"center"}>
                <Text fontSize={"3xl"} fontWeight="500" mb={1}>
                  Change Password
                </Text>
                <Breadcrumbs breadcrumbItems={[
                      {
                        title: "Change Password",
                      },
                    ]} />
              </Flex>
              <Box
                display={"flex"}
                alignSelf={"center"}
                  pr={{
                    base: 0,
                    md: Spacing.containerPx,
                  }}
              >
                <Space size="small">
                  <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
                </Space>
              </Box>
            </Flex>
           ) : (
            <Flex pl={4} pr={4} pt={10}>
              <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
                  Change Password
              </Text>
            </Flex>
           )
        }

        <Card
            p={4}
            mt={`${Spacing.containerPx}`}
            className="grid grid-cols-1 gap-6"
            width={mode === "FORCE" ? "400px" : "100%"}
        >
          <Box>
            <div className="flex flex-col sm:flex-row gap-6">
              <Box display="flex" flexDir="column" gap={6} width={mode === "FORCE" ? "100%" : "50%"}>
                <FormControl
                    id="oldpassword"
                    isInvalid={Boolean(formik.errors.oldpassword) && Boolean(formik.touched.oldpassword)}
                >
                    {/* <FormLabel>Current Password*</FormLabel> */}
                    <CustomFormLabel labelText="Current Password"/>
                    <InputGroup>
                      <Input
                        pr="4.5rem"
                        type={showOldPassword ? "text" : "password"}
                        placeholder="Enter Current Password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.oldpassword}
                      />
                      <InputRightElement width="4.5rem">
                        <IconButton
                        h="1.75rem"
                        size="sm"
                        variant="ghost"
                        onClick={handleShowOldPassword}
                        icon={showOldPassword ? <ViewIcon /> : <ViewOffIcon />} aria-label={""}                      />
                      </InputRightElement>
                    </InputGroup>
                    {formik.errors.oldpassword && (
                        <FormErrorMessage>{formik.errors.oldpassword}</FormErrorMessage>
                    )}
                </FormControl>
                <FormControl
                    id="newpassword"
                    isInvalid={Boolean(formik.errors.newpassword) && Boolean(formik.touched.newpassword)}
                >
                    {/* <FormLabel>New Password*</FormLabel> */}
                    <CustomFormLabel labelText="New Password"/>
                    <InputGroup>
                      <Input
                        pr="4.5rem"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter New Password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.newpassword}
                      />
                      <InputRightElement width="4.5rem">
                        <IconButton
                        h="1.75rem"
                        size="sm"
                        variant="ghost"
                        onClick={handleShowNewPassword}
                        icon={showNewPassword ? <ViewIcon /> : <ViewOffIcon />} aria-label={""}                      />
                      </InputRightElement>
                    </InputGroup>
                    {formik.errors.newpassword && (
                        <FormErrorMessage>{formik.errors.newpassword}</FormErrorMessage>
                    )}
                </FormControl>
                <FormControl
                    id="conpassword"
                    isInvalid={Boolean(formik.errors.conpassword) && Boolean(formik.touched.conpassword)}
                >
                    {/* <FormLabel>Confirm Password*</FormLabel> */}
                    <CustomFormLabel labelText="Confirm Password"/>
                    <InputGroup>
                      <Input
                        pr="4.5rem"
                        type={showConPassword ? "text" : "password"}
                        placeholder="Enter Confirm Password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.conpassword}
                      />
                      <InputRightElement width="4.5rem">
                        <IconButton
                        h="1.75rem"
                        size="sm"
                        variant="ghost"
                        onClick={handleShowConPassword}
                        icon={showConPassword ? <ViewIcon /> : <ViewOffIcon />} aria-label={""}                      />
                      </InputRightElement>
                    </InputGroup>
                    {formik.errors.conpassword && (
                        <FormErrorMessage>{formik.errors.conpassword}</FormErrorMessage>
                    )}
                </FormControl>
              </Box>
            </div>
            {
              mode === "FORCE" && (
                <Stack pt={5} pb={4}>
                  <Buttons 
                    buttonDefaultType={"CUSTOM"} 
                    buttonSize={"md"}
                    borderRadius={15}
                    buttonFontWeight={"semibold"}
                    buttonText="Submit"
                    type="submit"
                    buttonLoading={loading} 
                  />
                </Stack>
              )
            }
          </Box>
        </Card>
        {
          mode !== "FORCE" && (
            <Flex justifyContent="flex-end" pl={10} pr={10} pt={10} >
              <Box>
                <Space size="small">
                  <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
                </Space>
              </Box>
            </Flex>
          )
        }
      </form>
    </>
  );
}
