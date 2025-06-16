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
// import { postRemoveFile,postUploadFile } from "@app/redux/app/slice";


// assets
import React, { ReactNode, useEffect, useState } from "react";
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
import { getManageFeeCode, getFeeCodeDetail } from "@app/redux/feeCode/slice";
import useFetchFeeCodeDetail from "@app/hooks/selector/useFetchFeeCodeDetail";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
// import TextArea from "antd/es/input/TextArea";
import { api } from "@app/utils/AxiosUtils"
import { manageFeeCode } from "@app/redux/feeCode/api";
import { FeeCodeSchema } from "../@schemas/feeCodeSchema";
import dayjs from 'dayjs'
import { formatDate } from "@app/utils/DateUtils";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
import useFetchDDLGlacpf from "@app/hooks/selector/useFetchDDLGlacpf";
import useFetchDDLTaxpar from "@app/hooks/selector/useFetchDDLTaxpar";
import useFetchTranCodes from "@app/hooks/selector/useFetchTranCodes";
import { fetchCreateRequest } from "@app/redux/request/slice";
import useFetchMembers from "@app/hooks/selector/useFetchMembers";


export default function RaiseRequestForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Wallet Manual Adjustment" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;
  const [glacpf] = useFetchDDLGlacpf();
  const [taxpar] = useFetchDDLTaxpar();
  const [members] = useFetchMembers({});

  const [detailData] = useFetchFeeCodeDetail(id);

  const initialValues = {
    psmbruid: null,
    pstrxamt: null,
    pstrnscd: null,
    pstrxdat: dayjs(),
    pstrxrmk:null ,
  };


  const [tranCodes] = useFetchTranCodes({})



  const formik = useFormik({
    enableReinitialize: false,
    initialValues: initialValues,
    // validationSchema: FeeCodeSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    // if(mode==="EDIT") setSubmit(formik.handleSubmit)
  }, [formik])

  useEffect(() => {
    if (mode !== "ADD" && id) {
      if (Object.keys(detailData).length === 0) {
        formik.resetForm();
      }
      if (Object.keys(detailData).length > 0) {
        formik.setValues({
          ...detailData,
          id: detailData.psprdcde,
        });
      }
    }
  }, [detailData]);

  async function onSubmit(data: any) {

    const { success } = await sendRequest({
      fn: fetchCreateRequest({
        ...data, id: mode === "EDIT" ? id : "",
      }),
      formik,
    });

    if (success) {
      setTimeout(() => {
        showModal(dispatch, {
          title: mode !== "ADD" ? "Update record" : "Add record",
          message: mode !== "ADD" ? "Record Updated" : "Record Added",
        });
        router.back();
      }, 200);
    }
  }
  // useEffect(() => {
  //   console.log(formik.errors)
  // }, [formik.errors])

  return (
    <form onSubmit={formik.handleSubmit} id="form1">
      {/*{mode === "ADD" && */}
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4} py={Spacing.gap}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
              Wallet Manual Adjustment
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Membership Listing",
              href: `/member`
            },
            {
              title: "Membership Profile",
              href: `/member/Detail?id=${id}`
            },
            {
              title: `Wallet Manual Adjustment`
            }
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
      {/* } */}

      <Card
        p={4}
        mt={`${Spacing.containerPx}`}
        className="grid grid-cols-1 gap-6"
      >
        <Box>
          <div className="flex flex-col sm:flex-row gap-6">
            <Box display="flex" flexDir="row" gap={5} width="100%">

              <Box display="flex" flexDir="column" gap={5} width="100%">
                <Box display="flex" flexDir="row" gap={5} width="100%">

                  <FormControl
                    id="psfeecod"
                    isInvalid={Boolean(formik.errors.psmbruid) && Boolean(formik.touched.psmbruid)}
                    // isReadOnly={mode === "VIEW" ? true : false}
                    isDisabled={true}
                    width="100%"
                  >
                    {/* <FormLabel>Fee Code*</FormLabel> */}
                    <CustomFormLabel labelText="Member" />
                      <Select
                      // placeholder="Select Eligibility Rules - Tenure Terms Maximum"
                      placeholder="Select Member"
                      value={formik.values.psmbruid || ""}
                      onChange={formik.handleChange}
                      style={{
                        fontSize: 14,
                      }}
                    // isDisabled={mode === "VIEW" ? true : false}
                    >
                      {Array.isArray(members)&&members?.map((option: any) => ( //change code
                        <option key={option.psmbruid} value={option.psmbruid}>
                          {option.psmbrnme}
                        </option>
                      ))}
                    </Select>
                    {formik.errors.psmbruid && (
                      <FormErrorMessage>{formik.errors.psmbruid}</FormErrorMessage>
                    )}
                  </FormControl>

                </Box>
                <Box display="flex" flexDir="row" gap={5} width="100%">

                  <FormControl
                    id="psfeedsc"
                    isInvalid={Boolean(formik.errors.pstrxamt) && Boolean(formik.touched.pstrxamt)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    {/* <FormLabel>Fee Code Description*</FormLabel> */}
                    <CustomFormLabel labelText="Transaction Amount" />
                    <Input
                      placeholder={"Enter Transaction Amount"}
                      type="number"
                      name="pstrxamt"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.pstrxamt || ""}
                    />
                    {formik.errors.pstrxamt && (
                      <FormErrorMessage>{formik.errors.pstrxamt}</FormErrorMessage>
                    )}
                  </FormControl>

                </Box>
                <Box display="flex" flexDir="row" gap={5} width="100%">

                  <FormControl
                    id="pstrnscd"
                    isInvalid={Boolean(formik.errors.pstrnscd) && Boolean(formik.touched.pstrnscd)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    {/* <FormLabel>Local Description*</FormLabel> */}
                    <CustomFormLabel labelText="Transaction Code" />
                    <Select
                      // placeholder="Select Eligibility Rules - Tenure Terms Maximum"
                      placeholder="Select Transaction Code"
                      value={formik.values.pstrnscd || ""}
                      onChange={formik.handleChange}
                      style={{
                        fontSize: 14,
                      }}
                    // isDisabled={mode === "VIEW" ? true : false}
                    >
                      {Array.isArray(tranCodes)&&tranCodes?.map((option: any) => ( //change code
                        <option key={option.pstrnscd} value={option.pstrnscd}>
                          {option.pstrndsc}
                        </option>
                      ))}
                    </Select>
                    {formik.errors.pstrnscd && (
                      <FormErrorMessage>{formik.errors.pstrnscd}</FormErrorMessage>
                    )}
                  </FormControl>


                </Box>



              </Box>
              <Box display="flex" flexDir="column" gap={5} width="100%">


              
                <FormControl
                  id="pstrxdat"
                  isInvalid={Boolean(formik.errors.pstrxdat) && Boolean(formik.touched.pstrxdat)}
                  isReadOnly={mode === "VIEW" ? true : false}
                  width="100%"
                >
                  {/* <FormLabel>Tax Code{formik.values.psfeestt === "Y" && <>*</>}</FormLabel> */}

                  {/* <CustomFormLabel labelText="Tax Code" /> */}
                  <FormLabel>Transation Date</FormLabel>

                  <DatePicker
                    id="pstrxdat"
                    name="pstrxdat"
                    style={{ width: "100%" }}
                    format={"DD/MM/YYYY"}
                    value={
                      formik.values.pstrxdat
                        ? dayjs(formik.values.pstrxdat)
                        : null
                    }
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "pstrxdat" },
                      })
                    }
                    // inputReadOnly={true}
                    // open={false}
                    // allowClear={false}
                  />

                  
                  {formik.errors.pstrxdat && (
                    <FormErrorMessage>{formik.errors.pstrxdat as ReactNode}</FormErrorMessage>
                  )}
                </FormControl>


                <Box display="flex" flexDir="row" gap={5} width="100%">
                  <FormControl
                    id="pstrxrmk"
                    isInvalid={Boolean(formik.errors.pstrxrmk) && Boolean(formik.touched.pstrxrmk)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                   
                   <Textarea
                        placeholder="Enter Remarks"
                        value={formik.values.pstrxrmk || ""}
                        name="pstrxrmk"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />

                    {formik.errors.pstrxrmk && (
                      <FormErrorMessage>{formik.errors.pstrxrmk}</FormErrorMessage>
                    )}
                  </FormControl>
                </Box>
            

              </Box>
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

