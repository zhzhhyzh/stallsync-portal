// @ts-ignore  
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
  Switch,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  IconButton,
  HStack,
  Checkbox,
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";

import { Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { IoAddSharp, IoChevronBack, IoCloseCircle, IoEye, IoSave, IoEyeOff } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal } from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineCheckCircle, AiOutlineLeft } from "react-icons/ai";

import { actActSchema } from "../@schemas/actActSchema";

import useFetchActActDetail from "@app/hooks/selector/useFetchActActDetail";
import useFetchChkFind from "@app/hooks/selector/useFetchChkFind";

import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { getManageActAct } from "@app/redux/queue/slice";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";

export default function ActActForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Activity Action Parameter" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;
  const actID = props.actID;
  const file = String(router.query?.file);
  const practdesc = String(router.query?.practdesc);
  // const practcod = props.practcod;
  const practcod = String(router.query?.practcod);
  // const QueueID = props.QueueID;
  const QueueID = String(router.query?.QueueID);
  let prquedesc = String(router.query?.prquedesc);
  prquedesc= prquedesc.replace(/ /g, '+');
  // const id = String(router.query?.id)
  const [detailData] = useFetchActActDetail(id);
  const [chkFindData] = useFetchChkFind(actID);
  const [ddlData] = useFetchDDL({
    code: ["ACTCDE", 'CASESTS', 'ACTIND', 'YESORNO']
  })

  const handleSwitch1 = () => {
    formik.setFieldValue("practgen", !formik.values.practgen);
  };

  const handleSwitch = () => {
    formik.setFieldValue("practgen", !formik.values.practgen);
  };
  const handleSwitch2 = () => {
    formik.setFieldValue("practbyc", !formik.values.practbyc);
  };
  const initialValues = {
    id: id,
    prquecod: mode === "ADD" ? chkFindData.prquecod : "",
    prquedesc: mode === "ADD" ? chkFindData.prquedesc : "",
    practycde: mode === "ADD" ? chkFindData.practcod : "",
    practdesc: mode === "ADD" ? chkFindData.practdesc : "",
    // practycde: "",
    practncd: "",
    practsts: "",
    practnts: "",
    practind: "",
    practgen: "N",
    practbyc: "N",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: actActSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (mode !== "ADD" && id) {
      if (Object.keys(detailData).length === 0) formik.resetForm();
      if (Object.keys(detailData).length > 0) {
        formik.setValues({
          ...detailData,
          id: detailData?.id,
          prquecod: detailData.prquecod,
          prquedesc: detailData.prquedesc,
          practdesc: detailData.practydsc,
          practycde: detailData.practycde,
          practncd: detailData.practncd,
          practsts: detailData.practsts,
          practnts: detailData.practnts,
          practind: detailData.practind,
          // practgen: detailData?.practgen === "Y" ? true : false,
          // practbyc: detailData?.practbyc === "Y" ? true : false,
          practgen: detailData.practgen,
          practbyc: detailData.practbyc,
        });
        // console.log(detailData, "detail data after formik.values")
      } else {
        formik.setValues({
          ...chkFindData,
          practycde: chkFindData.practcod,
          prquedesc: chkFindData.prquedesc,
          prquecod: chkFindData.prquecod,
          practdesc: chkFindData.practdesc,
        });
      }
    }
  }, [detailData, chkFindData]);



  async function onSubmit(data: any) {
    // console.log(data, "data hereeeeee")
    const { success } = await sendRequest({
      fn: mode === "ADD" ? getManageActAct(data) : getManageActAct({
        ...data,
        id: id,
      }),
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

  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4} py={Spacing.gap}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Activity Action Parameter
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Queue Code Parameter",
              href: "/queues",
            },
            {
              title: "Queue Activity Parameter",
              href: `/queues/activity/?QueueID=${QueueID}&id=&prquedesc=${prquedesc}`,

            },
            {
              title: "Activity Action Parameter",
              href: `/queues/activity/actAct/?actID=${actID}&practcod=${practcod}&prquedesc=${prquedesc}&practdesc=${practdesc}&QueueID=${QueueID}&id=&file=${file}`,// Add parameter if needed eg. /generalParameter/?id=123
          
            },
            {
              title: "Activity Action Parameter(" + mode + ")",
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
            <Buttons buttonDefaultType={"BACK"} onclick={() => router.back()} />
            {
              mode && mode !== "VIEW" && (
                <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
              )}
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
                id="prquecod"
                isInvalid={Boolean(formik.errors.prquecod) && Boolean(formik.touched.prquecod) || Boolean(formik.errors.prquedesc) && Boolean(formik.touched.prquedesc)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Queue Code*</FormLabel> */}
                <CustomFormLabel labelText="Queue Code"/>
                <Input
                  placeholder={"Enter Queue Code"}
                  type="text"
                  name="prquecod"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  // value={mode === "ADD" ? prquecod : formik.values.prquecod}
                  value={`${formik.values.prquecod} - ${formik.values.prquedesc}`}
                  isDisabled
                />
                {/* {formik.errors.prquecod && (
                  <FormErrorMessage>{formik.errors.prquecod}</FormErrorMessage>
                )} */}
              </FormControl>

              <FormControl
                id="practycde"
                isInvalid={Boolean(formik.errors.practycde) && Boolean(formik.touched.practycde) || Boolean(formik.errors.practdesc) && Boolean(formik.touched.practdesc)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <CustomFormLabel labelText="Activity Code"/>

                <Input
                  placeholder={"Enter Activity Code"}
                  type="text"
                  name="practycde"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  // value={mode === "ADD" ? practcod : formik.values.practcod}
                  value={`${formik.values.practycde} - ${formik.values.practdesc}`}
                  isDisabled
                />
                {/* {formik.errors.practycde && (
                  <FormErrorMessage>{formik.errors.practycde}</FormErrorMessage>
                )} */}
              </FormControl>

              <FormControl
                id="practncd"
                onChange={formik.handleChange}
                isInvalid={Boolean(formik.errors.practncd) && Boolean(formik.touched.practncd)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <CustomFormLabel labelText="Action Code"/>
                <Select placeholder={"Please select Action Code"}
                  value={formik.values.practncd}
                  onChange={formik.handleChange}
                >
                  {
                    ddlData?.ACTCDE?.map((option: any) => (
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    ))
                  }
                </Select>

                {formik.errors.practncd && (
                  <FormErrorMessage>{formik.errors.practncd}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                id="practind"
                onChange={formik.handleChange}
                isInvalid={Boolean(formik.errors.practind) && Boolean(formik.touched.practind)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <CustomFormLabel labelText="Activity Indicator"/>
                <Select placeholder={"Please select Activiry Indicator"}
                  value={formik.values.practind}
                  onChange={formik.handleChange}
                >
                  {
                    ddlData?.ACTIND?.map((option: any) => (
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    ))
                  }
                </Select>

                {formik.errors.practind && (
                  <FormErrorMessage>{formik.errors.practind}</FormErrorMessage>
                )}
              </FormControl>
              </Box>

              <Box display="flex" flexDir="column" gap={6} width="100%">

              <FormControl
                id="practsts"
                onChange={formik.handleChange}
                isInvalid={Boolean(formik.errors.practsts) && Boolean(formik.touched.practsts)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <CustomFormLabel labelText="Current Case"/>
                <Select placeholder={"Please select Current Case"}
                  value={formik.values.practsts}
                  onChange={formik.handleChange}
                >
                  {
                    ddlData?.CASESTS?.map((option: any) => (
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    ))
                  }
                </Select>

                {formik.errors.practsts && (
                  <FormErrorMessage>{formik.errors.practsts}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                id="practnts"
                onChange={formik.handleChange}
                isInvalid={Boolean(formik.errors.practnts)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Next Case</FormLabel> */}
                <CustomFormLabel labelText="Next Case"/>
                <Select placeholder={"Please select Next Case"}
                  value={formik.values.practnts}
                  onChange={formik.handleChange}
                >
                  {
                    ddlData?.CASESTS?.map((option: any) => (
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    ))
                  }
                </Select>

                {formik.errors.practnts && (
                  <FormErrorMessage>{formik.errors.practnts}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                id="practgen"
                isInvalid={Boolean(formik.errors.practgen) && Boolean(formik.touched.practgen)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <CustomFormLabel labelText="Generate Report"/>
                {/* <Checkbox _checked={{
                          "& .chakra-checkbox__control": { background: "#8c98e8", borderColor: "#8c98e8" },
                        }}

                          onChange={(e) => formik.setFieldValue('psprdaip', e.target.checked ? "Y" : "N")} 
                          isChecked={formik.values.psprdaip === "Y"}>Accrue On Interest Payable</Checkbox> */}
                      <Switch
                        id="practgen"
                        size='lg'
                        name="practgen"
                        // isChecked={formik.values.practgen}
                        isChecked={formik.values.practgen === "Y"}
                        onChange={(e) => formik.setFieldValue('practgen', e.target.checked ? "Y" : "N")} 

                        // onChange={handleSwitch1}
                        onBlur={formik.handleBlur}
                        colorScheme={"green"}
                        sx={{ 'span.chakra-switch__track:not([data-checked])': { backgroundColor: Colors.GRAY } }}
                      />
                      {formik.errors.practgen && (
                        <FormErrorMessage>{formik.errors.practgen}</FormErrorMessage>
                      )}
                    </FormControl>
              {/* <FormControl
                id="practgen"
                onChange={formik.handleChange}
                isInvalid={Boolean(formik.errors.practgen) && Boolean(formik.touched.practgen)}
                isReadOnly={mode === "VIEW" ? true : false}

              > */}

                {/* <Select placeholder={"Please select YES or NO"}
                  value={formik.values.practgen}
                  onChange={formik.handleChange}
                >
                  {
                    ddlData?.YESORNO?.map((option: any) => (
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    ))

                  }
                </Select> */}

              <FormControl
                      id="practbyc"
                      isInvalid={Boolean(formik.errors.practbyc) && Boolean(formik.touched.practbyc)}
                      isReadOnly={mode === "VIEW" ? true : false}
                    >
                <CustomFormLabel labelText="By Pass Checklist?"/>
                <Switch
                        id="practbyc"
                        size='lg'
                        name="practbyc"
                        // isChecked={formik.values.practgen}
                        isChecked={formik.values.practbyc === "Y"}
                        onChange={(e) => formik.setFieldValue('practbyc', e.target.checked ? "Y" : "N")} 

                        // onChange={handleSwitch1}
                        onBlur={formik.handleBlur}
                        colorScheme={"green"}
                        sx={{ 'span.chakra-switch__track:not([data-checked])': { backgroundColor: Colors.GRAY } }}
                      />
                      {/* <Switch
                        id="practbyc"
                        size='md'
                        name="practbyc"
                        isChecked={formik.values.practbyc}
                        onChange={handleSwitch2}
                        onBlur={formik.handleBlur}
                        colorScheme={"green"}
                        sx={{ 'span.chakra-switch__track:not([data-checked])': { backgroundColor: Colors.GRAY } }}
                      /> */}
                      {formik.errors.practbyc && (
                        <FormErrorMessage>{formik.errors.practbyc}</FormErrorMessage>
                      )}
                    </FormControl>

              {/* <FormControl
                id="practbyc"
                onChange={formik.handleChange}
                isInvalid={Boolean(formik.errors.practbyc) && Boolean(formik.touched.practbyc)}
                isReadOnly={mode === "VIEW" ? true : false}

              > */}

                {/* <Select placeholder={"Please select YES or NO"}
                  value={formik.values.practbyc}
                  onChange={formik.handleChange}
                >
                  {
                    ddlData?.YESORNO?.map((option: any) => (
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    ))

                  }
                </Select> */}
                  
            </Box>

          </div>
        </Box>
      </Card>
      <Flex justifyContent="flex-end" pl={10} pr={10} pt={10} >
        <Box>
          <Space size="small">
            <Buttons buttonDefaultType={"BACK"} onclick={() => router.back()} />
            {
              mode && mode !== "VIEW" && (
                <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
              )}
          </Space>
        </Box>
      </Flex>
    </form>
  );
}
