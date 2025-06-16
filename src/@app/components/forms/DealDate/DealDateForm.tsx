// Chakra imports
import Colors from "@app/constants/Colors";
import {
  numberWithCommas,
  numberPattern,
  parseThousandsToNumber,
} from "@app/utils/StringUtils";
import {
  Box,
  Flex,
  Text,
  Input,
  Button, Stack,
  InputGroup,
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
import { getManageDealDate } from "@app/redux/dealDate/slice";
import useFetchDealDateDetail from "@app/hooks/selector/useFetchDealDateDetail";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
// import TextArea from "antd/es/input/TextArea";
import { api } from "@app/utils/AxiosUtils"
import { DealDateSchema } from "@app/components/forms/@schemas/dealDateSchema";
import dayjs from 'dayjs'
import { formatDate } from "@app/utils/DateUtils";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";


export default function DealDateForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Deal Date" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;

  const [detailData] = useFetchDealDateDetail(id);

  const initialValues = {
    psddtmnt: "",
    psddtyer: "",
    psddtvl1: "",
    psddtvl2: "",

  };


  const [ddlData] = useFetchDDL({ code: ["MONTH"] });



  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: DealDateSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (mode !== "ADD" && id && Object.keys(detailData).length > 0) {
      formik.setValues({
        ...detailData,
        id: detailData.id,
      });
    }else{
      formik.resetForm()
    }
  }, [detailData]);

  async function onSubmit(data: any) {


    const { success } = await sendRequest({
      fn: getManageDealDate({
        id: mode === "EDIT" ? data.id : "", ...data,
      }),
      formik,
    });

    if (success) {
      setTimeout(() => {
        showModal(dispatch, {
          title: mode !== "ADD" ? "Update item" : "Add item",
          message: mode !== "ADD" ? "Record Updated" : "Record Added",
        });
        router.back();
      }, 200);
    }
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Deal Date
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Deal Date",
              href: `/dealDate`,// Add parameter if needed eg. /generalParameter/?id=123
            },
            {
              title: "Deal Date Detail (" + mode + ")",
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
                id="psddtmnt"
                isInvalid={Boolean(formik.errors.psddtmnt) && Boolean(formik.touched.psddtmnt)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Debit/Credit*</FormLabel> */}
                <CustomFormLabel labelText="Month" />
                <Select
                  placeholder="Select Month"
                  value={formik.values.psddtmnt || ""}
                  onChange={formik.handleChange}
                  style={{
                    fontSize: 14,
                  }}
                  isDisabled={mode === "VIEW" || mode === "EDIT" ? true : false}
                >
                  {ddlData?.MONTH?.map((option: DDL_TYPES) => ( //change code
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                {formik.errors.psddtmnt && (
                  <FormErrorMessage>{formik.errors.psddtmnt}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psddtyer"
                isInvalid={Boolean(formik.errors.psddtyer) && Boolean(formik.touched.psddtyer)}
              >
                <FormLabel> Year</FormLabel>
           
                    <Input
                                    isDisabled

                      type="text"
                      name="psddtyer"
                      // placeholder="Enter referee amount"
                      value={(formik.values.psddtyer)}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                 
                {formik.errors.psddtyer && (
                  <FormErrorMessage>{formik.errors.psddtyer}</FormErrorMessage>
                )}
              </FormControl>

         

            </Box>
            <Box display="flex" flexDir="column" gap={6} width="50%">
            <FormControl
                id="psddtvl1"
                isInvalid={Boolean(formik.errors.psddtvl1) && Boolean(formik.touched.psddtvl1)}
              >
                <FormLabel>Deal Date 1</FormLabel>
                <DatePicker  value={formik.values.psddtvl1 ? dayjs(formik.values.psddtvl1) : ""} format={"DD/MM/YYYY"} onChange={(date) => formik.setFieldValue('psddtvl1', date)} className="w-full" />
                {formik.errors.psddtvl1 && (
                  <FormErrorMessage>{formik.errors.psddtvl1 && "Invalid Date"}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psddtvl2"
                isInvalid={Boolean(formik.errors.psddtvl2) && Boolean(formik.touched.psddtvl2)}
              >
                <FormLabel>Deal Date 2</FormLabel>
                <DatePicker  value={formik.values.psddtvl2 ? dayjs(formik.values.psddtvl2)   : ""} format={"DD/MM/YYYY"} onChange={(date) => formik.setFieldValue('psddtvl2', date)} className="w-full" />
                {formik.errors.psddtvl2 && (
                  <FormErrorMessage>{formik.errors.psddtvl2 && "Invalid Date"}</FormErrorMessage>
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

