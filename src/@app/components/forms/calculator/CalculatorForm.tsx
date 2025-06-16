// Chakra imports
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
  Grid,
  GridItem,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
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
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import {
  numberWithCommas,
  parseThousandsToNumber,
} from "@app/utils/StringUtils";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function CalculatorForm({ formik }: CalculatorProps) {
  const { sendRequest, loading } = useApi({ title: "Calculator" });
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [ddlData] = useFetchDDL({
    code: ["PRDPYRND", "PRDYRBASE", "ACRBALTYP", "PRDPAYCD"],
  });

  const defaultOptions: ApexCharts.ApexOptions = {
    tooltip: { enabled: false },
    chart: {
      type: `donut`,
    },
    legend: {
      offsetY: 5,
      position: "bottom",
    },
    dataLabels: {
      style: {
        colors: ["black"],
        fontWeight: "bold",
        fontSize: "10px",
      },
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: false,
          },
        },
        dataLabels: {
          offset: 2,
        },
        customScale: 1.0,
      },
    },
    labels: ["No record"],
    // responsive: [
    //   {
    //     breakpoint: 480,
    //     options: {
    //       chart: {
    //         width: 200,
    //       },
    //       legend: {
    //         position: "bottom",
    //       },
    //     },
    //   },
    // ],
    colors: ["gray"],
  };

  const loanOptions: ApexCharts.ApexOptions = {
    tooltip: {
      enabled: true,
      y: {
        formatter: function (value) {
          let formatValue = numberWithCommas(value);
          return [formatValue] as unknown as string;
        },
        title: {
          formatter: (seriesName) => seriesName,
        },
      },
    },
    chart: {
      type: `donut`,
    },
    legend: {
      offsetY: 5,
      position: "bottom",
    },
    dataLabels: {
      style: {
        colors: ["black"],
        //fontWeight: "bold",
        fontSize: "10px",
      },
      formatter: function (val, { w, seriesIndex }) {
        let series = w.globals.series[seriesIndex];
        let seriesNames = w.globals.seriesNames[seriesIndex];
        // let percentage = val.toString();
        // percentage = parseFloat(percentage).toFixed(2).toString();
        let formatSeries = numberWithCommas(series.toFixed(2));
        return [formatSeries] as unknown as string;
        //series + "<br/>" +seriesNames + "," +  percentage
      },
      dropShadow: {
        enabled: false,
      },
      enabled: true,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: "Total Payable",
              fontSize: "20px",
              //fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              color: "#373d3f",
              formatter: function (w) {
                let total = w.globals.seriesTotals.reduce((a: any, b: any) => {
                  return parseFloat(a) + parseFloat(b);
                }, 0);
                let formatTotal = numberWithCommas(total.toFixed(2));
                return [formatTotal] as unknown as string;
              },
            },
          },
        },
        dataLabels: {
          offset: 2,
        },
        customScale: 1.0,
      },
    },
    labels: ["Principal", "Interest"],
    // responsive: [
    //   {
    //     breakpoint: 480,
    //     options: {
    //       chart: {
    //         width: 200,
    //       },
    //       legend: {
    //         position: "bottom",
    //       },
    //     },
    //   },
    // ],
    //colors: ["#587fca", "#f48033"],
    //colors: ["#46C9B8", "#F76775"],
    colors: ["#7CE5D3", "#F993A2"],
  };

  const [options, setOptions] =
    useState<ApexCharts.ApexOptions>(defaultOptions);
  const [series, setSeries] = useState([0, 0]);

  useEffect(() => {
    //Reset Form if detailData is empty object
    if (
      formik.values.chart_info &&
      Object.keys(formik.values.chart_info).length === 0
    )
      formik.resetForm();

    if (
      formik.values.chart_info &&
      Object.keys(formik.values.chart_info).length > 0
    ) {
      let chartData = formik.values.chart_info;
      if (
        chartData?.loan_amt &&
        chartData?.loan_amt != "" &&
        chartData?.interest_amt &&
        chartData?.interest_amt != ""
      ) {
        //console.log("chartData?.loan_amt>>>>>", chartData?.loan_amt);
        //console.log("chartData?.interest_amt>>>>>", chartData?.interest_amt);
        setSeries([
          parseFloat(chartData?.loan_amt),
          parseFloat(chartData?.interest_amt),
        ]);
        setOptions(loanOptions);
      }
    } else {
      setSeries([1]);
      setOptions(defaultOptions);
    }
  }, [formik.values.chart_info]);

  useEffect(() => {
    if (formik.values.startdate != "" && formik.values.startdate != null) {
      formik.setFieldValue(
        "maturitydate",
        dayjs(formik.values.startdate).add(
          formik.values.tenure,
          formik.values.tenuretyp == "M" ? "month" : "day"
        ) || null
      );
    }
  }, [formik.values.startdate, formik.values.tenure, formik.values.tenuretyp]);

  useEffect(() => {
    formik.setFieldValue("custominstallment", "");
    if (formik.values.ratetyp == "FLTRT") {
      formik.setFieldValue("paymentTyp", "FIXINSTALM");
    }
  }, [formik.values.ratetyp]);

  useEffect(() => {
    if (formik.values.paymentTyp == "INFSTPRLST") {
      formik.setFieldValue("daybasis", "D001");
    } else {
      formik.setFieldValue("daybasis", "D365");
    }
  }, [formik.values.paymentTyp]);

  useEffect(() => {
    if (formik.values.accrualTyp == "002") {
      formik.setFieldValue("daybasis", "");
    }
  }, [formik.values.accrualTyp]);

  return (
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
          <Text fontSize={"lg"} fontWeight={"medium"}>
            Loan Financing Simulation
          </Text>
          <Box display="flex" flexDir="column" gap={6}>
            <Flex flexDir={"column"}>
              <FormControl
                id="ratetyp"
                isInvalid={
                  Boolean(formik.errors.ratetyp) &&
                  Boolean(formik.touched.ratetyp)
                }
                isReadOnly={false}
                //w={"50%"}
                pr={0}
                alignSelf={"center"}
              >
                <RadioGroup
                  name="ratetyp"
                  value={formik.values.ratetyp}
                  onChange={(value) =>
                    formik.handleChange({
                      target: { value, name: "ratetyp" },
                    })
                  }
                  pt={1}
                  pb={5}
                  //pl={5}
                >
                  <Stack gap={3} direction="row">
                    <Radio value="FLTRT">Flat Rate</Radio>
                    <Radio value="RDBAL">Annuity Reducing Balance</Radio>
                  </Stack>
                </RadioGroup>
                {formik.errors.ratetyp && (
                  <FormErrorMessage>{formik.errors.ratetyp}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="loanamt"
                isInvalid={
                  Boolean(formik.errors.loanamt) &&
                  Boolean(formik.touched.loanamt)
                }
                isReadOnly={false}
                //w={"50%"}
                pr={1}
              >
                <CustomFormLabel labelText="Loan Amount" />
                <Flex>
                  <NumberInput
                    maxW="150px"
                    mr="2rem"
                    name="loanamt"
                    min={0}
                    precision={0}
                    onChange={(value) => {
                      let removeThousand = parseThousandsToNumber(value);
                      formik.handleChange({
                        target: { value: removeThousand, name: "loanamt" },
                      });
                    }}
                    value={numberWithCommas(formik.values.loanamt)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Slider
                    flex={"1"}
                    mr="1rem"
                    min={0}
                    step={100}
                    max={250000}
                    focusThumbOnChange={false}
                    value={formik.values.loanamt}
                    onChange={(value) => {
                      formik.setFieldValue("loanamt", value);
                    }}
                  >
                    <SliderMark value={0} {...sliderlabelStyles}>
                      0
                    </SliderMark>
                    <SliderMark value={50000} {...sliderlabelStyles}>
                      50k
                    </SliderMark>
                    <SliderMark value={150000} {...sliderlabelStyles}>
                      150k
                    </SliderMark>
                    <SliderMark value={250000} {...sliderlabelStyles}>
                      250k
                    </SliderMark>
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb
                      fontSize="sm"
                      boxSize="18px"
                      //children={formik.values.loanamt}
                    />
                  </Slider>
                </Flex>

                {formik.errors.loanamt && (
                  <FormErrorMessage>{formik.errors.loanamt}</FormErrorMessage>
                )}
              </FormControl>
            </Flex>
            <Flex flexDir={"row"}>
              <FormControl
                id="tenure"
                isInvalid={
                  Boolean(formik.errors.tenure) &&
                  Boolean(formik.touched.tenure)
                }
                isReadOnly={false}
                //w={"50%"}
                pr={1}
              >
                <CustomFormLabel labelText="Tenure" />
                <NumberInput
                  name="tenure"
                  min={0}
                  precision={0}
                  onChange={(value) =>
                    formik.handleChange({
                      target: { value, name: "tenure" },
                    })
                  }
                  onBlur={formik.handleBlur}
                  value={formik.values.tenure}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                {formik.errors.tenure && (
                  <FormErrorMessage>{formik.errors.tenure}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="tenuretyp"
                isInvalid={
                  Boolean(formik.errors.tenuretyp) &&
                  Boolean(formik.touched.tenuretyp)
                }
                isReadOnly={formik.values.ratetyp == "FLTRT" ? true : false}
                //w={"50%"}
                pr={1}
                alignSelf={"center"}
              >
                <RadioGroup
                  name="tenuretyp"
                  value={formik.values.tenuretyp}
                  onChange={(value) =>
                    formik.handleChange({
                      target: { value, name: "tenuretyp" },
                    })
                  }
                  pt={6}
                  pl={5}
                >
                  <Stack gap={3} direction="row">
                    <Radio value="M">Months</Radio>
                    <Radio value="D">Days</Radio>
                  </Stack>
                </RadioGroup>
                {formik.errors.tenuretyp && (
                  <FormErrorMessage>{formik.errors.tenuretyp}</FormErrorMessage>
                )}
              </FormControl>
            </Flex>
            <Flex flexDir={"row"}>
              <FormControl
                id="startdate"
                isInvalid={
                  Boolean(formik.errors.startdate) &&
                  Boolean(formik.touched.startdate)
                }
                pr={1}
              >
                <CustomFormLabel labelText="First Due Date" />
                <DatePicker
                  id="startdate"
                  name="startdate"
                  style={{ width: "100%" }}
                  format={"DD/MM/YYYY"}
                  // disabledDate={(currentDate) =>
                  //   currentDate < dayjs().startOf("day")
                  // }
                  value={
                    formik.values.startdate
                      ? dayjs(formik.values.startdate)
                      : dayjs()
                  }
                  onChange={(value) =>
                    formik.handleChange({
                      target: { value, name: "startdate" },
                    })
                  }
                />
                {formik.errors.startdate && (
                  <FormErrorMessage>{formik.errors.startdate}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="maturitydate"
                isInvalid={
                  Boolean(formik.errors.maturitydate) &&
                  Boolean(formik.touched.maturitydate)
                }
              >
                <FormLabel>Maturity Date</FormLabel>
                <DatePicker
                  id="maturitydate"
                  name="maturitydate"
                  style={{ width: "100%" }}
                  format={"DD/MM/YYYY"}
                  // disabledDate={(currentDate) =>
                  //   currentDate < dayjs().startOf("day")
                  // }
                  disabled={true}
                  value={
                    formik.values.maturitydate
                      ? dayjs(formik.values.maturitydate)
                      : dayjs().add(1, "month")
                  }
                  onChange={(value) =>
                    formik.handleChange({
                      target: { value, name: "maturitydate" },
                    })
                  }
                />
                {formik.errors.maturitydate && (
                  <FormErrorMessage>
                    {formik.errors.maturitydate}
                  </FormErrorMessage>
                )}
              </FormControl>
            </Flex>
            <Flex flexDir={"row"}>
              <FormControl
                id="paymentfreq"
                isInvalid={
                  Boolean(formik.errors.paymentfreq) &&
                  Boolean(formik.touched.paymentfreq)
                }
                isReadOnly={false}
                //w={"50%"}
                pr={1}
              >
                <CustomFormLabel labelText="Payment Frequency" />
                <NumberInput
                  name="paymentfreq"
                  min={0}
                  precision={0}
                  onChange={(value) =>
                    formik.handleChange({
                      target: { value, name: "paymentfreq" },
                    })
                  }
                  onBlur={formik.handleBlur}
                  value={formik.values.paymentfreq}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                {formik.errors.paymentfreq && (
                  <FormErrorMessage>
                    {formik.errors.paymentfreq}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="paymentfreqtyp"
                isInvalid={
                  Boolean(formik.errors.paymentfreqtyp) &&
                  Boolean(formik.touched.paymentfreqtyp)
                }
                isReadOnly={formik.values.ratetyp == "FLTRT" ? true : false}
                //w={"50%"}
                pr={1}
                alignSelf={"center"}
              >
                <RadioGroup
                  name="paymentfreqtyp"
                  value={formik.values.paymentfreqtyp}
                  onChange={(value) =>
                    formik.handleChange({
                      target: { value, name: "paymentfreqtyp" },
                    })
                  }
                  pt={6}
                  pl={5}
                >
                  <Stack gap={3} direction="row">
                    <Radio value="M">Months</Radio>
                    <Radio value="D">Days</Radio>
                  </Stack>
                </RadioGroup>
                {formik.errors.paymentfreqtyp && (
                  <FormErrorMessage>
                    {formik.errors.paymentfreqtyp}
                  </FormErrorMessage>
                )}
              </FormControl>
            </Flex>
            <Flex flexDir={"row"}>
              <FormControl
                id="rate"
                isInvalid={
                  Boolean(formik.errors.rate) && Boolean(formik.touched.rate)
                }
                isReadOnly={false}
                //w={"50%"}
                pr={1}
              >
                <CustomFormLabel labelText="Rate (%)" />
                <NumberInput
                  name="rate"
                  min={0}
                  precision={2}
                  onChange={(value) =>
                    formik.handleChange({
                      target: { value, name: "rate" },
                    })
                  }
                  onBlur={() => {
                    formik.handleBlur({
                      target: { name: "rate" },
                    });

                    if (formik.values.eirate == "") {
                      let defaultEIRRate = formik.values.rate;
                      formik.setFieldValue(
                        "eirate",
                        parseFloat(defaultEIRRate).toFixed(2)
                      );
                    }
                  }}
                  value={formik.values.rate}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                {formik.errors.rate && (
                  <FormErrorMessage>{formik.errors.rate}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="eirate"
                isInvalid={
                  Boolean(formik.errors.eirate) &&
                  Boolean(formik.touched.eirate)
                }
                isReadOnly={false}
                //w={"50%"}
                pr={1}
              >
                <CustomFormLabel labelText="EIR Rate (%)" />
                <NumberInput
                  name="eirate"
                  min={0}
                  precision={2}
                  onChange={(value) =>
                    formik.handleChange({
                      target: { value, name: "eirate" },
                    })
                  }
                  onBlur={formik.handleBlur}
                  value={formik.values.eirate}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                {formik.errors.eirate && (
                  <FormErrorMessage>{formik.errors.eirate}</FormErrorMessage>
                )}
              </FormControl>
            </Flex>
            <Flex flexDir={"row"}>
              <FormControl
                id="custominstallment"
                isInvalid={
                  Boolean(formik.errors.custominstallment) &&
                  Boolean(formik.touched.custominstallment)
                }
                isReadOnly={false}
                //w={"50%"}
                pr={1}
              >
                <FormLabel>Installment Amount</FormLabel>
                <NumberInput
                  name="custominstallment"
                  min={0}
                  precision={2}
                  onChange={(value) =>
                    formik.handleChange({
                      target: { value, name: "custominstallment" },
                    })
                  }
                  onBlur={formik.handleBlur}
                  value={formik.values.custominstallment}
                  isDisabled={
                    formik.values.paymentTyp == "INFSTPRLST" ? true : false
                  }
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                {formik.errors.custominstallment && (
                  <FormErrorMessage>
                    {formik.errors.custominstallment}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="roundingtyp"
                isInvalid={
                  Boolean(formik.errors.roundingtyp) &&
                  Boolean(formik.touched.roundingtyp)
                }
              >
                <FormLabel>Rounding Type</FormLabel>
                <Select
                  placeholder="Please Select Rounding Type"
                  value={formik.values.roundingtyp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  {ddlData?.PRDPYRND?.map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgecode + " - " + option.prgedesc}
                    </option>
                  ))}
                </Select>
                {formik.errors.roundingtyp && (
                  <FormErrorMessage>
                    {formik.errors.roundingtyp}
                  </FormErrorMessage>
                )}
              </FormControl>
            </Flex>
            {formik.values.ratetyp == "RDBAL" && (
              <Flex flexDir={"row"}>
                <FormControl
                  id="daybasis"
                  isInvalid={
                    Boolean(formik.errors.daybasis) &&
                    Boolean(formik.touched.daybasis)
                  }
                  pr={1}
                >
                  <FormLabel>Day Basis</FormLabel>
                  <Select
                    placeholder="Please Select Day Basis"
                    value={formik.values.daybasis}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isDisabled={
                      formik.values.paymentTyp == "INFSTPRLST"
                        ? true
                        : formik.values.accrualTyp == "002"
                        ? true
                        : false
                    }
                  >
                    {ddlData?.PRDYRBASE?.filter((option: DDL_TYPES) => {
                      if (formik.values.paymentTyp == "INFSTPRLST") {
                        return option.prgecode == "D001";
                      } else {
                        return option.prgecode != "D001";
                      }
                    }).map((option: DDL_TYPES) => (
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgecode + " - " + option.prgedesc}
                      </option>
                    ))}
                  </Select>
                  {formik.errors.daybasis && (
                    <FormErrorMessage>
                      {formik.errors.daybasis}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="accrualTyp"
                  isInvalid={
                    Boolean(formik.errors.accrualTyp) &&
                    Boolean(formik.touched.accrualTyp)
                  }
                >
                  <FormLabel>Accrual Balance Type</FormLabel>
                  <Select
                    placeholder="Please Select Accrual Balance Type"
                    value={formik.values.accrualTyp}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {ddlData?.ACRBALTYP?.filter(
                      (option: DDL_TYPES) => option.prgecode != "003"
                    ).map((option: DDL_TYPES) => (
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgecode + " - " + option.prgedesc}
                      </option>
                    ))}
                  </Select>
                  {formik.errors.accrualTyp && (
                    <FormErrorMessage>
                      {formik.errors.accrualTyp}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Flex>
            )}
            <Flex flexDir={"row"}>
              <FormControl
                id="paymentTyp"
                isInvalid={
                  Boolean(formik.errors.paymentTyp) &&
                  Boolean(formik.touched.paymentTyp)
                }
                w={"50%"}
                pr={1}
              >
                <FormLabel>Payment Type</FormLabel>
                <Select
                  placeholder="Please Select Payment Type"
                  value={formik.values.paymentTyp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isDisabled={formik.values.ratetyp == "FLTRT" ? true : false}
                >
                  {ddlData?.PRDPAYCD?.filter(
                    (option: DDL_TYPES) => option.prgecode != "BULLETPAYM"
                  ).map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {
                        //option.prgecode + " - " +
                        option.prgedesc
                      }
                    </option>
                  ))}
                </Select>
                {formik.errors.paymentTyp && (
                  <FormErrorMessage>
                    {formik.errors.paymentTyp}
                  </FormErrorMessage>
                )}
              </FormControl>
            </Flex>
          </Box>
        </div>
      </Card>
      <Card className="grid grid-cols-1 gap-6" borderRadius={0}>
        <div
          className="flex flex-col sm:flex-column gap-3"
          style={{ height: "100%" }}
        >
          <Text fontSize={"lg"} fontWeight={"medium"}>
            Total Payable
          </Text>
          <Box
            display={"flex"}
            flexDir={"row"}
            h={"100%"}
          >
            <Box
              display="flex"
              flexDir="column"
              gap={6}
              pr={1}
              w={"40%"}
              alignSelf={{
                base: "center",
                lg: "right",
              }}
            >
              <Flex flexDir="column" alignItems={"flex-end"}>
                <Grid
                  gap={1}
                  templateColumns="2fr 0.5fr auto"
                  templateRows="repeat(5, 1fr)"
                  fontSize={14}
                >
                  <GridItem fontWeight={"medium"} textAlign={"right"}>
                    Loan Amount
                  </GridItem>
                  <GridItem textAlign={"center"}>:</GridItem>
                  <GridItem fontWeight={"semibold"} textAlign={"right"}>
                    {numberWithCommas(formik.values.chart_info?.loan_amt) ||
                      "0.00"}
                  </GridItem>
                  <GridItem fontWeight={"medium"} textAlign={"right"}>
                    Interest
                  </GridItem>
                  <GridItem textAlign={"center"}>:</GridItem>
                  <GridItem fontWeight={"semibold"} textAlign={"right"}>
                    {numberWithCommas(formik.values.chart_info?.interest_amt) ||
                      "0.00"}
                  </GridItem>
                  <GridItem fontWeight={"medium"} textAlign={"right"}>
                    Total Payable
                  </GridItem>
                  <GridItem textAlign={"center"}>:</GridItem>
                  <GridItem fontWeight={"semibold"} textAlign={"right"}>
                    {numberWithCommas(
                      formik.values.chart_info?.total_payable
                    ) || "0.00"}
                  </GridItem>

                  <GridItem colSpan={3} />

                  <GridItem fontWeight={"medium"} textAlign={"right"}>
                    Installment
                  </GridItem>
                  <GridItem textAlign={"center"}>:</GridItem>
                  <GridItem fontWeight={"semibold"} textAlign={"right"}>
                    {numberWithCommas(
                      formik.values.chart_info?.monthly_installment
                    ) || "0.00"}
                  </GridItem>
                  <GridItem fontWeight={"medium"} textAlign={"right"}>
                    Final Installment
                  </GridItem>
                  <GridItem textAlign={"center"}>:</GridItem>
                  <GridItem fontWeight={"semibold"} textAlign={"right"}>
                    {numberWithCommas(
                      formik.values.chart_info?.final_monthly_installment
                    ) || "0.00"}
                  </GridItem>
                </Grid>
              </Flex>
            </Box>
            <Box
              display="flex"
              flexDir="column"
              w={"56%"}
              alignSelf={{
                base: "center",
                lg: "right",
              }}
            >
              <ReactApexChart
                //width={"280px"}
                height={"500px"}
                options={options}
                series={series}
                type="donut"
              />
            </Box>
          </Box>
        </div>
      </Card>
    </Flex>
  );
}

interface CalculatorProps {
  formik: any;
}

const sliderlabelStyles = {
  mt: "0",
  ml: "-2.5",
  fontSize: "8pt",
};
