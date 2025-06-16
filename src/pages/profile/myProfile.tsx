// Chakra imports
import Colors from "@app/constants/Colors";
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";

import { DatePicker, Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { IoSave } from "react-icons/io5";
import { useAppDispatch } from "@app/hooks/useRedux";

import { showModal } from "@app/helpers/modalHelper";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import { fetchUserProfile, updateUserProfile } from "@app/redux/user/slice";
import useFetchUserProfile from "@app/hooks/selector/useFetchUserProfile";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { MyProfileSchema } from "@app/components/forms/@schemas/profileSchema";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
import router from "next/router";

export default function MyProfileForm() {
  const { sendRequest, loading } = useApi({title:"My Profile"})
  const dispatch = useAppDispatch();
  const [detailData] = useFetchUserProfile();
  const [ddlData] = useFetchDDL({code: ["USRSTS","USRROLE"]});
  
  const initialValues = {
    psusrunm: "",
    psusrnam: "",
    psusrphn: "",
    psusreml: "",
    psusrrol: "",
    psusrsts: "",
  };

  const formik = useFormik({
      enableReinitialize: true,
      initialValues: initialValues,
      validationSchema: MyProfileSchema,
      onSubmit: (values) => {
          onSubmit(values);
      },
  });

  useEffect(() => {
    if (detailData && Object.keys(detailData).length > 0) {
      formik.setValues({
        ...detailData,
        id: detailData?.psusrunm,
      });
    }
  }, [detailData]);

  async function onSubmit(data: any) {
    const { success } = await sendRequest({
      fn: updateUserProfile(data),
      formik,
    })

    if (success) {
        setTimeout(async () => {
          showModal(dispatch, {
            title: "My Profile",
            message: "Record Updated",
          });
          await dispatch(fetchUserProfile());
      }, 200);
    }
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="500" mb={1}>
            My Profile
          </Text>
          <Breadcrumbs breadcrumbItems={[
              {
                title: "My Profile",
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
      <Card
          p={4}
          mt={`${Spacing.containerPx}`}
          className="grid grid-cols-1 gap-6"
      >
        <Box>
          <div className="flex flex-col sm:flex-row gap-6">
            <Box display="flex" flexDir="column" gap={6} width="100%">
              <FormControl
                  id="psusrunm"
                  isInvalid={Boolean(formik.errors.psusrunm) && Boolean(formik.touched.psusrunm)}
                  isDisabled={true}
              >
                  <FormLabel>User ID</FormLabel>
                  <Input
                      placeholder={"Enter User ID"}
                      type="text"
                      name="psusrunm"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.psusrunm}
                  />
                  {formik.errors.psusrunm && (
                      <FormErrorMessage>{formik.errors.psusrunm}</FormErrorMessage>
                  )}
              </FormControl>
              <FormControl
                  id="psusrnam"
                  isInvalid={Boolean(formik.errors.psusrnam) && Boolean(formik.touched.psusrnam)}
              >
                  {/* <FormLabel>Name*</FormLabel> */}
                  <CustomFormLabel labelText="Name"/>
                  <Input
                      placeholder={"Enter Name"}
                      type="text"
                      name="psusrnam"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.psusrnam}
                  />
                  {formik.errors.psusrnam && (
                      <FormErrorMessage>{formik.errors.psusrnam}</FormErrorMessage>
                  )}
              </FormControl>
              <FormControl
                  id="psusrrol"
                  isInvalid={Boolean(formik.errors.psusrrol) && Boolean(formik.touched.psusrrol)}
                  isDisabled={true}
              >
                  <FormLabel>User Role</FormLabel>
                  <Select 
                    placeholder="Please Select User Role" 
                    value={"ADM"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                      {
                        ddlData?.USRROLE?.map((option: DDL_TYPES) => (
                          <option key={option.prgecode} value={option.prgecode}>
                              {option.prgedesc}
                          </option>
                        ))
                      }
                  </Select>
                  {formik.errors.psusrrol && (
                      <FormErrorMessage>{formik.errors.psusrrol}</FormErrorMessage>
                  )}
              </FormControl>
            </Box>
            <Box display="flex" flexDir="column" gap={6} width="100%">
                <FormControl
                    id="psusrphn"
                    isInvalid={Boolean(formik.errors.psusrphn) && Boolean(formik.touched.psusrphn)}
                >
                    {/* <FormLabel>Contact Number*</FormLabel> */}
                    <CustomFormLabel labelText="Contact Number"/>
                    <Input
                        placeholder={"Enter Contact Number"}
                        type="text"
                        name="psusrphn"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.psusrphn}
                    />
                    {formik.errors.psusrphn && (
                        <FormErrorMessage>{formik.errors.psusrphn}</FormErrorMessage>
                    )}
                </FormControl>
                <FormControl
                    id="psusreml"
                    isInvalid={Boolean(formik.errors.psusreml) && Boolean(formik.touched.psusreml)}
                >
                    {/* <FormLabel>Email Address*</FormLabel> */}
                    <CustomFormLabel labelText="Email Address"/>
                    <Input
                        placeholder={"Enter Email Address"}
                        type="text"
                        name="psusreml"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.psusreml}
                    />
                    {formik.errors.psusreml && (
                        <FormErrorMessage>{formik.errors.psusreml}</FormErrorMessage>
                    )}
                </FormControl>
                <FormControl
                    id="psusrsts"
                    isInvalid={Boolean(formik.errors.psusrsts) && Boolean(formik.touched.psusrsts)}
                    isDisabled={true}
                >
                    <FormLabel>Status</FormLabel>
                    <Select 
                      placeholder="Please Select Status" 
                      value={formik.values.psusrsts}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                        {
                          ddlData?.USRSTS?.map((option: DDL_TYPES) => (
                            <option key={option.prgecode} value={option.prgecode}>
                                {option.prgedesc}
                            </option>
                          ))
                        }
                    </Select>
                    {formik.errors.psusrsts && (
                        <FormErrorMessage>{formik.errors.psusrsts}</FormErrorMessage>
                    )}
                </FormControl>
            </Box>
          </div>
        </Box>
      </Card>
      <Flex justifyContent="flex-end" pl={10} pr={10} pt={10} >
        <Box>
          <Space size="small">
            <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
          </Space>
        </Box>
      </Flex>
    </form>
  );
}
