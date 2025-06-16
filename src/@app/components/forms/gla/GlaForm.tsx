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
  Textarea,
  Checkbox,
  Switch,
} from "@chakra-ui/react";
import {
  DownloadOutlined,
  FolderViewOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { postUploadFile } from "@app/redux/app/slice";


// assets
import React, { useEffect, useState } from "react";
import { message, Upload, } from 'antd';

import { DatePicker, Space, Tag, } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { IoChevronBack, IoSave } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal } from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import { getManageGla, getGlaDetail } from "@app/redux/gla/slice";
import useFetchGlaDetail from "@app/hooks/selector/useFetchGlaDetail";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
// import TextArea from "antd/es/input/TextArea";
import { api } from "@app/utils/AxiosUtils"
import { GlaSchema } from "@app/components/forms/@schemas/glaSchema";
import dayjs from 'dayjs'
import { formatDate } from "@app/utils/DateUtils";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";


export default function GlaForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Transaction Code" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;

  const [detailData] = useFetchGlaDetail(id);

  const initialValues = {
    psglacno: null,
    psgladsc: null,
    psglalds: null,

    psglactp: null,

    psglablr: true,

  };


  const [ddlData] = useFetchDDL({ code: ["GLACTYPE", "YESORNO"] });



  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: GlaSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (mode !== "ADD" && id && Object.keys(detailData).length > 0) {
      formik.setValues({
        ...detailData,
        id: detailData.psglacno,
        psglablr: detailData?.psglablr === "Y" ? true : false,

      });
    }
  }, [detailData]);

  async function onSubmit(data: any) {


    const { success } = await sendRequest({
      fn: getManageGla({
        id: mode === "EDIT" ? data.id : "", ...data,
        psglablr: formik.values.psglablr === true ? "Y" : "N",

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
  const handleSwitch = () => {
    formik.setFieldValue("psglablr", !formik.values.psglablr);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            GL Chart of Account
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "GL Chart of Account",
              href: `/gla`,// Add parameter if needed eg. /generalParameter/?id=123
            },
            {
              title: "GL Chart of Account (" + mode + ")",
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
      <Card
        p={4}
        mt={`${Spacing.containerPx}`}
        className="grid grid-cols-1 gap-6"
      >
        <Box>
          <div className="flex flex-col sm:flex-row gap-6">
            <Box display="flex" flexDir="column" gap={6} width="50%">
              <FormControl
                id="psglacno"
                isInvalid={Boolean(formik.errors.psglacno) && Boolean(formik.touched.psglacno)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Transaction Code*</FormLabel> */}
                <CustomFormLabel labelText="GL Account No." />
                <Input
                  placeholder={"Enter GL Account No."}
                  type="number"
                  name="psglacno"
                  onChange={(event) => {
                    const stringValue = event.target.value.toString();
                    formik.handleChange({
                      target: {
                        name: "psglacno",
                        value: stringValue,
                      },
                    });
                  }}
                  value={formik.values.psglacno || ""}
                  isDisabled={mode === "EDIT"}
                />
                {formik.errors.psglacno && (
                  <FormErrorMessage>{formik.errors.psglacno}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psgladsc"
                isInvalid={Boolean(formik.errors.psgladsc) && Boolean(formik.touched.psgladsc)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Description*</FormLabel> */}
                <CustomFormLabel labelText="Description" />
                <Input
                  placeholder={"Enter Description"}
                  type="text"
                  name="psgladsc"
                  onChange={formik.handleChange}
                  value={formik.values.psgladsc || ""}
                />
                {formik.errors.psgladsc && (
                  <FormErrorMessage>{formik.errors.psgladsc}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psglalds"
                isInvalid={Boolean(formik.errors.psglalds) && Boolean(formik.touched.psglalds)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Local Description</FormLabel>
                <Input
                  placeholder={"Enter Local Description"}
                  type="text"
                  name="psglalds"
                  onChange={formik.handleChange}
                  value={formik.values.psglalds || ""}
                />
                {formik.errors.psglalds && (
                  <FormErrorMessage>{formik.errors.psglalds}</FormErrorMessage>
                )}
              </FormControl>
              {/* 
            </Box>


            <Box display="flex" flexDir="column" gap={6} width="100%"> */}
              <FormControl
                id="psglactp"
                isInvalid={Boolean(formik.errors.psglactp) && Boolean(formik.touched.psglactp)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Transaction Type*</FormLabel> */}
                <CustomFormLabel labelText="GL Account Type" />
                <Select
                  placeholder="Select GL Account Type"
                  value={formik.values.psglactp || ""}
                  onChange={formik.handleChange}
                  style={{
                    fontSize: 14,
                  }}
                // isDisabled={mode === "VIEW" ? true : false}
                >
                  {ddlData?.GLACTYPE?.map((option: DDL_TYPES) => ( //change code
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                {formik.errors.psglactp && (
                  <FormErrorMessage>{formik.errors.psglactp}</FormErrorMessage>
                )}
              </FormControl>


              
              <FormControl
                id="psglablr"
                isInvalid={Boolean(formik.errors.psglablr) && Boolean(formik.touched.psglablr)}
              >
                {/* <FormLabel>Balance Reconciliation</FormLabel> */}
                <CustomFormLabel labelText="Balance Reconciliation" />
                <Switch
                  id="psglablr"
                  size='md'
                  onChange={handleSwitch}
                  isChecked={formik.values.psglablr}
                  colorScheme={"green"}
                  sx={{ 'span.chakra-switch__track:not([data-checked])': { backgroundColor: Colors.DANGER } }}
                />
                {formik.errors.psglablr && (
                  <FormErrorMessage>
                    {formik.errors.psglablr}
                  </FormErrorMessage>
                )}
              </FormControl>


            </Box>








          </div>
        </Box>
      </Card>
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
    </form>
  );
}

