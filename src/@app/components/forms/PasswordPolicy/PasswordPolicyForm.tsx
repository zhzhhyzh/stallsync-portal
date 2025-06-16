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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  Checkbox,
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";

import { Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { IoChevronBack, IoSave } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal, selectHome } from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import useFetchPasswordPolicyDetail from "@app/hooks/selector/useFetchPasswordPolicyDetail";
import { PasswordPolicySchema } from "../@schemas/passwordPolicyShema";
import { managePasswordPolicy } from "@app/redux/passwordPolicy/slice";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import Buttons from "@app/components/common/Buttons/Buttons";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";

export default function PasswordPolicyForm() {
  const router = useRouter();

  const { sendRequest, loading } = useApi({ title: "Password Policy" });
  const dispatch = useAppDispatch();
  const [detailData] = useFetchPasswordPolicyDetail();
  const homeData = useAppSelector(selectHome);
const id = String(router.query?.id);
const [tableData, refreshFn, totalRecords, extra] = useFetchPasswordPolicyDetail();

  const initialValues = {
    id: "",
    prpwdatm: 0,
    pratmmsg: "",
    pratmchk: false,
    prpwdlen: 0,
    prlenmsg: "",
    prlenchk: false,
    prpwdfrq: 0,
    prfrqmsg: "",
    prfrqchk: false,
    prpwdupc: false,
    prupcmsg: "",
    prupcchk: false,
    prpwdlwc: false,
    prlwcmsg: "",
    prlwcchk: false,
    prpwdspc: false,
    prspcmsg: "",
    prspcchk: false,
    prspcchr: "",
    prscrmsg: "",
    prscrchk: false,
    prpwdnum: false,
    prnummsg: "",
    prnumchk: false,
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: PasswordPolicySchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (Object.keys(detailData).length > 0) {
      formik.setValues(detailData);
    }
  }, [detailData]);
  
  const handleUpperCaseChange = () => {
    formik.setFieldValue("prpwdupc", !formik.values.prpwdupc);
  };

  const handleLowerCaseChange = () => {
    formik.setFieldValue("prpwdlwc", !formik.values.prpwdlwc);
  };

  const handleSpecialCharChange = () => {
    formik.setFieldValue("prpwdspc", !formik.values.prpwdspc);
  };

  const handleRequireNumberChange = () => {
    formik.setFieldValue("prpwdnum", !formik.values.prpwdnum);
  };

  async function onSubmit(data: any) {
    if ((!homeData?.access || (homeData?.access && !checkAccessMatrix(homeData?.access, accessType.PWPOLICY_EDIT)))) {
      return;
    }
    const { success } = await sendRequest({
      fn: managePasswordPolicy(data),
      formik,
    });

    if (success) {
      setTimeout(() => {
        showModal(dispatch, {
          title: "Password Policy",
          message: "Record Updated",
        });
      }, 200);
    }
  }

  const handleClick = () => {
    const record = { id: id }; 

    const queryParams = {
      id: detailData.id,
      file: 'prpwdpol',
    };

    const url = {
      pathname: "/maintLogs",
      query: queryParams,
    };

    router.push(url);

    
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4} py={Spacing.gap}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="500" mb={1}>
            Password Policy
          </Text>
          <Breadcrumbs breadcrumbItems={[
              {
                title: "Password Policy",
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
        <Space size="small" >
          <Button
          size={"sm"}
          color={"white"}
          sx={{ _hover: { backgroundColor: Colors.PRIMARY, color: "white" } }}
          bgColor={Colors.PRIMARY}
          fontWeight = {"normal"}
          borderRadius = {3}
          type={"button"}
          onClick={handleClick}
          paddingRight={3}
          marginRight={5}
          // isLoading={buttonLoading}
          // sx={{ _hover: { backgroundColor: hoverBackgroundColor, color: hoverColor } }}
          // {...rest}
        >
          MAINT LOG 
        </Button>  
          </Space>

          <Space size="small">
            {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.PWPOLICY_EDIT)) && (
                <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
              )
            }
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

        <Box display="flex" flexDir="row" gap={6} width="100%">

          {/* <Flex flexDirection="column"> */}
            {/* <Box display="flex" flexDirection="row" pb={5} justifyContent={"space-between"}> */}
              {/* <Box pr={5} w={"sm"}>
                <CustomFormLabel labelText="Password Attempts"/>
              </Box> */}
              <Box width={"30%"}>
                <FormControl
                  id="prpwdatm"
                  isInvalid={Boolean(formik.errors.prpwdatm) && Boolean(formik.touched.prpwdatm)}
                >
                  <FormLabel>Max Password Attempts</FormLabel>
                  <NumberInput
                    name="prpwdatm"
                    min={0}
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "prpwdatm" },
                      })
                    }
                    onBlur={formik.handleBlur}
                    value={formik.values.prpwdatm}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  {formik.errors.prpwdatm && (
                    <FormErrorMessage>
                      {formik.errors.prpwdatm}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Box>
              <Box width={"60%"}>
                <FormControl
                  id="pratmmsg"
                  isInvalid={Boolean(formik.errors.pratmmsg) && Boolean(formik.touched.pratmmsg)}
                >
                  <FormLabel>Password attempts error message</FormLabel>
                  <Input
                    placeholder={"Enter Password attempts error message"}
                    type="text"
                    name="pratmmsg"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.pratmmsg}
                  />
                  {formik.errors.pratmmsg && (
                    <FormErrorMessage>
                      {formik.errors.pratmmsg}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Box>
              {/* <Box>
              <FormLabel>Applied</FormLabel>

              <Checkbox size='lg' colorScheme='blue' defaultChecked>
              </Checkbox>
              </Box> */}
            <Box width={"10%"} display={"flex"} flexDir={"column"} >
            <FormLabel>Applied</FormLabel>

            <FormControl
                  id="pratmchk"
                  isInvalid={Boolean(formik.errors.pratmchk) && Boolean(formik.touched.pratmchk)}
                >
              <Checkbox
                size='lg'
                colorScheme='blue'
                id="pratmchk"
                name="pratmchk"
                isChecked={formik.values.pratmchk}
                pt={2}
                pl={4}
                // onChange={handleMaxPassAttemptChk}
                // sx={{ 'span.chakra-switch__track:not([data-checked])': { backgroundColor: Colors.DANGER } }}

                onChange={() => formik.setFieldValue("pratmchk", !formik.values.pratmchk)}
              />
              {formik.errors.pratmchk && (
                    <FormErrorMessage>
                      {formik.errors.pratmchk}
                    </FormErrorMessage>
                  )}
          </FormControl>
                    {/* <FormControl
                        id="psprdaip"
                        isInvalid={Boolean(formik.errors.pratmchk) && Boolean(formik.touched.pratmchk)}
                        // isReadOnly={mode === "VIEW" ? true : false}
                      >
                        <Checkbox _checked={{
                          "& .chakra-checkbox__control": { background: "#8c98e8", borderColor: "#8c98e8" },
                        }}

                          onChange={(e) => formik.setFieldValue('pratmchk', e.target.checked ? true : false)} isChecked={formik.values.pratmchk === true}></Checkbox>
                        {formik.errors.pratmchk && (
                          <FormErrorMessage>{formik.errors.pratmchk}</FormErrorMessage>
                        )}
                      </FormControl> */}
              </Box>
            </Box>


            <Box display="flex" flexDir="row" gap={6} width="100%">
              <Box width={"30%"}>
                <FormControl
                  id="prpwdlen"
                  isInvalid={Boolean(formik.errors.prpwdlen) && Boolean(formik.touched.prpwdlen)}
                >
                  <FormLabel>Max Password Length</FormLabel>
                  <NumberInput
                    name="prpwdlen"
                    min={0}
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "prpwdlen" },
                      })
                    }
                    onBlur={formik.handleBlur}
                    value={formik.values.prpwdlen}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  {formik.errors.prpwdlen && (
                    <FormErrorMessage>
                      {formik.errors.prpwdlen}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Box>
              <Box width={"60%"}>
                <FormControl
                  id="prlenmsg"
                  isInvalid={Boolean(formik.errors.prlenmsg) && Boolean(formik.touched.prlenmsg)}
                >
                  <FormLabel>Password length error message</FormLabel>
                  <Input
                    placeholder={"Enter Password attempts error message"}
                    type="text"
                    name="prlenmsg"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.prlenmsg}
                  />
                  {formik.errors.prlenmsg && (
                    <FormErrorMessage>
                      {formik.errors.prlenmsg}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Box> 
              <Box width={"10%"} justifyContent={"center"} alignSelf={"center"}>
                <FormControl
                      id="prlenchk"
                      isInvalid={Boolean(formik.errors.prlenchk) && Boolean(formik.touched.prlenchk)}
                    >
                  <Checkbox
                    size='lg'
                    colorScheme='blue'
                    id="prlenchk"
                    name="prlenchk"
                    isChecked={formik.values.prlenchk}
                    pt={5}
                    pl={4}
                    onChange={() => formik.setFieldValue("prlenchk", !formik.values.prlenchk)}
                  />
                  {formik.errors.prlenchk && (
                        <FormErrorMessage>
                          {formik.errors.prlenchk}
                        </FormErrorMessage>
                      )}
                  </FormControl>
              </Box>
            </Box> 


            <Box display="flex" flexDir="row" gap={6} width="100%">
              <Box width={"30%"}>
                <FormControl
                  id="prpwdfrq"
                  isInvalid={Boolean(formik.errors.prpwdfrq) && Boolean(formik.touched.prpwdfrq)}
                >
                  <FormLabel>Max Change Interval Frequency</FormLabel>
                  <NumberInput
                    name="prpwdfrq"
                    min={0}
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "prpwdfrq" },
                      })
                    }
                    onBlur={formik.handleBlur}
                    value={formik.values.prpwdfrq}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  {formik.errors.prpwdfrq && (
                    <FormErrorMessage>
                      {formik.errors.prpwdfrq}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Box>
              <Box width={"60%"}>
                <FormControl
                  id="prfrqmsg"
                  isInvalid={Boolean(formik.errors.prfrqmsg) && Boolean(formik.touched.prfrqmsg)}
                >
                  <FormLabel>Max. change frequency error message</FormLabel>
                  <Input
                    placeholder={"Enter Max. change frequency error message"}
                    type="text"
                    name="prfrqmsg"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.prfrqmsg}
                  />
                  {formik.errors.prfrqmsg && (
                    <FormErrorMessage>
                      {formik.errors.prfrqmsg}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Box>
              <Box width={"10%"} justifyContent={"center"} alignSelf={"center"}>
                <FormControl
                      id="prfrqchk"
                      isInvalid={Boolean(formik.errors.prfrqchk) && Boolean(formik.touched.prfrqchk)}
                    >
                  <Checkbox
                    size='lg'
                    colorScheme='blue'
                    id="prfrqchk"
                    name="prfrqchk"
                    isChecked={formik.values.prfrqchk}
                    onChange={() => formik.setFieldValue("prfrqchk", !formik.values.prfrqchk)}

                    // onChange={handleMaxFreqAttmptChk}
                    pt={5}
                    pl={4}
                  />
                  {formik.errors.prfrqchk && (
                        <FormErrorMessage>
                          {formik.errors.prfrqchk}
                        </FormErrorMessage>
                      )}
                  </FormControl>
              </Box>
            </Box>
            

            <Box display="flex" flexDir="row" gap={6} width="100%">
              <Box width={"30%"}>
                <FormControl
                  id="prpwdupc"
                  isInvalid={Boolean(formik.errors.prpwdupc) && Boolean(formik.touched.prpwdupc)}
                >
                  <FormLabel>Require Upper Case?</FormLabel>
                  <Switch
                    id="prpwdupc"
                    name="prpwdupc"
                    isChecked={formik.values.prpwdupc}
                    onChange={handleUpperCaseChange}
                    onBlur={formik.handleBlur}
                    size="md"
                    colorScheme={"green"}
                    sx={{ 'span.chakra-switch__track:not([data-checked])': { backgroundColor: Colors.DANGER } }}
                  />
                  {formik.errors.prpwdupc && (
                    <FormErrorMessage>
                      {formik.errors.prpwdupc}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Box>
              <Box width={"60%"}>
                <FormControl
                  id="prupcmsg"
                  isInvalid={Boolean(formik.errors.prupcmsg) && Boolean(formik.touched.prupcmsg)}
                >
                  <FormLabel>Upper case error message</FormLabel>
                  <Input
                    placeholder={"Enter Upper case error message"}
                    type="text"
                    name="prupcmsg"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.prupcmsg}
                  />
                  {formik.errors.prupcmsg && (
                    <FormErrorMessage>
                      {formik.errors.prupcmsg}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Box>
              <Box width={"10%"} justifyContent={"center"} alignSelf={"center"}>
                <FormControl
                      id="prupcchk"
                      isInvalid={Boolean(formik.errors.prupcchk) && Boolean(formik.touched.prupcchk)}
                    >
                  <Checkbox
                    size='lg'
                    colorScheme='blue'
                    id="prupcchk"
                    name="prupcchk"
                    isChecked={formik.values.prupcchk}
                    pt={5}
                    pl={4}
                    // onChange={handleUpperCaseChk}
                    onBlur={formik.handleBlur}
                    onChange={() => formik.setFieldValue("prupcchk", !formik.values.prupcchk)}
                  />
                  {formik.errors.prupcchk && (
                        <FormErrorMessage>
                          {formik.errors.prupcchk}
                        </FormErrorMessage>
                      )}
                  </FormControl>
              </Box>
            </Box>


            <Box display="flex" flexDir="row" gap={6} width="100%">
              <Box width={"30%"}>
                <FormControl
                  id="prpwdlwc"
                  isInvalid={Boolean(formik.errors.prpwdlwc) && Boolean(formik.touched.prpwdlwc)}
                >
                  <FormLabel>Require Lower Case?</FormLabel>
                  <Switch
                    id="prpwdlwc"
                    name="prpwdlwc"
                    isChecked={formik.values.prpwdlwc}
                    onChange={handleLowerCaseChange}
                    onBlur={formik.handleBlur}
                    size="md"
                    colorScheme={"green"}
                    sx={{ 'span.chakra-switch__track:not([data-checked])': { backgroundColor: Colors.DANGER } }}
                  />
                  {formik.errors.prpwdlwc && (
                    <FormErrorMessage>
                      {formik.errors.prpwdlwc}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Box>
              <Box width={"60%"}>
                <FormControl
                  id="prlwcmsg"
                  isInvalid={Boolean(formik.errors.prlwcmsg) && Boolean(formik.touched.prlwcmsg)}
                >
                  <FormLabel>Lower case error message</FormLabel>
                  <Input
                    placeholder={"Enter Lower case error message"}
                    type="text"
                    name="prlwcmsg"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.prlwcmsg}
                  />
                  {formik.errors.prlwcmsg && (
                    <FormErrorMessage>
                      {formik.errors.prlwcmsg}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Box>
              <Box width={"10%"} justifyContent={"center"} alignSelf={"center"}>
                <FormControl
                      id="prlwcchk"
                      isInvalid={Boolean(formik.errors.prlwcchk) && Boolean(formik.touched.prlwcchk)}
                    >
                  <Checkbox
                    size='lg'
                    colorScheme='blue'
                    id="prlwcchk"
                    name="prlwcchk"
                    isChecked={formik.values.prlwcchk}
                    pt={5}
                    pl={4}
                    onChange={() => formik.setFieldValue("prlwcchk", !formik.values.prlwcchk)}
                  />
                  {formik.errors.prlwcchk && (
                        <FormErrorMessage>
                          {formik.errors.prlwcchk}
                        </FormErrorMessage>
                      )}
                  </FormControl>
              </Box>
            </Box>


            <Box display="flex" flexDir="row" gap={6} width="100%">
              <Box width={"30%"}>
                <FormControl
                  id="prpwdspc"
                  isInvalid={Boolean(formik.errors.prpwdspc) && Boolean(formik.touched.prpwdspc)}
                >
                  <FormLabel>Require Special Character?</FormLabel>
                  <Switch
                    id="prpwdspc"
                    name="prpwdspc"
                    isChecked={formik.values.prpwdspc}
                    onChange={handleSpecialCharChange}
                    onBlur={formik.handleBlur}
                    size="md"
                    colorScheme={"green"}
                    sx={{ 'span.chakra-switch__track:not([data-checked])': { backgroundColor: Colors.DANGER } }}
                  />
                  {formik.errors.prpwdspc && (
                    <FormErrorMessage>
                      {formik.errors.prpwdspc}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Box>
              <Box width={"60%"}>
                <FormControl
                  id="prspcmsg"
                  isInvalid={Boolean(formik.errors.prspcmsg) && Boolean(formik.touched.prspcmsg)}
                >
                  <FormLabel>Req. special char. error message</FormLabel>
                  <Input
                    placeholder={"Enter Req. special char. error message"}
                    type="text"
                    name="prspcmsg"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.prspcmsg}
                  />
                  {formik.errors.prspcmsg && (
                    <FormErrorMessage>
                      {formik.errors.prspcmsg}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Box>
              <Box width={"10%"} justifyContent={"center"} alignSelf={"center"}>
                <FormControl
                      id="prspcchk"
                      isInvalid={Boolean(formik.errors.prspcchk) && Boolean(formik.touched.prspcchk)}
                    >
                  <Checkbox
                    size='lg'
                    colorScheme='blue'
                    id="prspcchk"
                    name="prspcchk"
                    isChecked={formik.values.prspcchk}
                    pt={5}
                    pl={4}
                    onChange={() => formik.setFieldValue("prspcchk", !formik.values.prspcchk)}
                  />
                  {formik.errors.prspcchk && (
                        <FormErrorMessage>
                          {formik.errors.prspcchk}
                        </FormErrorMessage>
                      )}
                  </FormControl>
              </Box>
            </Box>


            <Box display="flex" flexDir="row" gap={6} width="100%">
              <Box width={"30%"}>
                <FormControl
                  id="prspcchr"
                  isInvalid={Boolean(formik.errors.prspcchr) && Boolean(formik.touched.prspcchr)}
                >
                  <FormLabel>Allowed Special Characters?</FormLabel>
                  <Input
                    placeholder={"Enter Password attempts error message"}
                    type="text"
                    name="prspcchr"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.prspcchr}
                  />
                  {formik.errors.prspcchr && (
                    <FormErrorMessage>
                      {formik.errors.prspcchr}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Box>
              <Box width={"60%"}>
                <FormControl
                  id="prscrmsg"
                  isInvalid={Boolean(formik.errors.prscrmsg) && Boolean(formik.touched.prscrmsg)}
                >
                  <FormLabel>Allowed special char. error message</FormLabel>
                  <Input
                    placeholder={"Enter Allowed special char. error message"}
                    type="text"
                    name="prscrmsg"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.prscrmsg}
                  />
                  {formik.errors.prscrmsg && (
                    <FormErrorMessage>
                      {formik.errors.prscrmsg}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Box>
              <Box width={"10%"} justifyContent={"center"} alignSelf={"center"}>
                <FormControl
                      id="prscrchk"
                      isInvalid={Boolean(formik.errors.prscrchk) && Boolean(formik.touched.prscrchk)}
                    >
                  <Checkbox
                    size='lg'
                    colorScheme='blue'
                    id="prscrchk"
                    name="prscrchk"
                    isChecked={formik.values.prscrchk}
                    pt={5}
                    pl={4}
                    onChange={() => formik.setFieldValue("prscrchk", !formik.values.prscrchk)}
                  />
                  {formik.errors.prscrchk && (
                        <FormErrorMessage>
                          {formik.errors.prscrchk}
                        </FormErrorMessage>
                      )}
                  </FormControl>
              </Box>
            </Box>


            <Box display="flex" flexDir="row" gap={6} width="100%">
              <Box width={"30%"}>
                <FormControl
                  id="prpwdnum"
                  isInvalid={Boolean(formik.errors.prpwdnum) && Boolean(formik.touched.prpwdnum)}
                >
                  <FormLabel>Require Number?</FormLabel>
                  <Switch
                    id="prpwdnum"
                    name="prpwdnum"
                    isChecked={formik.values.prpwdnum}
                    onChange={handleRequireNumberChange}
                    onBlur={formik.handleBlur}
                    size="md"
                    colorScheme={"green"}
                    sx={{ 'span.chakra-switch__track:not([data-checked])': { backgroundColor: Colors.DANGER } }}
                  />
                  {formik.errors.prpwdnum && (
                    <FormErrorMessage>
                      {formik.errors.prpwdnum}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Box>
              <Box width={"60%"}>
                <FormControl
                  id="prnummsg"
                  isInvalid={Boolean(formik.errors.prnummsg) && Boolean(formik.touched.prnummsg)}
                >
                  <FormLabel>Require number error message</FormLabel>
                  <Input
                    placeholder={"Enter Require number error message"}
                    type="text"
                    name="prnummsg"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.prnummsg}
                  />
                  {formik.errors.prnummsg && (
                    <FormErrorMessage>
                      {formik.errors.prnummsg}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Box>
              <Box width={"10%"} justifyContent={"center"} alignSelf={"center"}>
                <FormControl
                      id="prnumchk"
                      isInvalid={Boolean(formik.errors.prnumchk) && Boolean(formik.touched.prnumchk)}
                    >
                  <Checkbox
                    size='lg'
                    colorScheme='blue'
                    id="prnumchk"
                    name="prnumchk"
                    isChecked={formik.values.prnumchk}
                    pt={5}
                    pl={4}
                    onChange={() => formik.setFieldValue("prnumchk", !formik.values.prnumchk)}
                  />
                  {formik.errors.prnumchk && (
                        <FormErrorMessage>
                          {formik.errors.prnumchk}
                        </FormErrorMessage>
                      )}
                  </FormControl>
              </Box>
            </Box>
          {/* </Flex> */}
          </Box>
          </div>
        </Box>
      </Card>


      <Flex justifyContent="flex-end" pl={10} pr={10} pt={10} >
        <Box pr={5}>
          <Space size="small">
          <Button
          size={"sm"}
          color={"white"}
          bgColor={Colors.PRIMARY}
          sx={{ _hover: { backgroundColor: Colors.PRIMARY, color: "white" } }}
          fontWeight = {"normal"}
          borderRadius = {3}
          type={"button"}
          onClick={handleClick}
          paddingRight={3}
          marginRight={5}
          // isLoading={buttonLoading}
          // sx={{ _hover: { backgroundColor: hoverBackgroundColor, color: hoverColor } }}
          // {...rest}
        >
          MAINT LOG 
        </Button>  
          </Space>
        </Box>

        <Box>
          <Space size="small">
            {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.PWPOLICY_EDIT)) && (
                <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
              )
            }
          </Space>
        </Box>
      </Flex>

      
    </form>
  );
}
