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
import useFetchDDLGlacpf from "@app/hooks/selector/useFetchDDLGlacpf";


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
import { getManageTaxCode, getTaxCodeDetail } from "@app/redux/taxCode/slice";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
// import TextArea from "antd/es/input/TextArea";
import { api } from "@app/utils/AxiosUtils"
import { TaxCodeSchema } from "@app/components/forms/@schemas/taxCodeSchema";
import dayjs from 'dayjs'
import { formatDate } from "@app/utils/DateUtils";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
import useFetchTaxCodeDetail from "@app/hooks/selector/useFetchTaxCodeDetail";


export default function TaxCodeForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Tax Code" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;
  const [glacpf] = useFetchDDLGlacpf();
  const [detailData] = useFetchTaxCodeDetail(id);

  const initialValues = {
    pstaxcde: null,
    pstaxdsc: null,
    pstaxlds: null,
    pstaxrat: null,
    pstaxgla: null

  };


  // const [ddlData] = useFetchDDL({ code: ["TRNSTYPE", "YESORNO","DRCR","TRNSDORC","TRNSAFFCD"] });



  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: TaxCodeSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (mode !== "ADD" && id && Object.keys(detailData).length > 0) {
      formik.setValues({
        ...detailData,
        id: detailData.pstaxcde,
      });
    }
  }, [detailData]);

  async function onSubmit(data: any) {


    const { success } = await sendRequest({
      fn: getManageTaxCode({
        id: mode === "EDIT" ? data.id : "", ...data,
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
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Tax Code
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Tax Code",
              href: `/taxCode`,// Add parameter if needed eg. /generalParameter/?id=123
            },
            {
              title: "Tax Code (" + mode + ")",
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
                id="pstaxcde"
                isInvalid={Boolean(formik.errors.pstaxcde) && Boolean(formik.touched.pstaxcde)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Transaction Code*</FormLabel> */}
                <CustomFormLabel labelText="Tax Code" />
                <Input
                  placeholder={"Enter Tax Code"}
                  type="text"
                  name="pstaxcde"
                  onChange={formik.handleChange}
                  value={formik.values.pstaxcde || ""}
                  isDisabled={mode === "EDIT"}
                />
                {formik.errors.pstaxcde && (
                  <FormErrorMessage>{formik.errors.pstaxcde}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="pstaxdsc"
                isInvalid={Boolean(formik.errors.pstaxdsc) && Boolean(formik.touched.pstaxdsc)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Description*</FormLabel> */}
                <CustomFormLabel labelText="Description" />
                <Input
                  placeholder={"Enter Description"}
                  type="text"
                  name="pstaxdsc"
                  onChange={formik.handleChange}
                  value={formik.values.pstaxdsc || ""}
                />
                {formik.errors.pstaxdsc && (
                  <FormErrorMessage>{formik.errors.pstaxdsc}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="pstaxlds"
                isInvalid={Boolean(formik.errors.pstaxlds) && Boolean(formik.touched.pstaxlds)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Local Description</FormLabel>
                <Input
                  placeholder={"Enter Local Description"}
                  type="text"
                  name="pstaxlds"
                  onChange={formik.handleChange}
                  value={formik.values.pstaxlds || ""}
                />
                {formik.errors.pstaxlds && (
                  <FormErrorMessage>{formik.errors.pstaxlds}</FormErrorMessage>
                )}
              </FormControl>
            </Box>
            <Box display="flex" flexDir="column" gap={6} width="50%">
              <FormControl
                id="pstaxrat"
                isInvalid={Boolean(formik.errors.pstaxrat) && Boolean(formik.touched.pstaxrat)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <CustomFormLabel labelText="Tax Rate" />
                <Input
                  placeholder={"Enter Tax Rate"}
                  type="text"
                  name="pstaxrat"
                  onChange={formik.handleChange}
                  value={formik.values.pstaxrat || ""}
                />
                {formik.errors.pstaxrat && (
                  <FormErrorMessage>{formik.errors.pstaxrat}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                id="pstaxgla"
                isInvalid={Boolean(formik.errors.pstaxgla) && Boolean(formik.touched.pstaxgla)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>GL Account No.</FormLabel>
                {/* <Input
                  placeholder={"Enter GL Account No."}
                  type="text"
                  name="pstaxgla"
                  onChange={formik.handleChange}
                  value={formik.values.pstaxgla || ""}
                /> */}
                 <Select
                      placeholder="Select GL Account No."
                      value={formik.values.pstaxgla || ""}
                      onChange={formik.handleChange}
                      style={{
                        fontSize: 14,
                      }}
                    // isDisabled={mode === "VIEW" ? true : false}
                    >
                      {Array.isArray(glacpf) && glacpf.length > 0 ? (
                        glacpf.map((option: any) => (
                          <option key={option.psglacno} value={option.psglacno}>
                            {option.psglacno} - {option.psgladsc}
                          </option>
                        ))
                      ) : (
                        <option value="">No options available</option>
                      )}
                    </Select>
                {formik.errors.pstaxgla && (
                  <FormErrorMessage>{formik.errors.pstaxgla}</FormErrorMessage>
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

