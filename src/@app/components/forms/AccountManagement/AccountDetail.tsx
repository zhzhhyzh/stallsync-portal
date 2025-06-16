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
  RadioGroup,
  Stack,
  Radio,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Grid,
  GridItem,
  Switch,
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";

import { DatePicker, Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { IoChevronBack, IoSave } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal } from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import {
  numberWithCommas,
  parseThousandsToNumber,
} from "@app/utils/StringUtils";
import dayjs from "dayjs";
import Buttons from "@app/components/common/Buttons/Buttons";
//import useFetchPreCalculateResult from "@app/hooks/selector/useFetchPreCalculateResult";
import {
  loanPreCalculate,
  selectLoanPreCalculateResult,
} from "@app/redux/accountManagement/slice";
import FormList from "antd/es/form/FormList";
// import SharedListListing from "../Application/SharedListListing";

export default function AccountDetail({ formik, mode }: AccountDetailProps) {
  const { sendRequest, loading } = useApi({ title: "Account Detail" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [ddlData] = useFetchDDL({ code: ["PRDPAYCD"] });
  const preCalcResult = useAppSelector(selectLoanPreCalculateResult);
  //const [preCalcResult] = useFetchPreCalculateResult();

  const handleNPLStatusChange = () => {
    formik.setFieldValue("psaccnpl", !formik.values.psaccnpl);
  };

  useEffect(() => {
    if (preCalcResult.result) {
      formik.setFieldValue(
        "psaccina",
        preCalcResult?.result.monthly_installment
      );
      formik.setFieldValue(
        "psaccfia",
        preCalcResult?.result.final_monthly_installment
      );
    }
  }, [preCalcResult]);

  async function pre_calculate_loan_info() {
    let input = {
      ratetyp: formik.values.psaccinb,
      loanamt: parseThousandsToNumber(formik.values.psacorgm),
      tenure: formik.values.psacctmv,
      tenuretyp: formik.values.psacctmt,
      startdate: formik.values.psaccodt,
      maturitydate: formik.values.psaccmtd,
      paymentfreq: formik.values.psaccpfq,
      paymentfreqtyp: formik.values.psaccpfc,
      rate: formik.values.psaccrat,
      eirate: formik.values.psacceir,
      custominstallment: formik.values.psaccina,
      roundingtyp: formik.values.psaccrty,
      daybasis: formik.values.psaccdbs,
      accrualTyp: formik.values.psaccabt,
      paymentTyp: formik.values.psaccpmc,
    };

    await sendRequest({
      fn: loanPreCalculate(input),
    });
  }

  return (
    <Flex flexDir={"column"} w={"100%"}>
      <Flex
        flexDir={{
          base: "column",
          lg: "row",
        }}
        gap={Spacing.gap}
        //mt={Spacing.gap}
      >
        <Card className="grid grid-cols-1 gap-6" borderRadius={0}>
          <div className="flex flex-col sm:flex-column gap-3">
            <Text fontSize={"19pt"} fontWeight={"medium"}>
              Outstanding Balance
            </Text>
            <Box display="flex" flexDir="column" gap={4} w={"60%"} pl={3}>
              <FormControl
                id="psacccbl"
                isInvalid={
                  Boolean(formik.errors.psacccbl) &&
                  Boolean(formik.touched.psacccbl)
                }
                isReadOnly={true}
              >
                <FormLabel>Current Balance</FormLabel>
                <Input
                  placeholder={"Enter Current Balance"}
                  type="text"
                  name="psacccbl"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.psacccbl}
                  textAlign={"right"}
                  //isDisabled={true}
                />
                {formik.errors.psacccbl && (
                  <FormErrorMessage>{formik.errors.psacccbl}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="outstandig_interest"
                isInvalid={
                  Boolean(formik.errors.outstandig_interest) &&
                  Boolean(formik.touched.outstandig_interest)
                }
                isReadOnly={true}
              >
                <FormLabel>Outstanding Interest</FormLabel>
                <Input
                  placeholder={"Enter Outstanding Interest"}
                  type="text"
                  name="outstandig_interest"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.outstandig_interest}
                  textAlign={"right"}
                  //isDisabled={true}
                />
                {formik.errors.outstandig_interest && (
                  <FormErrorMessage>
                    {formik.errors.outstandig_interest}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psacclch"
                isInvalid={
                  Boolean(formik.errors.psacclch) &&
                  Boolean(formik.touched.psacclch)
                }
                isReadOnly={true}
              >
                <FormLabel>Late Charges</FormLabel>
                <Input
                  placeholder={"Enter Late Charges"}
                  type="text"
                  name="psacclch"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.psacclch}
                  textAlign={"right"}
                  //isDisabled={true}
                />
                {formik.errors.psacclch && (
                  <FormErrorMessage>{formik.errors.psacclch}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psaccfec"
                isInvalid={
                  Boolean(formik.errors.psaccfec) &&
                  Boolean(formik.touched.psaccfec)
                }
                isReadOnly={true}
              >
                <FormLabel>Fee Charges</FormLabel>
                <Input
                  placeholder={"Enter Fee Charges"}
                  type="text"
                  name="psaccfec"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.psaccfec}
                  textAlign={"right"}
                  //isDisabled={true}
                />
                {formik.errors.psaccfec && (
                  <FormErrorMessage>{formik.errors.psaccfec}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psaccavp"
                isInvalid={
                  Boolean(formik.errors.psaccavp) &&
                  Boolean(formik.touched.psaccavp)
                }
                isReadOnly={true}
              >
                <FormLabel>Advance Payment</FormLabel>
                <Input
                  placeholder={"Enter Advance Payment"}
                  type="text"
                  name="psaccavp"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.psaccavp}
                  textAlign={"right"}
                  //isDisabled={true}
                />
                {formik.errors.psaccavp && (
                  <FormErrorMessage>{formik.errors.psaccavp}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="total_outstanding"
                isInvalid={
                  Boolean(formik.errors.total_outstanding) &&
                  Boolean(formik.touched.total_outstanding)
                }
                isReadOnly={true}
              >
                <FormLabel>Total Outstanding</FormLabel>
                <Input
                  placeholder={"Enter Total Outstanding"}
                  type="text"
                  name="total_outstanding"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.total_outstanding}
                  textAlign={"right"}
                  fontWeight={"semibold"}
                  //isDisabled={true}
                />
                {formik.errors.total_outstanding && (
                  <FormErrorMessage>
                    {formik.errors.total_outstanding}
                  </FormErrorMessage>
                )}
              </FormControl>
            </Box>
          </div>
        </Card>
        <Card className="grid grid-cols-1 gap-6" borderRadius={0}>
          <div
            className="flex flex-col sm:flex-column gap-3"
            style={{ height: "100%" }}
          >
            <Text fontSize={"19pt"} fontWeight={"medium"}>
              Pricing Rate
            </Text>
            <Box display="flex" flexDir="column" gap={4} w={"80%"}>
              <Flex w={"100%"}>
                <FormControl
                  id="psacorgm"
                  isInvalid={
                    Boolean(formik.errors.psacorgm) &&
                    Boolean(formik.touched.psacorgm)
                  }
                  isReadOnly={true}
                >
                  <FormLabel>Original Loan Amount</FormLabel>
                  {/* <CustomFormLabel labelText="Original Loan Amount" /> */}
                  <NumberInput
                    //maxW="150px"
                    //mr="2rem"
                    name="psacorgm"
                    min={0}
                    precision={2}
                    onChange={(value) => {
                      let removeThousand = parseThousandsToNumber(value);
                      formik.handleChange({
                        target: { value: removeThousand, name: "psacorgm" },
                      });
                    }}
                    value={numberWithCommas(formik.values.psacorgm)}
                  >
                    <NumberInputField textAlign={"right"} pr={4} />
                    {/* <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper> */}
                  </NumberInput>
                  {formik.errors.psacorgm && (
                    <FormErrorMessage>
                      {formik.errors.psacorgm}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Flex>
              <Flex flexDir={"row"}>
                <FormControl
                  id="psaccrat"
                  isInvalid={
                    Boolean(formik.errors.psaccrat) &&
                    Boolean(formik.touched.psaccrat)
                  }
                  isReadOnly={true}
                  //w={"50%"}
                  pr={1}
                >
                  <FormLabel>Rate (%)</FormLabel>
                  {/* <CustomFormLabel labelText="Rate (%)" /> */}
                  <NumberInput
                    name="psaccrat"
                    min={0}
                    precision={4}
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "psaccrat" },
                      })
                    }
                    onBlur={() => {
                      formik.handleBlur({
                        target: { name: "psaccrat" },
                      });

                      if (formik.values.psacceir == "") {
                        let defaultEIRRate = formik.values.psaccrat;
                        formik.setFieldValue(
                          "psacceir",
                          parseFloat(defaultEIRRate).toFixed(2)
                        );
                      }
                    }}
                    value={formik.values.psaccrat}
                  >
                    <NumberInputField textAlign={"right"} pr={4} />
                    {/* <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper> */}
                  </NumberInput>
                  {formik.errors.psaccrat && (
                    <FormErrorMessage>
                      {formik.errors.psaccrat}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psacceir"
                  isInvalid={
                    Boolean(formik.errors.psacceir) &&
                    Boolean(formik.touched.psacceir)
                  }
                  isReadOnly={true}
                  //w={"50%"}
                  pr={1}
                >
                  <FormLabel>EIR Rate (%)</FormLabel>
                  {/* <CustomFormLabel labelText="EIR Rate (%)" /> */}
                  <NumberInput
                    name="psacceir"
                    min={0}
                    precision={4}
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "psacceir" },
                      })
                    }
                    onBlur={formik.handleBlur}
                    value={formik.values.psacceir}
                  >
                    <NumberInputField textAlign={"right"} pr={4} />
                    {/* <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper> */}
                  </NumberInput>
                  {formik.errors.psacceir && (
                    <FormErrorMessage>
                      {formik.errors.psacceir}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Flex>
              <Flex flexDir={"row"}>
                <FormControl
                  id="psaccttc"
                  isInvalid={
                    Boolean(formik.errors.psaccttc) &&
                    Boolean(formik.touched.psaccttc)
                  }
                  isReadOnly={true}
                  //w={"50%"}
                  pr={1}
                >
                  <FormLabel>Total Term Charges</FormLabel>
                  {/* <CustomFormLabel labelText="Total Term Charges" /> */}
                  <NumberInput
                    name="psaccttc"
                    min={0}
                    precision={4}
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "psaccttc" },
                      })
                    }
                    onBlur={formik.handleBlur}
                    value={formik.values.psaccttc}
                  >
                    <NumberInputField textAlign={"right"} pr={4} />
                    {/* <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper> */}
                  </NumberInput>
                  {formik.errors.psaccttc && (
                    <FormErrorMessage>
                      {formik.errors.psaccttc}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psaccuni"
                  isInvalid={
                    Boolean(formik.errors.psaccuni) &&
                    Boolean(formik.touched.psaccuni)
                  }
                  isReadOnly={true}
                >
                  <FormLabel>Unearned Interest</FormLabel>
                  {/* <CustomFormLabel labelText="Unearned Interest" /> */}
                  <NumberInput
                    name="psaccuni"
                    min={0}
                    precision={4}
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "psaccuni" },
                      })
                    }
                    onBlur={formik.handleBlur}
                    value={formik.values.psaccuni}
                  >
                    <NumberInputField textAlign={"right"} pr={4} />
                    {/* <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper> */}
                  </NumberInput>
                  {formik.errors.psaccuni && (
                    <FormErrorMessage>
                      {formik.errors.psaccuni}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Flex>
              <Flex flexDir={"row"}>
                <FormControl
                  id="psaccaci"
                  isInvalid={
                    Boolean(formik.errors.psaccaci) &&
                    Boolean(formik.touched.psaccaci)
                  }
                  isReadOnly={true}
                  //w={"50%"}
                  pr={1}
                >
                  <FormLabel>Accrual Interest</FormLabel>
                  {/* <CustomFormLabel labelText="Accrual Interest" /> */}
                  <NumberInput
                    name="psaccaci"
                    min={0}
                    precision={4}
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "psaccaci" },
                      })
                    }
                    onBlur={formik.handleBlur}
                    value={formik.values.psaccaci}
                  >
                    <NumberInputField textAlign={"right"} pr={4} />
                    {/* <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper> */}
                  </NumberInput>
                  {formik.errors.psaccaci && (
                    <FormErrorMessage>
                      {formik.errors.psaccaci}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psaccppa"
                  isInvalid={
                    Boolean(formik.errors.psaccppa) &&
                    Boolean(formik.touched.psaccppa)
                  }
                  isReadOnly={mode == "VIEW" ? true : false}
                >
                  <CustomFormLabel labelText="Prepaid Amount" />
                  <NumberInput
                    name="psaccppa"
                    min={0}
                    precision={2}
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "psaccppa" },
                      })
                    }
                    onBlur={formik.handleBlur}
                    value={formik.values.psaccppa}
                  >
                    <NumberInputField textAlign={"right"} pr={4} />
                    {/* <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper> */}
                  </NumberInput>
                  {formik.errors.psaccppa && (
                    <FormErrorMessage>
                      {formik.errors.psaccppa}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Flex>
              <Flex flexDir={"row"}>
                <FormControl
                  id="psaccsmd"
                  isInvalid={
                    Boolean(formik.errors.psaccsmd) &&
                    Boolean(formik.touched.psaccsmd)
                  }
                  isReadOnly={mode == "VIEW" ? true : false}
                  //w={"50%"}
                  pr={1}
                >
                  <CustomFormLabel labelText="Stamp Duty Fee" />
                  <NumberInput
                    name="psaccsmd"
                    min={0}
                    precision={2}
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "psaccsmd" },
                      })
                    }
                    onBlur={formik.handleBlur}
                    value={formik.values.psaccsmd}
                  >
                    <NumberInputField textAlign={"right"} pr={4} />
                    {/* <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper> */}
                  </NumberInput>
                  {formik.errors.psaccsmd && (
                    <FormErrorMessage>
                      {formik.errors.psaccsmd}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psaccpfe"
                  isInvalid={
                    Boolean(formik.errors.psaccpfe) &&
                    Boolean(formik.touched.psaccpfe)
                  }
                  isReadOnly={mode == "VIEW" ? true : false}
                >
                  <CustomFormLabel labelText="Processing Fee" />
                  <NumberInput
                    name="psaccpfe"
                    min={0}
                    precision={2}
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "psaccpfe" },
                      })
                    }
                    onBlur={formik.handleBlur}
                    value={formik.values.psaccpfe}
                  >
                    <NumberInputField textAlign={"right"} pr={4} />
                    {/* <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper> */}
                  </NumberInput>
                  {formik.errors.psaccpfe && (
                    <FormErrorMessage>
                      {formik.errors.psaccpfe}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Flex>
            </Box>
          </div>
        </Card>
      </Flex>
      <Flex
        flexDir={{
          base: "column",
          lg: "row",
        }}
        gap={Spacing.gap}
        mt={Spacing.gap}
      >
        <Card className="grid grid-cols-1 gap-6" borderRadius={0}>
          <div className="flex flex-col sm:flex-column gap-3">
            <Text fontSize={"19pt"} fontWeight={"medium"}>
              Tenure and Payment Due Date
            </Text>
            <Box display="flex" flexDir="column" gap={4}>
              <Flex flexDir={"row"} w={"100%"}>
                <FormControl
                  id="psaccdbd"
                  isInvalid={
                    Boolean(formik.errors.psaccdbd) &&
                    Boolean(formik.touched.psaccdbd)
                  }
                  w={"200px"}
                  pr={1}
                >
                  <FormLabel>Disbursement Date</FormLabel>
                  {/* <CustomFormLabel labelText="Disbursement Date" /> */}
                  <DatePicker
                    id="psaccdbd"
                    name="psaccdbd"
                    style={{ width: "100%" }}
                    format={"DD/MM/YYYY"}
                    value={
                      formik.values.psaccdbd
                        ? dayjs(formik.values.psaccdbd)
                        : null
                    }
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "psaccdbd" },
                      })
                    }
                    inputReadOnly={true}
                    open={false}
                    allowClear={false}
                  />
                  {formik.errors.psaccdbd && (
                    <FormErrorMessage>
                      {formik.errors.psaccdbd}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psaccodt"
                  isInvalid={
                    Boolean(formik.errors.psaccodt) &&
                    Boolean(formik.touched.psaccodt)
                  }
                  w={"200px"}
                >
                  <FormLabel>Loan Start Date</FormLabel>
                  {/* <CustomFormLabel labelText="Loan Start Date" /> */}
                  <DatePicker
                    id="psaccodt"
                    name="psaccodt"
                    style={{ width: "100%" }}
                    format={"DD/MM/YYYY"}
                    value={
                      formik.values.psaccodt
                        ? dayjs(formik.values.psaccodt)
                        : null
                    }
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "psaccodt" },
                      })
                    }
                    inputReadOnly={true}
                    open={false}
                    allowClear={false}
                  />
                  {formik.errors.psaccodt && (
                    <FormErrorMessage>
                      {formik.errors.psaccodt}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Flex>
              <Flex flexDir={"row"} w={"100%"}>
                <FormControl
                  id="psaccfpd"
                  isInvalid={
                    Boolean(formik.errors.psaccfpd) &&
                    Boolean(formik.touched.psaccfpd)
                  }
                  w={"200px"}
                  pr={1}
                >
                  <FormLabel>1st Payment Due Date</FormLabel>
                  {/* <CustomFormLabel labelText="1st Payment Due Date" /> */}
                  <DatePicker
                    id="psaccfpd"
                    name="psaccfpd"
                    style={{ width: "100%" }}
                    format={"DD/MM/YYYY"}
                    value={
                      formik.values.psaccfpd
                        ? dayjs(formik.values.psaccfpd)
                        : dayjs()
                    }
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "psaccfpd" },
                      })
                    }
                    inputReadOnly={mode == "VIEW" ? true : false}
                    open={mode == "VIEW" ? false : undefined}
                    allowClear={mode == "VIEW" ? false : true}
                  />
                  {formik.errors.psaccfpd && (
                    <FormErrorMessage>
                      {formik.errors.psaccfpd}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psacctmv"
                  isInvalid={
                    Boolean(formik.errors.psacctmv) &&
                    Boolean(formik.touched.psacctmv)
                  }
                  isReadOnly={true}
                  w={"200px"}
                  //pr={1}
                >
                  <FormLabel>Tenure</FormLabel>
                  {/* <CustomFormLabel labelText="Tenure" /> */}
                  <NumberInput
                    name="psacctmv"
                    min={0}
                    precision={0}
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "psacctmv" },
                      })
                    }
                    onBlur={formik.handleBlur}
                    value={formik.values.psacctmv}
                  >
                    <NumberInputField textAlign={"right"} pr={4} />
                    {/* <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper> */}
                  </NumberInput>
                  {formik.errors.psacctmv && (
                    <FormErrorMessage>
                      {formik.errors.psacctmv}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psacctmt"
                  isInvalid={
                    Boolean(formik.errors.psacctmt) &&
                    Boolean(formik.touched.psacctmt)
                  }
                  w={"170px"}
                  alignSelf={"center"}
                  isReadOnly={true}
                >
                  <RadioGroup
                    name="psacctmt"
                    value={formik.values.psacctmt}
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "psacctmt" },
                      })
                    }
                    pt={6}
                    pl={2}
                  >
                    <Stack gap={3} direction="row">
                      <Radio value="M">Months</Radio>
                      <Radio value="D">Days</Radio>
                    </Stack>
                  </RadioGroup>
                  {formik.errors.psacctmt && (
                    <FormErrorMessage>
                      {formik.errors.psacctmt}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Flex>
              <Flex flexDir={"row"} w={"100%"}>
                <FormControl
                  id="psaccmtd"
                  isInvalid={
                    Boolean(formik.errors.psaccmtd) &&
                    Boolean(formik.touched.psaccmtd)
                  }
                  w={"200px"}
                  pr={1}
                >
                  <FormLabel>Maturity Date</FormLabel>
                  {/* <CustomFormLabel labelText="Maturity Date" /> */}
                  <DatePicker
                    id="psaccmtd"
                    name="psaccmtd"
                    style={{ width: "100%" }}
                    format={"DD/MM/YYYY"}
                    value={
                      formik.values.psaccmtd
                        ? dayjs(formik.values.psaccmtd)
                        : dayjs()
                    }
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "psaccmtd" },
                      })
                    }
                    inputReadOnly={true}
                    open={false}
                    allowClear={false}
                  />
                  {formik.errors.psaccmtd && (
                    <FormErrorMessage>
                      {formik.errors.psaccmtd}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="remaining_tenure"
                  isInvalid={
                    Boolean(formik.errors.remaining_tenure) &&
                    Boolean(formik.touched.remaining_tenure)
                  }
                  isReadOnly={true}
                  w={"200px"}
                >
                  <FormLabel>Remaining Tenure</FormLabel>
                  {/* <CustomFormLabel labelText="Remaining Tenure" /> */}
                  <NumberInput
                    name="remaining_tenure"
                    min={0}
                    precision={0}
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "remaining_tenure" },
                      })
                    }
                    onBlur={formik.handleBlur}
                    value={formik.values.remaining_tenure}
                  >
                    <NumberInputField textAlign={"right"} pr={4} />
                    {/* <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper> */}
                  </NumberInput>
                  {formik.errors.remaining_tenure && (
                    <FormErrorMessage>
                      {formik.errors.remaining_tenure}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="remaining_tenure_code"
                  isInvalid={
                    Boolean(formik.errors.remaining_tenure_code) &&
                    Boolean(formik.touched.remaining_tenure_code)
                  }
                  w={"170px"}
                  alignSelf={"center"}
                  isReadOnly
                >
                  <RadioGroup
                    name="remaining_tenure_code"
                    value={formik.values.remaining_tenure_code}
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "remaining_tenure_code" },
                      })
                    }
                    pt={6}
                    pl={2}
                  >
                    <Stack gap={3} direction="row">
                      <Radio value="M">Months</Radio>
                      <Radio value="D">Days</Radio>
                    </Stack>
                  </RadioGroup>
                  {formik.errors.remaining_tenure_code && (
                    <FormErrorMessage>
                      {formik.errors.remaining_tenure_code}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Flex>
              <Flex flexDir={"row"} w={"100%"}>
                <FormControl
                  id="psaccnsp"
                  isInvalid={
                    Boolean(formik.errors.psaccnsp) &&
                    Boolean(formik.touched.psaccnsp)
                  }
                  w={"200px"}
                  pr={1}
                >
                  <FormLabel>Next Sch. Pay. Due Date</FormLabel>
                  {/* <CustomFormLabel labelText="Next Sch. Pay. Due Date" /> */}
                  <DatePicker
                    id="psaccnsp"
                    name="psaccnsp"
                    style={{ width: "100%" }}
                    format={"DD/MM/YYYY"}
                    value={
                      formik.values.psaccnsp
                        ? dayjs(formik.values.psaccnsp)
                        : dayjs()
                    }
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "psaccnsp" },
                      })
                    }
                    inputReadOnly={true}
                    open={false}
                    allowClear={false}
                  />
                  {formik.errors.psaccnsp && (
                    <FormErrorMessage>
                      {formik.errors.psaccnsp}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psaccpfq"
                  isInvalid={
                    Boolean(formik.errors.psaccpfq) &&
                    Boolean(formik.touched.psaccpfq)
                  }
                  isReadOnly={true}
                  w={"200px"}
                >
                  <FormLabel>Payment Frequency</FormLabel>
                  {/* <CustomFormLabel labelText="Payment Frequency" /> */}
                  <NumberInput
                    name="psaccpfq"
                    min={0}
                    precision={0}
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "psaccpfq" },
                      })
                    }
                    onBlur={formik.handleBlur}
                    value={formik.values.psaccpfq}
                  >
                    <NumberInputField textAlign={"right"} pr={4} />
                    {/* <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper> */}
                  </NumberInput>
                  {formik.errors.psaccpfq && (
                    <FormErrorMessage>
                      {formik.errors.psaccpfq}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psaccpfc"
                  isInvalid={
                    Boolean(formik.errors.psaccpfc) &&
                    Boolean(formik.touched.psaccpfc)
                  }
                  w={"170px"}
                  alignSelf={"center"}
                  isReadOnly={true}
                >
                  <RadioGroup
                    name="psaccpfc"
                    value={formik.values.psaccpfc}
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "psaccpfc" },
                      })
                    }
                    pt={6}
                    pl={2}
                  >
                    <Stack gap={3} direction="row">
                      <Radio value="M">Months</Radio>
                      <Radio value="D">Days</Radio>
                    </Stack>
                  </RadioGroup>
                  {formik.errors.psaccpfc && (
                    <FormErrorMessage>
                      {formik.errors.psaccpfc}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Flex>
              <Flex flexDir={"row"} w={"100%"}>
                <FormControl
                  id="psaccnpd"
                  isInvalid={
                    Boolean(formik.errors.psaccnpd) &&
                    Boolean(formik.touched.psaccnpd)
                  }
                  w={"200px"}
                  pr={1}
                >
                  <FormLabel>Next Payment Due Date</FormLabel>
                  {/* <CustomFormLabel labelText="Next Payment Due Date" /> */}
                  <DatePicker
                    id="psaccnpd"
                    name="psaccnpd"
                    style={{ width: "100%" }}
                    format={"DD/MM/YYYY"}
                    value={
                      formik.values.psaccnpd
                        ? dayjs(formik.values.psaccnpd)
                        : dayjs()
                    }
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "psaccnpd" },
                      })
                    }
                    inputReadOnly={true}
                    open={false}
                    allowClear={false}
                  />
                  {formik.errors.psaccnpd && (
                    <FormErrorMessage>
                      {formik.errors.psaccnpd}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psaccddy"
                  isInvalid={
                    Boolean(formik.errors.psaccddy) &&
                    Boolean(formik.touched.psaccddy)
                  }
                  isReadOnly={true}
                  w={"200px"}
                >
                  <FormLabel>Due Day</FormLabel>
                  {/* <CustomFormLabel labelText="Due Day" /> */}
                  <NumberInput
                    name="psaccddy"
                    min={0}
                    precision={0}
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "psaccddy" },
                      })
                    }
                    onBlur={formik.handleBlur}
                    value={formik.values.psaccddy || 0}
                  >
                    <NumberInputField textAlign={"right"} pr={4} />
                    {/* <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper> */}
                  </NumberInput>
                  {formik.errors.psaccddy && (
                    <FormErrorMessage>
                      {formik.errors.psaccddy}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Flex>
              <Flex flexDir={"row"} w={"100%"}>
                <FormControl
                  id="psaccpmc"
                  isInvalid={
                    Boolean(formik.errors.psaccpmc) &&
                    Boolean(formik.touched.psaccpmc)
                  }
                  w={"200px"}
                  pr={1}
                >
                  <FormLabel>Payment Code</FormLabel>
                  {/* <CustomFormLabel labelText="Payment Code" /> */}
                  <Select
                    placeholder="Select Payment Code"
                    value={formik.values.psaccpmc || ""}
                    onChange={formik.handleChange}
                    style={{
                      fontSize: 14,
                    }}
                    isDisabled={true}
                  >
                    {ddlData?.PRDPAYCD?.filter(
                      (item: DDL_TYPES) => item.prgecode != "BULLETPAYM"
                    ).map(
                      (
                        option: DDL_TYPES //change code
                      ) => (
                        <option key={option.prgecode} value={option.prgecode}>
                          {option.prgedesc}
                        </option>
                      )
                    )}
                  </Select>
                  {formik.errors.psaccpmc && (
                    <FormErrorMessage>
                      {formik.errors.psaccpmc}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psaccina"
                  isInvalid={
                    Boolean(formik.errors.psaccina) &&
                    Boolean(formik.touched.psaccina)
                  }
                  isReadOnly={mode == "VIEW" ? true : false}
                  w={"200px"}
                  pr={1}
                >
                  <CustomFormLabel labelText="Payment Amount" />
                  <NumberInput
                    name="psaccina"
                    min={0}
                    precision={2}
                    onChange={(value) => {
                      let removeThousand = parseThousandsToNumber(value);
                      formik.handleChange({
                        target: { value: removeThousand, name: "psaccina" },
                      });
                    }}
                    value={numberWithCommas(formik.values.psaccina)}
                    onBlur={formik.handleBlur}
                  >
                    <NumberInputField textAlign={"right"} pr={4} />
                    {/* <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper> */}
                  </NumberInput>
                  {formik.errors.psaccina && (
                    <FormErrorMessage>
                      {formik.errors.psaccina}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psaccfia"
                  isInvalid={
                    Boolean(formik.errors.psaccfia) &&
                    Boolean(formik.touched.psaccfia)
                  }
                  isReadOnly={mode == "VIEW" ? true : false}
                  w={"180px"}
                >
                  <CustomFormLabel labelText="Final Payment Amt" />
                  <NumberInput
                    name="psaccfia"
                    min={0}
                    precision={2}
                    onChange={(value) => {
                      let removeThousand = parseThousandsToNumber(value);
                      formik.handleChange({
                        target: { value: removeThousand, name: "psaccfia" },
                      });
                    }}
                    value={numberWithCommas(formik.values.psaccfia)}
                    onBlur={formik.handleBlur}
                  >
                    <NumberInputField textAlign={"right"} pr={4} />
                  </NumberInput>
                  {formik.errors.psaccfia && (
                    <FormErrorMessage>
                      {formik.errors.psaccfia}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Flex>
              {mode == "EDIT" && (
                <Flex w={"100%"} justifyContent={"flex-end"}>
                  <Buttons
                    variant={"primary"}
                    buttonText={"Calc"}
                    buttonSize={"sm"}
                    buttonDefaultType="CUSTOM"
                    buttonType="submit"
                    buttonFontWeight={"normal"}
                    buttonBorderRadius={3}
                    buttonHoverBackgroundColor={Colors.SUCCESS3}
                    buttonBgColor={Colors.SUCCESS}
                    buttonLoading={loading}
                    onClick={() => pre_calculate_loan_info()}
                  />
                </Flex>
              )}
            </Box>
          </div>
        </Card>
        <Card className="grid grid-cols-1 gap-6" borderRadius={0}>
          <div
            className="flex flex-col sm:flex-column gap-3"
            style={{ height: "100%" }}
          >
            <Text fontSize={"19pt"} fontWeight={"medium"}>
              Delinquency
            </Text>
            <Box display="flex" flexDir="column" gap={4}>
              <Flex flexDir={"row"} w={"100%"}>
                <FormControl
                  id="psaccnsd"
                  isInvalid={
                    Boolean(formik.errors.psaccnsd) &&
                    Boolean(formik.touched.psaccnsd)
                  }
                  pr={5}
                >
                  <FormLabel>NPL Date</FormLabel>
                  <DatePicker
                    id="psaccnsd"
                    name="psaccnsd"
                    style={{ width: "100%" }}
                    format={"DD/MM/YYYY"}
                    // disabledDate={(currentDate) =>
                    //   currentDate < dayjs().startOf("day")
                    // }
                    value={
                      formik.values.psaccnsd
                        ? dayjs(formik.values.psaccnsd)
                        : null
                    }
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "psaccnsd" },
                      })
                    }
                    inputReadOnly={true}
                    open={false}
                    allowClear={false}
                  />
                  {formik.errors.psaccnsd && (
                    <FormErrorMessage>
                      {formik.errors.psaccnsd}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psaccnpl"
                  w={"49%"}
                  isInvalid={
                    Boolean(formik.errors.psaccnpl) &&
                    Boolean(formik.touched.psaccnpl)
                  }
                  isReadOnly={mode == "VIEW" ? true : false}
                >
                  <FormLabel>NPL Status</FormLabel>
                  <Switch
                    id="psaccnpl"
                    name="psaccnpl"
                    isChecked={formik.values.psaccnpl}
                    onChange={handleNPLStatusChange}
                    onBlur={formik.handleBlur}
                    size="lg"
                    colorScheme={"green"}
                    sx={{
                      "span.chakra-switch__track:not([data-checked])": {
                        backgroundColor: Colors.DANGER,
                      },
                    }}
                    mt={1}
                  />
                  {formik.errors.psaccnpl && (
                    <FormErrorMessage>
                      {formik.errors.psaccnpl}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Flex>
              <Flex flexDir={"row"} w={"100%"}>
                <Grid
                  templateRows={"1fr 1fr 1fr 1fr 1fr 1fr"}
                  templateColumns={"1fr 1fr 1fr 1fr"}
                  gap={2}
                >
                  <GridItem></GridItem>
                  <GridItem
                    textAlign={"right"}
                    alignContent={"end"}
                    textDecor={"underline"}
                    fontSize={"sm"}
                  >
                    Overdue Amount
                  </GridItem>
                  <GridItem
                    textAlign={"right"}
                    alignContent={"end"}
                    textDecor={"underline"}
                    fontSize={"sm"}
                  >
                    Months
                  </GridItem>
                  <GridItem
                    textAlign={"right"}
                    alignContent={"end"}
                    textDecor={"underline"}
                    fontSize={"sm"}
                  >
                    Days
                  </GridItem>

                  {/* Installment */}
                  <GridItem fontWeight={"medium"}>Installment</GridItem>
                  <GridItem>
                    <FormControl
                      id="installment_overdue_amt"
                      isInvalid={
                        Boolean(formik.errors.installment_overdue_amt) &&
                        Boolean(formik.touched.installment_overdue_amt)
                      }
                      isReadOnly={mode == "VIEW" ? true : false}
                      pr={1}
                    >
                      {/* <CustomFormLabel labelText="Installment Overdue Amount" /> */}
                      <NumberInput
                        name="installment_overdue_amt"
                        min={0}
                        precision={2}
                        onChange={(value) =>
                          formik.handleChange({
                            target: { value, name: "installment_overdue_amt" },
                          })
                        }
                        onBlur={formik.handleBlur}
                        value={formik.values.installment_overdue_amt}
                      >
                        <NumberInputField textAlign={"right"} pr={4} />
                        {/* <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper> */}
                      </NumberInput>
                      {formik.errors.installment_overdue_amt && (
                        <FormErrorMessage>
                          {formik.errors.installment_overdue_amt}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl
                      id="installment_overdue_mth"
                      isInvalid={
                        Boolean(formik.errors.installment_overdue_mth) &&
                        Boolean(formik.touched.installment_overdue_mth)
                      }
                      isReadOnly={mode == "VIEW" ? true : false}
                      pr={1}
                    >
                      {/* <CustomFormLabel labelText="Installment Overdue Month" /> */}
                      <NumberInput
                        name="installment_overdue_mth"
                        min={0}
                        precision={0}
                        onChange={(value) =>
                          formik.handleChange({
                            target: { value, name: "installment_overdue_mth" },
                          })
                        }
                        onBlur={formik.handleBlur}
                        value={formik.values.installment_overdue_mth}
                      >
                        <NumberInputField textAlign={"right"} pr={4} />
                        {/* <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper> */}
                      </NumberInput>
                      {formik.errors.installment_overdue_mth && (
                        <FormErrorMessage>
                          {formik.errors.installment_overdue_mth}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl
                      id="installment_overdue_day"
                      isInvalid={
                        Boolean(formik.errors.installment_overdue_day) &&
                        Boolean(formik.touched.installment_overdue_day)
                      }
                      isReadOnly={mode == "VIEW" ? true : false}
                    >
                      {/* <CustomFormLabel labelText="Installment Overdue Day" /> */}
                      <NumberInput
                        name="installment_overdue_day"
                        min={0}
                        precision={0}
                        onChange={(value) =>
                          formik.handleChange({
                            target: { value, name: "installment_overdue_day" },
                          })
                        }
                        onBlur={formik.handleBlur}
                        value={formik.values.installment_overdue_day}
                      >
                        <NumberInputField textAlign={"right"} pr={4} />
                        {/* <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper> */}
                      </NumberInput>
                      {formik.errors.installment_overdue_day && (
                        <FormErrorMessage>
                          {formik.errors.installment_overdue_day}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>

                  {/* Principal */}
                  <GridItem fontWeight={"medium"}>Principal</GridItem>
                  <GridItem>
                    <FormControl
                      id="principal_overdue_amt"
                      isInvalid={
                        Boolean(formik.errors.principal_overdue_amt) &&
                        Boolean(formik.touched.principal_overdue_amt)
                      }
                      isReadOnly={mode == "VIEW" ? true : false}
                      pr={1}
                    >
                      <NumberInput
                        name="principal_overdue_amt"
                        min={0}
                        precision={2}
                        onChange={(value) =>
                          formik.handleChange({
                            target: { value, name: "principal_overdue_amt" },
                          })
                        }
                        onBlur={formik.handleBlur}
                        value={formik.values.principal_overdue_amt}
                      >
                        <NumberInputField textAlign={"right"} pr={4} />
                        {/* <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper> */}
                      </NumberInput>
                      {formik.errors.principal_overdue_amt && (
                        <FormErrorMessage>
                          {formik.errors.principal_overdue_amt}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl
                      id="principal_overdue_mth"
                      isInvalid={
                        Boolean(formik.errors.principal_overdue_mth) &&
                        Boolean(formik.touched.principal_overdue_mth)
                      }
                      isReadOnly={mode == "VIEW" ? true : false}
                      pr={1}
                    >
                      <NumberInput
                        name="principal_overdue_mth"
                        min={0}
                        precision={0}
                        onChange={(value) =>
                          formik.handleChange({
                            target: { value, name: "principal_overdue_mth" },
                          })
                        }
                        onBlur={formik.handleBlur}
                        value={formik.values.principal_overdue_mth}
                      >
                        <NumberInputField textAlign={"right"} pr={4} />
                        {/* <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper> */}
                      </NumberInput>
                      {formik.errors.principal_overdue_mth && (
                        <FormErrorMessage>
                          {formik.errors.principal_overdue_mth}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl
                      id="principal_overdue_day"
                      isInvalid={
                        Boolean(formik.errors.principal_overdue_day) &&
                        Boolean(formik.touched.principal_overdue_day)
                      }
                      isReadOnly={mode == "VIEW" ? true : false}
                    >
                      <NumberInput
                        name="principal_overdue_day"
                        min={0}
                        precision={0}
                        onChange={(value) =>
                          formik.handleChange({
                            target: { value, name: "principal_overdue_day" },
                          })
                        }
                        onBlur={formik.handleBlur}
                        value={formik.values.principal_overdue_day}
                      >
                        <NumberInputField textAlign={"right"} pr={4} />
                        {/* <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper> */}
                      </NumberInput>
                      {formik.errors.principal_overdue_day && (
                        <FormErrorMessage>
                          {formik.errors.principal_overdue_day}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>

                  {/* Interest */}
                  <GridItem fontWeight={"medium"}>Interest</GridItem>
                  <GridItem>
                    <FormControl
                      id="interest_overdue_amt"
                      isInvalid={
                        Boolean(formik.errors.interest_overdue_amt) &&
                        Boolean(formik.touched.interest_overdue_amt)
                      }
                      isReadOnly={mode == "VIEW" ? true : false}
                      pr={1}
                    >
                      <NumberInput
                        name="interest_overdue_amt"
                        min={0}
                        precision={2}
                        onChange={(value) =>
                          formik.handleChange({
                            target: { value, name: "interest_overdue_amt" },
                          })
                        }
                        onBlur={formik.handleBlur}
                        value={formik.values.interest_overdue_amt}
                      >
                        <NumberInputField textAlign={"right"} pr={4} />
                        {/* <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper> */}
                      </NumberInput>
                      {formik.errors.interest_overdue_amt && (
                        <FormErrorMessage>
                          {formik.errors.interest_overdue_amt}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl
                      id="interest_overdue_mth"
                      isInvalid={
                        Boolean(formik.errors.interest_overdue_mth) &&
                        Boolean(formik.touched.interest_overdue_mth)
                      }
                      isReadOnly={mode == "VIEW" ? true : false}
                      pr={1}
                    >
                      <NumberInput
                        name="interest_overdue_mth"
                        min={0}
                        precision={0}
                        onChange={(value) =>
                          formik.handleChange({
                            target: { value, name: "interest_overdue_mth" },
                          })
                        }
                        onBlur={formik.handleBlur}
                        value={formik.values.interest_overdue_mth}
                      >
                        <NumberInputField textAlign={"right"} pr={4} />
                        {/* <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper> */}
                      </NumberInput>
                      {formik.errors.interest_overdue_mth && (
                        <FormErrorMessage>
                          {formik.errors.interest_overdue_mth}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl
                      id="interest_overdue_day"
                      isInvalid={
                        Boolean(formik.errors.interest_overdue_day) &&
                        Boolean(formik.touched.interest_overdue_day)
                      }
                      isReadOnly={mode == "VIEW" ? true : false}
                    >
                      <NumberInput
                        name="interest_overdue_day"
                        min={0}
                        precision={0}
                        onChange={(value) =>
                          formik.handleChange({
                            target: { value, name: "interest_overdue_day" },
                          })
                        }
                        onBlur={formik.handleBlur}
                        value={formik.values.interest_overdue_day}
                      >
                        <NumberInputField textAlign={"right"} pr={4} />
                        {/* <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper> */}
                      </NumberInput>
                      {formik.errors.interest_overdue_day && (
                        <FormErrorMessage>
                          {formik.errors.interest_overdue_day}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>

                  {/* Fee Charges */}
                  <GridItem fontWeight={"medium"}>Fee Charges</GridItem>
                  <GridItem>
                    <FormControl
                      id="fee_overdue_amt"
                      isInvalid={
                        Boolean(formik.errors.fee_overdue_amt) &&
                        Boolean(formik.touched.fee_overdue_amt)
                      }
                      isReadOnly={mode == "VIEW" ? true : false}
                      pr={1}
                    >
                      <NumberInput
                        name="fee_overdue_amt"
                        min={0}
                        precision={2}
                        onChange={(value) =>
                          formik.handleChange({
                            target: { value, name: "fee_overdue_amt" },
                          })
                        }
                        onBlur={formik.handleBlur}
                        value={formik.values.fee_overdue_amt}
                      >
                        <NumberInputField textAlign={"right"} pr={4} />
                        {/* <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper> */}
                      </NumberInput>
                      {formik.errors.fee_overdue_amt && (
                        <FormErrorMessage>
                          {formik.errors.fee_overdue_amt}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl
                      id="fee_overdue_mth"
                      isInvalid={
                        Boolean(formik.errors.fee_overdue_mth) &&
                        Boolean(formik.touched.fee_overdue_mth)
                      }
                      isReadOnly={mode == "VIEW" ? true : false}
                      pr={1}
                    >
                      <NumberInput
                        name="fee_overdue_mth"
                        min={0}
                        precision={0}
                        onChange={(value) =>
                          formik.handleChange({
                            target: { value, name: "fee_overdue_mth" },
                          })
                        }
                        onBlur={formik.handleBlur}
                        value={formik.values.fee_overdue_mth}
                      >
                        <NumberInputField textAlign={"right"} pr={4} />
                        {/* <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper> */}
                      </NumberInput>
                      {formik.errors.fee_overdue_mth && (
                        <FormErrorMessage>
                          {formik.errors.fee_overdue_mth}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl
                      id="fee_overdue_day"
                      isInvalid={
                        Boolean(formik.errors.fee_overdue_day) &&
                        Boolean(formik.touched.fee_overdue_day)
                      }
                      isReadOnly={mode == "VIEW" ? true : false}
                    >
                      <NumberInput
                        name="fee_overdue_day"
                        min={0}
                        precision={0}
                        onChange={(value) =>
                          formik.handleChange({
                            target: { value, name: "fee_overdue_day" },
                          })
                        }
                        onBlur={formik.handleBlur}
                        value={formik.values.fee_overdue_day}
                      >
                        <NumberInputField textAlign={"right"} pr={4} />
                        {/* <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper> */}
                      </NumberInput>
                      {formik.errors.fee_overdue_day && (
                        <FormErrorMessage>
                          {formik.errors.fee_overdue_day}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>

                  {/* Total Overdue */}
                  <GridItem fontWeight={"medium"}>Total Overdue</GridItem>
                  <GridItem>
                    <FormControl
                      id="total_overdue_amt"
                      isInvalid={
                        Boolean(formik.errors.total_overdue_amt) &&
                        Boolean(formik.touched.total_overdue_amt)
                      }
                      isReadOnly={mode == "VIEW" ? true : false}
                      pr={1}
                    >
                      <NumberInput
                        name="total_overdue_amt"
                        min={0}
                        precision={2}
                        onChange={(value) =>
                          formik.handleChange({
                            target: { value, name: "total_overdue_amt" },
                          })
                        }
                        onBlur={formik.handleBlur}
                        value={formik.values.total_overdue_amt}
                      >
                        <NumberInputField textAlign={"right"} pr={4} />
                        {/* <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper> */}
                      </NumberInput>
                      {formik.errors.total_overdue_amt && (
                        <FormErrorMessage>
                          {formik.errors.total_overdue_amt}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl
                      id="total_overdue_mth"
                      isInvalid={
                        Boolean(formik.errors.total_overdue_mth) &&
                        Boolean(formik.touched.total_overdue_mth)
                      }
                      isReadOnly={mode == "VIEW" ? true : false}
                      pr={1}
                    >
                      <NumberInput
                        name="total_overdue_mth"
                        min={0}
                        precision={0}
                        onChange={(value) =>
                          formik.handleChange({
                            target: { value, name: "total_overdue_mth" },
                          })
                        }
                        onBlur={formik.handleBlur}
                        value={formik.values.total_overdue_mth}
                      >
                        <NumberInputField textAlign={"right"} pr={4} />
                        {/* <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper> */}
                      </NumberInput>
                      {formik.errors.total_overdue_mth && (
                        <FormErrorMessage>
                          {formik.errors.total_overdue_mth}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl
                      id="total_overdue_day"
                      isInvalid={
                        Boolean(formik.errors.total_overdue_day) &&
                        Boolean(formik.touched.total_overdue_day)
                      }
                      isReadOnly={mode == "VIEW" ? true : false}
                    >
                      <NumberInput
                        name="total_overdue_day"
                        min={0}
                        precision={0}
                        onChange={(value) =>
                          formik.handleChange({
                            target: { value, name: "total_overdue_day" },
                          })
                        }
                        onBlur={formik.handleBlur}
                        value={formik.values.total_overdue_day}
                      >
                        <NumberInputField textAlign={"right"} pr={4} />
                        {/* <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper> */}
                      </NumberInput>
                      {formik.errors.total_overdue_day && (
                        <FormErrorMessage>
                          {formik.errors.total_overdue_day}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>
                </Grid>
              </Flex>
            </Box>
          </div>
        </Card>
      </Flex>
      <Flex
        flexDir={{
          base: "column",
          lg: "row",
        }}
        gap={Spacing.gap}
        mt={Spacing.gap}
      >
        <Card className="grid grid-cols-1 gap-6" borderRadius={0}>
          <div className="flex flex-col sm:flex-column gap-3">
            <Text fontSize={"19pt"} fontWeight={"medium"}>
              Future Payment Amount
            </Text>
            <Box display="flex" flexDir="column" gap={6}></Box>
          </div>
        </Card>
        <Card className="grid grid-cols-1 gap-6" borderRadius={0}>
          <div
            className="flex flex-col sm:flex-column gap-3"
            style={{ height: "100%" }}
          >
            <Text fontSize={"19pt"} fontWeight={"medium"}>
              Shared List
            </Text>
            <Box display="flex" flexDir="column">
              {/* <SharedListListing
                mode={mode}
                id={formik.values.psaplcrf}
                type={"ACC"}
              /> */}
            </Box>
          </div>
        </Card>
      </Flex>
    </Flex>
  );
}

interface AccountDetailProps {
  formik: any;
  mode: string;
}
