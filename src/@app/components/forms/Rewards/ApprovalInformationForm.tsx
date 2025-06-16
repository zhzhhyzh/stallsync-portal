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
  Grid,
  GridItem,
  Textarea,
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";
import dayjs from 'dayjs'
import Spacing from "@app/constants/Spacing";
import { DatePicker, Form, Space, Tag } from "antd";

import Card from "@app/components/common/Card/Card";

import { IoChevronBack, IoSave } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import { manageGenType } from "@app/redux/generalParam/slice";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
// import { GeneralTypeSchema } from "@app/components/forms/@schemas/generalTypeSchema";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
// import { fetchRaiseRewardTrans } from "@app/redux/rewards/slice";
// import useFetchRewardsProductsDetail from "@app/hooks/selector/useFetchRewardsProductsDetail";
import { closeGlobalModal, openGlobalModal, refreshTable, selectHome } from "@app/redux/app/slice";

export default function ApprovalInformationForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Approval Information" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const formik = props.formik
  const id = props.id;
  const mode = props.mode;
  const myReq = props.myReq;
  const detailData = props.detailData;
  const homeData = useAppSelector(selectHome);  

// useEffect(()=>{
// alert(myReq)
// },[myReq])
  // const psrwaprd = props.psrwaprd;
  // const userName = props.userName
  // const psrwpoid = props.psrwpoid;
  // const [detailData] =
  //   useFetchRewardsProductsDetail(psrwaprd);
  // const [ tranCode ] =
  //   useFetchDDLTranCode();
  const [ddlData] = useFetchDDL({ code: ["APRV"] });

  // const detailData = props.detailData



  // useEffect(() => {

  //   if (mode !== "ADD" && id) {
  //     //Reset Form if detailData is empty object
  //     if (Object.keys(detailData).length === 0) formik?.resetForm();

  //     if (Object.keys(detailData).length > 0) {
  //       formik?.setValues({
  //         ...detailData,
  //         id: detailData?.psrqtrfn,
  //       });
  //     }
  //   }
  // }, [detailData]);
// useEffect(()=>{
// console.log(formik.values)
// },[formik ])


  return (
    <form onSubmit={formik?.handleSubmit} >
      <Flex flexDir={"row"} gap={5}>


        <Card
          borderRadius="0"
          p={4}
          mt={`${Spacing.containerPx}`}
          className="grid grid-cols-1 gap-6"
        >
          <Box>
            {/* <Flex pt={3} pb={5} justifyContent="space-between">
            <Box className="flex flex-row items-center gap-2">
              <Text fontSize="lg" fontWeight={"bold"}>
                General Parameter{ " - " + mode}
              </Text>
            </Box>
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
          </Flex> */}
            <Text fontSize="19pt" fontWeight={500} mb={6}>
              Approval Information
            </Text>
            <div className="flex flex-row sm:flex-row gap-52">
              <Box display="flex" flexDir="column" gap={6} width="100%">
                <FormControl
                  id="psrqtmkr"
                  // isInvalid={Boolean(formik?.errors.psrwaccn) && Boolean(formik?.touched.psrwaccn)}
                  isReadOnly={true}
                  width="100%"
                >
                  <FormLabel>Submitted By</FormLabel>
                  <Input
                    placeholder={" "}
                    type="text"
                    name="psrqtmkr"
                    onChange={formik?.handleChange}
                    onBlur={formik?.handleBlur}
                    value={formik?.values.psrqtmkr}
                    isDisabled={mode === "EDIT" ? true : false}
                  />
                  {/* {formik?.errors.psrwaccn && (
                    <FormErrorMessage>{formik?.errors.psrwaccn}</FormErrorMessage>
                  )} */}
                </FormControl>
                <FormControl
                  id="psrqtmkd"
                  isReadOnly={mode === "VIEW"}
                  isInvalid={Boolean(formik?.errors.psrqtmkd) && Boolean(formik?.touched.psrqtmkd)}
                >
                  <FormLabel>Submitted Date</FormLabel>
                  <DatePicker
                                        placeholder={" "}

                    format={"DD/MM/YYYY"}
                    style={{ width: "100%" }}
                    value={
                      formik?.values.psrqtmkd
                        ? dayjs(formik?.values.psrqtmkd)
                        : null
                    }
                    onChange={(value) => {
                      formik?.handleChange({
                        target: { value, name: "psrqtmkd" },
                      });

                    }

                    }

                    onBlur={formik?.handleBlur}
                    open={false}
                    inputReadOnly={true}
                  disabled={true}
                  />
                  {formik?.errors.psrqtmkd && (
                    <FormErrorMessage>{formik?.errors.psrqtmkd}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  isReadOnly

                  id="psrqtckr"
                  isInvalid={Boolean(formik?.errors.psrqtckr) && Boolean(formik?.touched.psrqtckr)}
                //    isReadOnly
                >
                  {/* <FormLabel>Authentication Method*</FormLabel> */}
                  <FormLabel>Approved By</FormLabel>
                  <Input
                    placeholder={" "}
                    type="text"
                    name="psrqtckr"
                    onChange={formik?.handleChange}
                    onBlur={formik?.handleBlur}
                    value={myReq?formik?.values.psrqtckr:formik.values.psrqtsts==="PEN"?homeData?.psusrunm:formik.values.psrqtckr}
                    isDisabled={mode === "EDIT" ? true : false}
                  />
                  {formik?.errors.psrqtckr && (
                    <FormErrorMessage>{formik?.errors.psrqtckr}</FormErrorMessage>
                  )}
                </FormControl>
                <Flex flexDir={"row"} gap={Spacing.containerPx}>
                  <FormControl
                    id="psrqtsts"
                    isReadOnly={mode === "VIEW"}
                    isInvalid={Boolean(formik?.errors.psrqtsts) && Boolean(formik?.touched.psrqtsts)}
                  >
                    <FormLabel>Approval Status</FormLabel>
                    <Select
                  isDisabled={detailData.psrqtsts!=="PEN"}
                    name="psrqtsts"
                    placeholder=" "
                    value={formik?.values.psrqtsts}
                    onChange={formik?.handleChange}
                    onBlur={formik?.handleBlur}
                    style={{
                      fontSize: 14,
                    }}
                  >
                    {ddlData?.APRV?.filter((code:any)=>(myReq&&detailData?.psrqtsts==="PEN")?code.prgecode==="CNL"||code.prgecode==="PEN":code.prgecode==="APV"||code.prgecode==="REJ").map(
                      (
                        option: any //change code
                      ) => (
                        <option key={option.prgecode} value={option.prgecode}>
                          {option.prgedesc}
                        </option>
                      )
                    )}
                  </Select>
                    {formik?.errors.psrqtsts && (
                      <FormErrorMessage>{formik?.errors.psrqtsts}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    isReadOnly

                    id="psrqtstd"
                    isInvalid={Boolean(formik?.errors.psrqtstd) && Boolean(formik?.touched.psrqtstd)}
                  //    isReadOnly
                  >
                    {/* <FormLabel>Authentication Method*</FormLabel> */}
                    <FormLabel>Approval Date</FormLabel>
                    <DatePicker
                      format={"DD/MM/YYYY"}
                      style={{ width: "100%" }}
                      value={

                        formik.values.psrqtsts==="PEN"?
                        dayjs()
:
                      (  formik?.values.psrqtstd
                          ? dayjs(formik?.values.psrqtstd)
                          : null
                          )
                      }
                      onChange={(value) => {
                        formik?.handleChange({
                          target: { value, name: "psrqtstd" },
                        });

                      }

                      }
                      placeholder={" "}
                      onBlur={formik?.handleBlur}
                    disabled={true}
                    allowClear={false}
                    inputReadOnly={true}
                    open={false}
                    />
                    {formik?.errors.psrqtstd && (
                      <FormErrorMessage>{formik?.errors.psrqtstd}</FormErrorMessage>
                    )}
                  </FormControl>
                </Flex>


              </Box>
              <Box display="flex" flexDir="column" gap={6} width="100%">

                <FormControl
                  id="psrqtrmk"
                  isReadOnly={myReq||detailData.psrqtsts!=="PEN"}

                  isInvalid={Boolean(formik?.errors.psrqtrmk) && Boolean(formik?.touched.psrqtrmk)}
                >
                  <FormLabel>Approval Remarks</FormLabel>
                  <Textarea
                    placeholder={" "}
                    name="psrqtrmk"
                    onChange={formik?.handleChange}
                    onBlur={formik?.handleBlur}
                    value={formik?.values.psrqtrmk}
                    isDisabled={mode === "EDIT" ? true : false}
                    rows={8}
                  />
                  {formik?.errors.psrqtrmk && (
                    <FormErrorMessage>{formik?.errors.psrqtrmk}</FormErrorMessage>
                  )}
                </FormControl>
              </Box>

            </div>
          </Box>
        </Card>


      </Flex>

    </form>
  );
}