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
import { getManageTranCode, getTranCodeDetail } from "@app/redux/tranCode/slice";
import useFetchTranCodeDetail from "@app/hooks/selector/useFetchTranCodeDetail";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
// import TextArea from "antd/es/input/TextArea";
import { api } from "@app/utils/AxiosUtils"
import { manageTranCode } from "@app/redux/tranCode/api";
import { TranCodeSchema } from "@app/components/forms/@schemas/tranCodeSchema";
import dayjs from 'dayjs'
import { formatDate } from "@app/utils/DateUtils";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";


export default function TranCodeForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Transaction Code" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;

  const [detailData] = useFetchTranCodeDetail(id);

  const initialValues = {
    pstrnscd: null,
    pstrndsc: null,
    pstrnlds: null,
    pstrndcr: null,
    pstrnaf1: null,
    pstrnaf2: null,
    pstrnaf3: null,
    pstrntyp: null,
    pstrnrev: null,
    pstrnpsq: null,
    pstrnarb: "N",
    pstrnect: "N",

  };


  const [ddlData] = useFetchDDL({ code: ["TRNSTYPE", "YESORNO","DRCR","TRNSDORC","TRNSAFFCD"] });



  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: TranCodeSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (mode !== "ADD" && id && Object.keys(detailData).length > 0) {
      formik.setValues({
        ...detailData,
        id: detailData.pstrnscd,
      });
    }
  }, [detailData]);

  async function onSubmit(data: any) {


    const { success } = await sendRequest({
      fn: getManageTranCode({
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
            Transaction Code
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Transaction Code",
              href: `/tranCode`,// Add parameter if needed eg. /generalParameter/?id=123
            },
            {
              title: "Transaction Code ("+ mode +")",
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
            <Box display="flex" flexDir="column" gap={6} width="100%">
              <FormControl
                id="pstrnscd"
                isInvalid={Boolean(formik.errors.pstrnscd)&&Boolean(formik.touched.pstrnscd)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Transaction Code*</FormLabel> */}
                <CustomFormLabel labelText="Transaction Code"/>
                <Input
                  placeholder={"Enter Transaction Code"}
                  type="text"
                  name="pstrnscd"
                  onChange={formik.handleChange}
                  value={formik.values.pstrnscd || ""}
                  isDisabled={mode === "EDIT"}
                />
                {formik.errors.pstrnscd && (
                  <FormErrorMessage>{formik.errors.pstrnscd}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="pstrndsc"
                isInvalid={Boolean(formik.errors.pstrndsc)&&Boolean(formik.touched.pstrndsc)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Description*</FormLabel> */}
                <CustomFormLabel labelText="Description"/>
                <Input
                  placeholder={"Enter Description"}
                  type="text"
                  name="pstrndsc"
                  onChange={formik.handleChange}
                  value={formik.values.pstrndsc || ""}
                />
                {formik.errors.pstrndsc && (
                  <FormErrorMessage>{formik.errors.pstrndsc}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="pstrnlds"
                isInvalid={Boolean(formik.errors.pstrnlds)&&Boolean(formik.touched.pstrnlds)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Local Description</FormLabel>
                <Input
                  placeholder={"Enter Local Description"}
                  type="text"
                  name="pstrnlds"
                  onChange={formik.handleChange}
                  value={formik.values.pstrnlds || ""}
                />
                {formik.errors.pstrnlds && (
                  <FormErrorMessage>{formik.errors.pstrnlds}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="pstrndcr"
                isInvalid={Boolean(formik.errors.pstrndcr)&&Boolean(formik.touched.pstrndcr)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Debit/Credit*</FormLabel> */}
                <CustomFormLabel labelText="Debit/Credit"/>
                <Select
                  placeholder="Select Debit/Credit"
                  value={formik.values.pstrndcr || ""}
                  onChange={formik.handleChange}
                  style={{
                    fontSize: 14,
                  }}
                // isDisabled={mode === "VIEW" ? true : false}
                >
                  {ddlData?.TRNSDORC?.map((option: DDL_TYPES) => ( //change code
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                {formik.errors.pstrndcr && (
                  <FormErrorMessage>{formik.errors.pstrndcr}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="pstrnaf1"
                isInvalid={Boolean(formik.errors.pstrnaf1)&&Boolean(formik.touched.pstrnaf1)}
              >
                {/* <FormLabel>Affect Code 1*</FormLabel> */}
                <CustomFormLabel labelText="Affect Code 1"/>
                <Select
                  placeholder="Select Affect Code 1"
                  value={formik.values.pstrnaf1 || ""}
                  onChange={formik.handleChange}
                  style={{
                    fontSize: 14,
                  }}
                // isDisabled={mode === "VIEW" ? true : false}
                >
                  {ddlData?.TRNSAFFCD?.map((option: DDL_TYPES) => ( //change code
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>{formik.errors.pstrnaf1 && (
                  <FormErrorMessage>{formik.errors.pstrnaf1 }</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                id="pstrnaf2"
                isInvalid={Boolean(formik.errors.pstrnaf2)&&Boolean(formik.touched.pstrnaf2)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Affect Code 2</FormLabel>
                <Select
                  placeholder="Select Affect Code 2"
                  value={formik.values.pstrnaf2 || ""}
                  onChange={formik.handleChange}
                  style={{
                    fontSize: 14,
                  }}
                // isDisabled={mode === "VIEW" ? true : false}
                >
                  {ddlData?.TRNSAFFCD?.map((option: DDL_TYPES) => ( //change code
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                {formik.errors.pstrnaf2 && (
                  <FormErrorMessage>{formik.errors.pstrnaf2}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="pstrnaf3"
                isInvalid={Boolean(formik.errors.pstrnaf3)&&Boolean(formik.touched.pstrnaf3)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Affect Code 3</FormLabel>
                <Select
                  placeholder="Select Affect Code 3"
                  value={formik.values.pstrnaf3 || ""}
                  onChange={formik.handleChange}
                  style={{
                    fontSize: 14,
                  }}
                // isDisabled={mode === "VIEW" ? true : false}
                >
                  {ddlData?.TRNSAFFCD?.map((option: DDL_TYPES) => ( //change code
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                {formik.errors.pstrnaf3 && (
                  <FormErrorMessage>{formik.errors.pstrnaf3}</FormErrorMessage>
                )}
              </FormControl>

            </Box>


            <Box display="flex" flexDir="column" gap={6} width="100%">
              <FormControl
                id="pstrntyp"
                isInvalid={Boolean(formik.errors.pstrntyp)&&Boolean(formik.touched.pstrntyp)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Transaction Type*</FormLabel> */}
                <CustomFormLabel labelText="Transaction Type"/>
                <Select
                  placeholder="Select Transaction Type"
                  value={formik.values.pstrntyp || ""}
                  onChange={formik.handleChange}
                  style={{
                    fontSize: 14,
                  }}
                // isDisabled={mode === "VIEW" ? true : false}
                >
                  {ddlData?.TRNSTYPE?.map((option: DDL_TYPES) => ( //change code
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                {formik.errors.pstrntyp && (
                  <FormErrorMessage>{formik.errors.pstrntyp}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                id="pstrnrev"
                isInvalid={Boolean(formik.errors.pstrnrev)&&Boolean(formik.touched.pstrnrev)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Transaction Reversal Code</FormLabel>
                <Input
                  placeholder={"Enter Transaction Reversal Code"}
                  type="text"
                  name="pstrnrev"
                  onChange={formik.handleChange}
                  value={formik.values.pstrnrev || ""}
                />
                {formik.errors.pstrnrev && (
                  <FormErrorMessage>{formik.errors.pstrnrev}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="pstrnpsq"
                isInvalid={Boolean(formik.errors.pstrnpsq)&&Boolean(formik.touched.pstrnpsq)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Posting Sequence</FormLabel>
                <Input
                  placeholder={"Enter Posting Sequence"}
                  type="number"
                  name="pstrnpsq"
                  min="0"
                  value={(formik.values.pstrnpsq || formik.values.pstrnpsq==0)? formik.values.pstrnpsq : ""}

                  onChange={formik.handleChange}
                />
                {formik.errors.pstrnpsq && (
                  <FormErrorMessage>{formik.errors.pstrnpsq}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="pstrnarb"
                isInvalid={Boolean(formik.errors.pstrnarb)&&Boolean(formik.touched.pstrnarb)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Affect Rest Balance</FormLabel>
                <Select
                  placeholder="Select Affect Rest Balance"
                  value={formik.values.pstrnarb || ""}
                  onChange={formik.handleChange}
                  style={{
                    fontSize: 14,
                  }}
                // isDisabled={mode === "VIEW" ? true : false}
                >
                  {ddlData?.YESORNO?.map((option: DDL_TYPES) => ( //change code
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                {formik.errors.pstrnarb && (
                  <FormErrorMessage>{formik.errors.pstrnarb}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="pstrnect"
                isInvalid={Boolean(formik.errors.pstrnect)&&Boolean(formik.touched.pstrnect)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Error Correction TC</FormLabel>
                <Select
                  placeholder="Select Error Correction TC"
                  value={formik.values.pstrnect || ""}
                  onChange={formik.handleChange}
                  style={{
                    fontSize: 14,
                  }}
                // isDisabled={mode === "VIEW" ? true : false}
                >
                  {ddlData?.YESORNO?.map((option: DDL_TYPES) => ( //change code
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                {formik.errors.pstrnect && (
                  <FormErrorMessage>{formik.errors.pstrnect}</FormErrorMessage>
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

