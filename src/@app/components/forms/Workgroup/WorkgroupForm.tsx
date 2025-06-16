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
import { WorkgroupSchema } from "../@schemas/workgroupSchema";

import useFetchWorkgroupDetail from "@app/hooks/selector/useFetchWorkgroupDetail";
import { getManageWorkgroup } from "@app/redux/workgroup/slice";

import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";

export default function WorkgroupForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Workgroup" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;
  const [detailData] = useFetchWorkgroupDetail(id);
  //   const [ddlData] = useFetchDDL({ code: ["FUNGRP", "FUNACT"] });

  const initialValues = {
    id: id,
    prwrkcde: "",
    prwrkdsc: "",
    prwrklds: "",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: WorkgroupSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (mode !== "ADD" && id) {
      if(Object.keys(detailData).length === 0){
        formik.resetForm();
      }
      if (Object.keys(detailData).length > 0) {
        formik.setValues({
          ...detailData,
          id: detailData?.id,
        });
      }
    }
  }, [detailData]);

  async function onSubmit(data: any) {
    const { success } = await sendRequest({
      fn: mode === "ADD" ? getManageWorkgroup(data) : getManageWorkgroup({
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
          <Text fontSize={"3xl"} fontWeight="500" mb={1}>
            Workgroup
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Workgroup",
              href: `/workgroups`,// Add parameter if needed eg. /generalParameter/?id=123
            },
            {
              title: "Workgroup (" + mode + ")",
            },
          ]} />
        </Flex>
        <Flex justifyContent="flex-end" pl={10} pr={5} pt={5} >
          <Box>
            <Space size="small">
              <Buttons buttonDefaultType={"BACK"} onclick={() => router.back()} />

              <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
            </Space>
          </Box>
        </Flex>
        {/* <Box
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
        </Box> */}
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
                id="prwrkcde"
                isInvalid={Boolean(formik.errors.prwrkcde) && Boolean(formik.touched.prwrkcde)}
                isReadOnly={mode === "EDIT" ? true : false}
              >
                {/* <FormLabel>Workgroup Code *</FormLabel> */}
                <CustomFormLabel labelText="Workgroup Code"/>
                <Input
                  placeholder={"Enter Workgroup Code"}
                  type="text"
                  name="prwrkcde"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.prwrkcde}
                //   isDisabled={mode === "EDIT" ? true : false}
                />
                {formik.errors.prwrkcde && (
                  <FormErrorMessage>{formik.errors.prwrkcde}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="prwrkdsc"
                isInvalid={Boolean(formik.errors.prwrkdsc) && Boolean(formik.touched.prwrkdsc)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Workgroup Description*</FormLabel> */}
                <CustomFormLabel labelText="Workgroup Description"/>
                <Input
                  placeholder={"Enter Workgroup Description"}
                  type="text"
                  name="prwrkdsc"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.prwrkdsc}
                />
                {formik.errors.prwrkdsc && (
                  <FormErrorMessage>{formik.errors.prwrkdsc}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="prwrklds"
                isInvalid={Boolean(formik.errors.prwrklds) && Boolean(formik.touched.prwrklds)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Workgroup Local Description</FormLabel>
                <Input
                  placeholder={"Enter Local Description"}
                  type="text"
                  name="prwrklds"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.prwrklds}
                />
                {formik.errors.prwrklds && (
                  <FormErrorMessage>{formik.errors.prwrklds}</FormErrorMessage>
                )}
              </FormControl>
            </Box>
            {/* <Box display="flex" flexDir="column" gap={6} width="100%">
              <FormControl
                id="prgtylen"
                isInvalid={Boolean(formik.errors.prgtylen)}
              >
                <FormLabel>Length</FormLabel>
                <NumberInput
                  name="prgtylen"
                  min={0}
                  onChange={(value) =>
                    formik.handleChange({
                      target: { value, name: "prgtylen" },
                    })
                  }
                  value={formik.values.prgtylen}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                {formik.errors.prgtylen && (
                  <FormErrorMessage>
                    {formik.errors.prgtylen}
                  </FormErrorMessage>
                )}
              </FormControl> 
              <FormControl
                id="prgtyman"
                isInvalid={Boolean(formik.errors.prgtyman)}
              >
                <FormLabel>Mandatory/Optional</FormLabel>
                <Select
                  placeholder="Please Select Mandatory/Optional"
                  value={formik.values.prgtyman}
                  onChange={formik.handleChange}
                  isDisabled={mode === "VIEW" ? true : false}
                >
                  {ddlData?.GTMAND?.map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                {formik.errors.prgtyman && (
                  <FormErrorMessage>
                    {formik.errors.prgtyman}
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                id="prgtycat"
                isInvalid={Boolean(formik.errors.prgtycat)}
              >
                <FormLabel>Category</FormLabel>
                <Select
                  placeholder="Please Select Category"
                  value={formik.values.prgtycat}
                  onChange={formik.handleChange}
                  isDisabled={mode === "VIEW" ? true : false}
                >
                  {ddlData?.GTCAT?.map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                {formik.errors.prgtycat && (
                  <FormErrorMessage>
                    {formik.errors.prgtycat}
                  </FormErrorMessage>
                )}
              </FormControl>
            </Box> */}

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
