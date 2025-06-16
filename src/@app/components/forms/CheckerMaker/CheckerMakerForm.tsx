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
  Stack,
  Switch,
  InputGroup,
  InputRightElement,
  IconButton,
  RadioGroup,
  Radio,
  Textarea
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState, CSSProperties } from "react";

import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { IoChevronBack, IoSave } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal } from "@app/redux/app/slice";
import type { DatePickerProps } from 'antd';
import { DatePicker, Form, Space, Tag } from 'antd';
import dayjs from "dayjs";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import moment from "moment";

import { getManageCheckerMaker } from "@app/redux/checkerMaker/slice";

import useFetchCheckerMakerDetail from "@app/hooks/selector/useFetchCheckerMakerDetail";


import { checkerMakerSchema } from "../@schemas/checkerMakerSchema";

import { CalendarIcon, EmailIcon, PhoneIcon } from '@chakra-ui/icons'
import PeopleImage from "@app/assets/img/people-image.png"
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
import useFetchDDLWorkgroups from "@app/hooks/selector/useFetchDDLWorkgroups";

export default function CheckerMakerForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Checker Maker Parameter" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;

  const mode = props.mode;
  const [detailData] = useFetchCheckerMakerDetail(id);
  // const [ddlData] = useFetchDDL({ code: ["WRKIND"] });
  const [showPassword, setShowPassword] = useState(false);

  const [ddlUserGroup] = useFetchDDLWorkgroups();

  const [category, setCategory] = useState();

  const initialValues = {
    pscmkcde: "",
    pscmkdsc: "",
    pscmklds: "",
    pscmkgrp: "",
    // pscmkgrpdsc: "",
    pscmkaac: "",
    pscmkrac: "",
    pscmkred: "",

  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: checkerMakerSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (mode !== "ADD" && id) {
      //Reset Form if detailData is empty object
      if (Object.keys(detailData).length === 0) formik.resetForm();

      if (Object.keys(detailData).length > 0) {
        formik.setValues({
          ...detailData,
          id: detailData?.pscmkcde,
          //   pschnsts: detailData?.pschnsts === "Y" ? true : false,
        });
      }
    }
  }, [detailData]);

  async function onSubmit(data: any) {
    const { success } = await sendRequest({
      fn: getManageCheckerMaker({
        ...data,

      }

      ),
      formik,
    });

    if (success) {
      setTimeout(() => {
        showModal(dispatch, {
          title: mode !== "ADD" ? "Update Record" : "Add Record",
          message: mode !== "ADD" ? "Record Updated" : "Record Added",
        });
        router.back();
      }, 200);
    }
  }
  function categoryOnchange(event: any) {
    setCategory(event.target.value);
}
  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Checker Maker Control Parameter
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Checker Maker Control Parameter",
              href: `/checkerMaker`,// Add parameter if needed eg. /generalParameter/?id=123
            },
            {
              title: "Checker Maker Control Parameter (" + mode + ")",
              // title: "Checker Maker Control Parameter",

            },
          ]}
          />
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
            <Buttons buttonDefaultType={"BACK"} onclick={() => router.back()} />
            {
              mode && mode !== "VIEW" && (
                <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
              )}
          </Space>
        </Box>
      </Flex>

      {/* <Box display="flex" flexDir="column" gap={6} width="100%"> */}
      <div className="flex flex-col gap-6">
        <Box display="flex" flexDir="column" gap={6} width="100%">
          <Card p={4} mt={`${Spacing.containerPx}`}>
          <Text fontSize="19pt" fontWeight={"500"} paddingBottom={5}>General</Text>
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', width: '100%' }}>
                <FormControl
                  id="pscmkcde"
                  isInvalid={Boolean(formik.errors.pscmkcde) && Boolean(formik.touched.pscmkcde)}
                >
                  <CustomFormLabel labelText="CHECKER MAKER CODE"/>
                  <Input
                    // placeholder={"Enter Drive Safe Score"}
                    type="text"
                    id="pscmkcde"
                    name="pscmkcde"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.pscmkcde}
                    isDisabled={mode === "EDIT" ? true : false}

                  />
                  {formik.errors.pscmkcde && (
                    <FormErrorMessage>{formik.errors.pscmkcde}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl
                  id="pscmkdsc"
                  isInvalid={Boolean(formik.errors.pscmkdsc) && Boolean(formik.touched.pscmkdsc)}
                >
                  <CustomFormLabel labelText="CHECKER MAKER DESCRIPTION"/>

                  <Input
                    type="text"
                    id="pscmkdsc"
                    name="pscmkdsc"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.pscmkdsc}
                  />
                  {formik.errors.pscmkdsc && (
                    <FormErrorMessage>{formik.errors.pscmkdsc}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl
                  id="pscmklds"
                  isInvalid={Boolean(formik.errors.pscmklds) && Boolean(formik.touched.pscmklds)}
                >
                  <FormLabel>CHECKER MAKER LOCAL DESCRIPTION</FormLabel>

                  <Input
                    type="text"
                    id="pscmklds"
                    name="pscmklds"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.pscmklds}
                  />
                  {formik.errors.pscmklds && (
                    <FormErrorMessage>{formik.errors.pscmklds}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl
                  id="pscmkgrp"
                  isInvalid={Boolean(formik.errors.pscmkgrp) && Boolean(formik.touched.pscmkgrp)}
                >
                  <CustomFormLabel labelText="USER GROUP"/>
                  {/* <Select
                     // mt={-3}
                    name="category"
                    onChange={categoryOnchange}
                    placeholder="Please Select User Group"
                    value={category}
                  >
                    {Array.isArray(userGroup)&&userGroup?.map((option: any) => (
                      <option key={option.pscmkgrp} value={option.pscmkgrp}> */}
                        {/* {option.psprddsc} */}
                      {/* </option>
                    ))}
                  </Select> */}
                <Select
                  name="pscmkgrp"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Please Select User Group"
                  // defaultValue={formik.values.pscompln}
                  disabled={mode === "ADD" ? false : true}
                  value={formik.values.pscmkgrp}
                  style={{
                    fontSize: 14,
                  }}
                >
                  {Array.isArray(ddlUserGroup) &&
                    ddlUserGroup.map((option: any) => (
                      <option key={option.prwrkcde} value={option.prwrkcde}>
                        {option.prwrkdsc}
                      </option>
                    ))}
                </Select>
                  {/* <Select
                  placeholder="Please Select User Group"
                  value={formik.values.pscmkgrp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isDisabled={mode === "VIEW" ? true : false}
                >
                  {ddlData?.WRKIND?.map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select> */}
                  {/* <Input
                    type="text"
                    id="pscmkgrp"
                    name="pscmkgrp"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.pscmkgrp}
                  /> */}
                  {formik.errors.pscmkgrp && (
                    <FormErrorMessage>{formik.errors.pscmkgrp}</FormErrorMessage>
                  )}
                </FormControl>
                </div>
              <div>
                
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', height: 'fit-content', width: '100%' }}>
              <FormControl
                  id="pscmkaac"
                  isInvalid={Boolean(formik.errors.pscmkaac) && Boolean(formik.touched.pscmkaac)}
                >
                  <CustomFormLabel labelText="APPROVE ACTION"/>

                  {/* <Input
                    type="text"
                    id="pscmkaac"
                    name="pscmkaac"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.pscmkaac}
                  /> */}
                  <Textarea
                  name="pscmkaac"
                  onChange={formik.handleChange}
                  value={formik.values.pscmkaac}
                  style={{
                    fontSize: 14,
                    width: "100%",
                    height: "120px",
                    resize: "vertical",
                  }}
                />
                  {formik.errors.pscmkaac && (
                    <FormErrorMessage>{formik.errors.pscmkaac}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl
                id="pscmkrac"
                isInvalid={Boolean(formik.touched.pscmkrac) && Boolean(formik.errors.pscmkrac)}
                // isReadOnly={mode === "VIEW" ? true : false}
                >
                <FormLabel>Reject Action</FormLabel>
                {/* <Input
                    type="text"
                    id="pscmkrac"
                    name="pscmkrac"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.pscmkrac}
                  /> */}

                <Textarea
                  name="pscmkrac"
                  onChange={formik.handleChange}
                  value={formik.values.pscmkrac}
                  style={{
                    fontSize: 14,
                    width: "100%",
                    height: "120px",
                    resize: "vertical",
                  }}
                />


                {formik.errors.pscmkrac && (
                  <FormErrorMessage>{formik.errors.pscmkrac}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                id="pscmkred"
                isInvalid={Boolean(formik.touched.pscmkred) && Boolean(formik.errors.pscmkred)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Content URL</FormLabel>
                {/* <Input
                    type="text"
                    id="pscmkred"
                    name="pscmkred"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.pscmkred}
                  /> */}
                <Textarea
                  name="pscmkred"
                  onChange={formik.handleChange}
                  value={formik.values.pscmkred}
                  style={{
                    fontSize: 14,
                    width: "100%",
                    height: "120px",
                    resize: "vertical",
                  }}
                />


                {formik.errors.pscmkred && (
                  <FormErrorMessage>{formik.errors.pscmkred}</FormErrorMessage>
                )}
              </FormControl>
              </div>
              </div>

            </div>
          </Card>
        </Box>

        

      </div>

      {/* </Box> */}
      <Flex justifyContent="flex-end" pl={10} pr={10} pt={10} >
        <Box>
          <Space size="small">
            <Buttons
              buttonDefaultType={"BACK"} onclick={() => router.back()}
            />
            {
              mode && mode !== "VIEW" && (
                <Buttons
                  buttonDefaultType={"SAVE"} buttonLoading={loading}
                />
              )}
          </Space>
        </Box>
      </Flex>
    </form >
  );
}
