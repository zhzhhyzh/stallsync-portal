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
  Switch,
  InputGroup,
  Stack,
  Tabs,
  TabList, Tooltip,
} from "@chakra-ui/react";
import Table from "@app/components/common/Table/Table";

import {
  DownloadOutlined,
  FolderViewOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { postUploadFile } from "@app/redux/app/slice";
import CustomTabs from "@app/components/common/Tabs/CustomTabs";
import {
  fetchredemptions,

} from "@app/redux/reward/slice";
import {
  numberWithCommas,
  parseThousandsToNumber,
  numberPattern,
} from "@app/utils/StringUtils";
// assets
import React, { useEffect, useState } from "react";
import { message, Upload, } from 'antd';

import { DatePicker, Space, Tag, Select as AntdSelect, TimePicker, Typography } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { IoChevronBack, IoSave } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal } from "@app/redux/app/slice";
import useFetchDDLMerchants from "@app/hooks/selector/useFetchDDLMerchants";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
// import { getmanageReward, getrewardDetail } from "@app/redux/reward/slice";
import useFetchTransactionDetail from "@app/hooks/selector/useFetchTransactionDetail";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
// import TextArea from "antd/es/input/TextArea";
import { api } from "@app/utils/AxiosUtils"
// import { RewardSchema } from "@app/components/forms/@schemas/rewardSchema";
import dayjs from 'dayjs'
import { formatDate } from "@app/utils/DateUtils";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
import { useToast } from "@chakra-ui/react";


export default function TransactionForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Transaction" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const ordDate = props.ordDate;
  const ordId = props.ordId;
  const mode = props.mode;

  const [detailData] = useFetchTransactionDetail(id);
  const [ddlData1] = useFetchDDLMerchants();
  const [skillArr, setSkillArr] = useState<string[]>([]);



  const initialValues = {



    pstrxuid: null,
    psorduid: null,


    pstrxba1: null,
    pstrxstr: null,
    pstrxbpo: null,
    pstrxbci: null,
    pstrxbst: null,
    pstrxbtr: null,
    pstrxcrc: "",
    pstrxsts: null,
    pstrxmtd: null,
    pstrxba2: "",
    pstrxdat: "",
    pstrxamt: "",




  };


  const [ddlData] = useFetchDDL({ code: ["PYMTD", "CRCY", "TRXSTS"] });




  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    // validationSchema: RewardSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (mode !== "ADD" && id && Object.keys(detailData).length > 0) {
      formik.setValues({
        ...detailData,
        id: detailData.pstrxuid,
        pstrxdat: dayjs(detailData?.pstrxdat),

      });
    }
  }, [detailData]);

  async function onSubmit(data: any) {

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight

    const fromDate = new Date(data.pstrxdat);
    const toDate = new Date(data.psrwdtdt);



    //   const { success } = await sendRequest({
    //     fn: getmanageReward({
    //       id: mode === "EDIT" ? data.id : "",
    //       ...data,
    //     }),
    //     formik,
    //   });

    //   if (success) {
    //     setTimeout(() => {
    //       showModal(dispatch, {
    //         title: mode !== "ADD" ? "Update item" : "Add item",
    //         message: mode !== "ADD" ? "Record Updated" : "Record Added",
    //       });
    //       router.back();
    //     }, 200);
    //   }
  }


  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Transaction
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Order",
              href: `/order`,// Add parameter if needed eg. /generalParameter/?id=123
            },

            {
              title: "Transaction",
              href: `/order/transaction?id=${ordId}&date=${ordDate}`,// Add parameter if needed eg. /generalParameter/?id=123
            },
            {
              title: "Transaction (" + mode + ")",
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
              <Flex justifyContent="space-between" alignItems="center" gap={5}>

                <FormControl
                  id="pstrxdat"
                  isInvalid={
                    Boolean(formik.errors.pstrxdat) &&
                    Boolean(formik.touched.pstrxdat)
                  }
                //    isReadOnly
                >
                  <FormLabel>Transaction Made Date</FormLabel>
                  <DatePicker disabled={mode === "VIEW"}
                    format={"DD/MM/YYYY"}
                    style={{ width: "100%" }}
                    value={
                      formik.values.pstrxdat
                        ? dayjs(formik.values.pstrxdat)
                        : null
                    }
                    onChange={(value) => {
                      formik.setFieldValue("pstrxdat", value);
                    }}

                    onBlur={formik.handleBlur}
                  // disabled={true}
                  />
                  {formik.errors.pstrxdat && (
                    <FormErrorMessage>{formik.errors.pstrxdat}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl
                  id="pstrxsts"
                  isInvalid={Boolean(formik.errors.pstrxsts) && Boolean(formik.touched.pstrxsts)}
                >
                  <FormLabel>Transaction Status</FormLabel>
                  {/* <CustomFormLabel labelText="Transaction Status" /> */}
                  <Select
                    placeholder="Select Transaction Status"
                    value={formik.values.pstrxsts || ""}
                    onChange={formik.handleChange}
                    style={{
                      fontSize: 14,
                    }}
                  // isDisabled={mode === "VIEW" ? true : false}
                  >
                    {ddlData?.TRXSTS?.map((option: DDL_TYPES) => ( //change code
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    ))}
                  </Select>{formik.errors.pstrxsts && (
                    <FormErrorMessage>{formik.errors.pstrxsts}</FormErrorMessage>
                  )}
                </FormControl>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" gap={5}>

                <FormControl
                  id="pstrxuid"
                  isInvalid={Boolean(formik.errors.pstrxuid) && Boolean(formik.touched.pstrxuid)}
                  isReadOnly={mode === "VIEW" ? true : false}
                >
                  <FormLabel>Transaction Id</FormLabel>
                  {/* <CustomFormLabel labelText="Transaction Id" /> */}
                  <Input
                    placeholder={"Enter Transaction Id"}
                    type="text"
                    name="pstrxuid"
                    onChange={formik.handleChange}
                    value={formik.values.pstrxuid || ""}
                    isDisabled={mode === "EDIT"}
                  />
                  {formik.errors.pstrxuid && (
                    <FormErrorMessage>{formik.errors.pstrxuid}</FormErrorMessage>
                  )}
                </FormControl>



                <FormControl
                  id="psorduid"
                  isInvalid={Boolean(formik.errors.psorduid) && Boolean(formik.touched.psorduid)}
                  isReadOnly={mode === "VIEW" ? true : false}
                >
                  <FormLabel>Order Id</FormLabel>
                  {/* <CustomFormLabel labelText="Description" /> */}
                  <Input
                    placeholder={"Enter Order Id"}
                    type="text"
                    name="psorduid"
                    onChange={formik.handleChange}
                    value={formik.values.psorduid || ""}
                  />
                  {formik.errors.psorduid && (
                    <FormErrorMessage>{formik.errors.psorduid}</FormErrorMessage>
                  )}
                </FormControl>


              </Flex>



              <Flex justifyContent="space-between" alignItems="center" gap={5}>


                <FormControl
                  id="pstrxmtd"
                  isInvalid={Boolean(formik.errors.pstrxmtd) && Boolean(formik.touched.pstrxmtd)}
                  isReadOnly={mode === "VIEW" ? true : false}
                >
                  <FormLabel>Payment Method</FormLabel>
                  {/* <CustomFormLabel labelText="Reward Status" /> */}
                  <Select
                    placeholder="Select Payment Method"
                    value={formik.values.pstrxmtd || ""}
                    onChange={formik.handleChange}
                    style={{
                      fontSize: 14,
                    }}
                  >
                    {ddlData?.PYMTD?.map((option: DDL_TYPES) => ( //change code
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    ))}
                  </Select>
                  {formik.errors.pstrxmtd && (
                    <FormErrorMessage>{formik.errors.pstrxmtd}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl
                  id="pstrxcrc"
                  isInvalid={Boolean(formik.errors.pstrxcrc) && Boolean(formik.touched.pstrxcrc)}
                  isReadOnly={mode === "VIEW" ? true : false}
                >
                  <FormLabel>Currency</FormLabel>
                  {/* <CustomFormLabel labelText="Reward Status" /> */}
                  <Select
                    placeholder="Select Currency"
                    value={formik.values.pstrxcrc || ""}
                    onChange={formik.handleChange}
                    style={{
                      fontSize: 14,
                    }}
                  >
                    {ddlData?.CRCY?.map((option: DDL_TYPES) => ( //change code
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    ))}
                  </Select>
                  {formik.errors.pstrxcrc && (
                    <FormErrorMessage>{formik.errors.pstrxcrc}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl
                  id="pstrxamt"
                  isInvalid={Boolean(formik.errors.pstrxamt) && Boolean(formik.touched.pstrxamt)}
                  isReadOnly={mode == "VIEW"}
                >


                  <FormLabel>Transaction Amount</FormLabel>

                  <Stack spacing={4}>
                    <InputGroup>

                      <Input
                        type="text"
                        name="pstrxamt"
                        placeholder="Enter Transaction Amount"
                        value={numberWithCommas(formik.values.pstrxamt)}
                        pattern={numberPattern}
                        onChange={(event) => {
                          const value = event.target.value;

                          // Check if the value is a valid number or empty
                          if (!value || /^[0-9.,]*$/.test(value)) {
                            formik.handleChange({
                              target: {
                                value: parseThousandsToNumber(value),
                                name: "pstrxamt",
                              },
                            });
                          }
                        }}
                        onBlur={formik.handleBlur}
                      />
                    </InputGroup>
                  </Stack>
                  {formik.errors.pstrxamt && (
                    <FormErrorMessage>{formik.errors.pstrxamt}</FormErrorMessage>
                  )}
                </FormControl>
              </Flex>

              <FormControl
                id="pstrxstr"
                isInvalid={Boolean(formik.errors.pstrxstr) && Boolean(formik.touched.pstrxstr)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Stripe Id</FormLabel>
                <Input
                  placeholder={"Enter Stripe Id"}
                  type="text"
                  name="pstrxstr"
                  onChange={formik.handleChange}
                  value={formik.values.pstrxstr || ""}
                />
                {formik.errors.pstrxstr && (
                  <FormErrorMessage>{formik.errors.pstrxstr}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="pstrxba1"
                isInvalid={Boolean(formik.errors.pstrxba1) && Boolean(formik.touched.pstrxba1)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Billing Address 1</FormLabel>
                <Input
                  placeholder={"Enter Billing Address 1"}
                  type="text"
                  name="pstrxba1"
                  onChange={formik.handleChange}
                  value={formik.values.pstrxba1 || ""}
                />
                {formik.errors.pstrxba1 && (
                  <FormErrorMessage>{formik.errors.pstrxba1}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                id="pstrxba2"
                isInvalid={Boolean(formik.errors.pstrxba2) && Boolean(formik.touched.pstrxba2)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Billing Address 2</FormLabel>
                {/* <CustomFormLabel labelText="Billing Address 2" /> */}
                <Input
                  placeholder={"Enter Billing Address 2"}
                  type="text"
                  name="pstrxba2"
                  onChange={formik.handleChange}
                  value={formik.values.pstrxba2 || ""}
                />
                {formik.errors.pstrxba2 && (
                  <FormErrorMessage>{formik.errors.pstrxba2}</FormErrorMessage>
                )}
              </FormControl>



              <Flex justifyContent="space-between" alignItems="center" gap={5}>
                <FormControl
                  id="pstrxbci"
                  isInvalid={Boolean(formik.errors.pstrxbci) && Boolean(formik.touched.pstrxbci)}
                  isReadOnly={mode === "VIEW" ? true : false}
                >
                  <FormLabel>Billing City</FormLabel>
                  <Input
                    placeholder={"Enter Billing City"}
                    type="text"
                    name="pstrxbci"
                    onChange={formik.handleChange}
                    value={formik.values.pstrxbci || ""}
                  />
                  {formik.errors.pstrxbci && (
                    <FormErrorMessage>{formik.errors.pstrxbci}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl
                  id="pstrxbst"
                  isInvalid={Boolean(formik.errors.pstrxbst) && Boolean(formik.touched.pstrxbst)}
                  isReadOnly={mode === "VIEW" ? true : false}
                >
                  <FormLabel>Billing State</FormLabel>
                  <Input
                    placeholder={"Enter Billing State"}
                    type="text"
                    name="pstrxbst"
                    onChange={formik.handleChange}
                    value={formik.values.pstrxbst || ""}
                  />
                  {formik.errors.pstrxbst && (
                    <FormErrorMessage>{formik.errors.pstrxbst}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl
                  id="pstrxbpo"
                  isInvalid={Boolean(formik.errors.pstrxbpo) && Boolean(formik.touched.pstrxbpo)}
                  isReadOnly={mode === "VIEW" ? true : false}
                >
                  <FormLabel>Billing Postcode</FormLabel>
                  <Input
                    placeholder={"Enter Billing Postcode"}
                    type="text"
                    name="pstrxbpo"
                    onChange={formik.handleChange}
                    value={formik.values.pstrxbpo || ""}
                  />
                  {formik.errors.pstrxbpo && (
                    <FormErrorMessage>{formik.errors.pstrxbpo}</FormErrorMessage>
                  )}
                </FormControl>



              </Flex>











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

