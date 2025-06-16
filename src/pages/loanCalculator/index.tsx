// Chakra imports
import Colors from "@app/constants/Colors";
import {
  Box,
  Flex,
  Text,
  Tabs,
  TabList,
  Tab,
} from "@chakra-ui/react";
// assets
import React, { ChangeEventHandler, useEffect, useState } from "react";
import { DatePicker, Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import {
  closeGlobalModal,
  openGlobalModal,
  refreshTable,
  selectHome,
} from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Buttons from "@app/components/common/Buttons/Buttons";
import { useFormik } from "formik";
import CalculatorForm from "@app/components/forms/calculator/CalculatorForm";
import RepaymentScheduleForm from "@app/components/forms/calculator/RepaymentScheduleForm";
import useFetchLoanCalculator from "@app/hooks/selector/useFetchLoanCalculator";
import { calculate } from "@app/redux/loanCalculator/slice";
import { LoanCalculatorSchema } from "@app/components/forms/@schemas/loanCalculatorSchema";
import dayjs from "dayjs";

export default function LoanCalculatorPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const homeData = useAppSelector(selectHome);
  const { sendRequest, loading } = useApi({ title: "Loan Calculator" });

  const [tabIndex, setTabIndex] = useState(0);

  const [detailData] = useFetchLoanCalculator();

  const initialValues = {
    ratetyp: "FLTRT",
    loanamt: "",
    tenure: "1",
    tenuretyp: "M",
    startdate: dayjs().format('YYYY-MM-DD'),
    maturitydate: "",
    paymentfreq: "1",
    paymentfreqtyp: "M",
    rate: "",
    eirate: "",
    custominstallment: "",
    roundingtyp: "HC",
    daybasis: "D365",
    accrualTyp: "001",
    paymentTyp: "FIXINSTALM",

    //Chart Info
    chart_info: {},

    //Repayment Schedule Info
    repayment_schedule: {},
    repayment_schedule_header: {},
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: LoanCalculatorSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  async function onSubmit(data: any) {
    const { success } = await sendRequest({
      fn: calculate(data),
      formik,
    });

    if (success) {
      setTimeout(() => {
        showModal(dispatch, {
          title: "Generate Loan Infomation",
          message: "Loan Infomation Generated.",
        });
      }, 200);
    }
  }

  useEffect(() => {
    //Reset Form if detailData is empty object
    if (detailData && Object.keys(detailData).length === 0) formik.resetForm();

    if (detailData && Object.keys(detailData).length > 0) {
      formik.setValues({
        ratetyp: formik.values.ratetyp,
        loanamt: formik.values.loanamt,
        tenure: formik.values.tenure,
        tenuretyp: formik.values.tenuretyp,
        startdate: formik.values.startdate,
        maturitydate: formik.values.maturitydate,
        paymentfreq: formik.values.paymentfreq,
        paymentfreqtyp: formik.values.paymentfreqtyp,
        rate: formik.values.rate,
        eirate: formik.values.eirate,
        custominstallment: detailData?.chartData && detailData?.chartData.monthly_installment != "" ? detailData?.chartData.monthly_installment : formik.values.custominstallment,
        roundingtyp: formik.values.roundingtyp,
        daybasis: formik.values.daybasis,
        accrualTyp: formik.values.accrualTyp,
        paymentTyp: formik.values.paymentTyp,
        chart_info: detailData?.chartData,
        repayment_schedule: detailData?.repayment_schedule,
        repayment_schedule_header: detailData?.repayment_schedule_header,
      });
    }
  }, [detailData]);

  function resetFields() {
    //Reset validation status
    formik.setErrors({});
    formik.setTouched({});

    formik.setFieldValue("ratetyp", "FLTRT");
    formik.setFieldValue("loanamt", "");
    formik.setFieldValue("tenure", "");
    formik.setFieldValue("tenuretyp", "M");
    formik.setFieldValue("startdate", dayjs().format('YYYY-MM-DD'));
    formik.setFieldValue("maturitydate", "");
    formik.setFieldValue("paymentfreq", "");
    formik.setFieldValue("paymentfreqtyp", "M");
    formik.setFieldValue("rate", "");
    formik.setFieldValue("eirate", "");
    formik.setFieldValue("custominstallment", "");
    formik.setFieldValue("roundingtyp", "HC");
    formik.setFieldValue("daybasis", "D365");
    formik.setFieldValue("accrualTyp", "001");
    formik.setFieldValue("paymentTyp", "FIXINSTALM");
    formik.setFieldValue("chart_info", {});
    formik.setFieldValue("repayment_schedule", {});
    formik.setFieldValue("repayment_schedule_header", {});
  }

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box>
          <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
            <Flex direction={"column"} alignSelf={"center"}>
              <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
                Loan Calculator
              </Text>
              <Breadcrumbs
                breadcrumbItems={[
                  {
                    title: "Loan Calculator",
                  },
                ]}
              />
            </Flex>
            {tabIndex !== 1 && (
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
                    variant={"primary"}
                    buttonText={"Calculate"}
                    buttonSize={"sm"}
                    buttonDefaultType="CUSTOM"
                    buttonType="submit"
                    buttonFontWeight={"normal"}
                    buttonBorderRadius={3}
                    buttonHoverBackgroundColor={Colors.SUCCESS3}
                    buttonBgColor={Colors.SUCCESS}
                    buttonLoading={loading}
                    //onClick={() => onOpen()}
                  />
                  <Buttons
                  variant={"outline"}
                  buttonText="Reset"
                  buttonSize={"sm"}
                  buttonDefaultType="CUSTOM"
                  buttonFontWeight={"normal"}
                  borderColor={Colors.PRIMARY}
                  color={Colors.PRIMARY}
                  style={{ alignSelf: "center" }}
                  buttonHoverBackgroundColor={Colors.PRIMARY}
                  buttonHoverColor={Colors.BACKGROUND}
                  onClick={() => resetFields()}
                />
                  {/* <Buttons
              buttonDefaultType={"BACK"}
              onclick={() => router.back()}
            /> */}
                  {/* {mode && mode !== "VIEW" && (
              <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
            )} */}
                </Space>
              </Box>
            )}
          </Flex>

          <Flex mt={4} bgColor="#fff" py={2}>
            <Tabs onChange={(index) => setTabIndex(index)}>
              <Flex
                bgColor="#fff"
                justifyContent={"space-between"}
                alignItems={"flex-end"}
                gap={5}
              >
                <TabList border={0}>
                  <Tab
                    key={`notlang-tab-1`}
                    py={3}
                    whiteSpace={"nowrap"}
                    ml={{
                      base: 0,
                      md: Spacing.containerPx,
                    }}
                    fontWeight={"semibold"}
                  >
                    Calculator
                  </Tab>
                  <Tab
                    key={`notlang-tab-2`}
                    py={3}
                    whiteSpace={"nowrap"}
                    ml={{
                      base: 0,
                      md: Spacing.containerPx,
                    }}
                    fontWeight={"semibold"}
                  >
                    Repayment Schedule
                  </Tab>
                </TabList>
              </Flex>
            </Tabs>
          </Flex>

          {tabIndex === 1 ? (
            <RepaymentScheduleForm formik={formik} />
          ) : (
            <CalculatorForm formik={formik}/>
          )}
        </Box>
        {tabIndex !== 1 && (
          <Flex justifyContent="flex-end" pl={10} pr={10} pt={8}>
            <Box>
              <Space size="small">
                {/* <Buttons
                buttonDefaultType={"BACK"}
                onclick={() => router.back()}
              /> */}
                {/* {mode && mode !== "VIEW" && (
                <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
              )} */}
                <Buttons
                  variant={"primary"}
                  buttonText={"Calculate"}
                  buttonSize={"sm"}
                  buttonDefaultType="CUSTOM"
                  buttonType="submit"
                  buttonFontWeight={"normal"}
                  buttonBorderRadius={3}
                  buttonHoverBackgroundColor={Colors.SUCCESS3}
                  buttonBgColor={Colors.SUCCESS}
                  buttonLoading={loading}
                  //onClick={() => onOpen()}
                />
                <Buttons
                  variant={"outline"}
                  buttonText="Reset"
                  buttonSize={"sm"}
                  buttonDefaultType="CUSTOM"
                  buttonFontWeight={"normal"}
                  borderColor={Colors.PRIMARY}
                  color={Colors.PRIMARY}
                  style={{ alignSelf: "center" }}
                  buttonHoverBackgroundColor={Colors.PRIMARY}
                  buttonHoverColor={Colors.BACKGROUND}
                  onClick={() => resetFields()}
                />
              </Space>
            </Box>
          </Flex>
        )}
      </form>
    </>
  );
}
