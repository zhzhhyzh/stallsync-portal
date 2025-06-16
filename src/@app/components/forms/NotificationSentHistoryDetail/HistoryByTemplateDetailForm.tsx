// Chakra imports
import {
  Box,
  Flex,
  Text,
  Input,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Tab,
  Tabs,
  TabList,
  RadioGroup,
  Stack,
  Radio,
  Tooltip as ChakraTooltip,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";

import { DatePicker, Space, TimePicker } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";

import { showModal } from "@app/helpers/modalHelper";
import { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import Buttons from "@app/components/common/Buttons/Buttons";
import dayjs from "dayjs";
import dynamic from "next/dynamic";

import useFetchSentHistoryByTemplateDetail from "@app/hooks/selector/useFetchSentHistoryByTemplateDetail";
import PreviewEmailNotification from "./PreviewEmailNotification";
//import useFetchDDLSegment from "@app/hooks/selector/useFetchDDLSegment";
import Colors from "@app/constants/Colors";
import { fetchHistoriesByTemplateDetail } from "@app/redux/notificationSentHistory/slice";
import ModalDialogPopUp from "@app/components/modal/ModalDialogPopUp";
import PreviewRecipients from "@app/components/pages/notificationsenthistory/PreviewRecipients";
import PreviewEmailHTMLNotification from "./PreviewEmailHTMLNotification";
import PreviewPushNotification from "./PreviewPushNotification";
import PreviewWhatsappNotification from "./PreviewWhatsappNotification";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function HistoryByTemplateDetailForm(props: any) {
  const { sendRequest, loading } = useApi({
    title: "Scheduled Notification Detail",
  });
  const router = useRouter();
  const id = props.id;
  const mode = props.mode;
  const accountNo = props.accountNo;
  const cifId = props.cifId;
  const screenType = props.screenType;
  const previousMode = props.previousMode;
  const channel = props.channel;

  const [detailData] = useFetchSentHistoryByTemplateDetail(id);

  const [ddlData] = useFetchDDL({ code: ["NOTCHNL", "NOTCATG", "NOTLANG"] });
  //const [ddlSegment] = useFetchDDLSegment();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const defaultOptions: ApexCharts.ApexOptions = {
    tooltip: { enabled: false },
    chart: {
      type: `donut`,
    },
    legend: {
      offsetY: 10,
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
          size: "50%",
        },
        dataLabels: {
          offset: 35,
        },
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

  const emailOptions: ApexCharts.ApexOptions = {
    tooltip: {
      enabled: true,
      // custom: function ({ seriesIndex, w }) {
      //   let series = w.globals.series[seriesIndex];
      //   let seriesNames = w.globals.seriesNames[seriesIndex];
      //   let percentage = w.globals.seriesPercent[seriesIndex];
      //   percentage = parseFloat(percentage).toFixed(2).toString();
      //   return series + " " + seriesNames + percentage + "%"
      // },
    },
    chart: {
      type: `donut`,
    },
    legend: {
      offsetY: 10,
      position: "bottom",
    },
    dataLabels: {
      style: {
        colors: ["black"],
        fontWeight: "bold",
        fontSize: "10px",
      },
      formatter: function (val, { w, seriesIndex }) {
        let series = w.globals.series[seriesIndex];
        let seriesNames = w.globals.seriesNames[seriesIndex];
        let percentage = val.toString();
        percentage = parseFloat(percentage).toFixed(2).toString();
        return [series + " " + seriesNames, percentage + "%"] as unknown as
          | string
          | number;
        //series + "<br/>" +seriesNames + "," +  percentage
      },
      dropShadow: {
        enabled: true,
      },
      enabled: true,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "50%",
        },
        dataLabels: {
          offset: 35,
        },
        customScale: 0.9,
      },
    },
    labels: ["Sent", "Failed"],
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
    colors: ["#587fca", "#f48033"],
  };

  const pushOptions: ApexCharts.ApexOptions = {
    tooltip: { enabled: true },
    chart: {
      type: `donut`,
    },
    legend: {
      offsetY: 10,
      position: "bottom",
    },
    dataLabels: {
      style: {
        colors: ["black"],
        fontWeight: "bold",
        fontSize: "10px",
      },
      formatter: function (val, { w, seriesIndex }) {
        let series = w.globals.series[seriesIndex];
        let seriesNames = w.globals.seriesNames[seriesIndex];
        let percentage = val.toString();
        percentage = parseFloat(percentage).toFixed(2).toString();
        return [series + " " + seriesNames, percentage + "%"] as unknown as
          | string
          | number;
        //series + "<br/>" +seriesNames + "," +  percentage
      },
      dropShadow: {
        enabled: true,
      },
      enabled: true,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "50%",
        },
        dataLabels: {
          offset: 35,
        },
        customScale: 0.9,
      },
    },
    labels: ["Clicked", "Unclicked"],
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
    colors: ["#587fca", "#f48033"],
  };

  const [series, setSeries] = useState([0, 0]);
  const [options, setOptions] =
    useState<ApexCharts.ApexOptions>(defaultOptions);

  const initialValues = {
    psnotcde: "",
    psnotdsc: "",
    psmsgttl: "",
    psmsgbdy: "",
    psnotchn: "",
    psnotcat: "",
    psnothrf: "",
    psnotdvd: "",
    psmsgurl: "",
    pswapmsg: "",
    psmsgtid: "",

    totalSent: "",
    totalClicked: "",
    totalClickedRate: "",
    totalUnclicked: "",
    totalUnclickedRate: "",
    psnotscn: "",
    psnotfcn: "",
    recipientType: "",
    pssegcde: "",
    tabIndex: 1,

    attachments: "",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: (values) => {},
  });

  useEffect(() => {
    if (mode !== "ADD" && id) {
      //Reset Form if detailData is empty object
      if (Object.keys(detailData).length === 0) formik.resetForm();

      if (Object.keys(detailData).length > 0) {
        formik.setValues({
          ...detailData,
          recipientType:
            detailData.pssegcde && detailData.pssegcde != ""
              ? "SEGMENT"
              : "MANUAL",
          tabIndex: formik.values.tabIndex == 0 ? 1 : formik.values.tabIndex,
          psnotcde:
            detailData.psnotcde && detailData.psnotcde != ""
              ? detailData.psnotcde
              : "ADHOC",
          psnotdsc:
            detailData.psnotcde && detailData.psnotcde != ""
              ? detailData.psnotdsc
              : "ADHOC",
          psmsgttl:
            detailData?.psmsgttl && detailData?.psmsgttl !== ""
              ? detailData?.psmsgttl
              : "",
          psmsgbdy:
            detailData?.psmsgbdy && detailData?.psmsgbdy !== ""
              ? detailData?.psmsgbdy
              : "",
          psmsgobj:
            detailData?.psnotchn === "EMLE"
              ? typeof detailData?.psmsgobj === "string"
                ? JSON.parse(detailData?.psmsgobj)
                : detailData?.psmsgobj
              : {},
          psmsgurl:
            detailData?.psmsgurl && detailData?.psmsgurl !== ""
              ? detailData?.psmsgurl
              : "",
          pswapmsg:
            detailData?.pswapmsg && detailData?.pswapmsg !== ""
              ? detailData?.pswapmsg
              : "",
          psmsgtid:
            detailData?.psmsgtid && detailData?.psmsgtid !== ""
              ? detailData?.psmsgtid
              : "",
          id,
        });

        if (formik.values.psnotchn === "PSH") {
          if (
            detailData.totalClicked === 0 &&
            detailData.totalUnclicked === 0
          ) {
            setSeries([1]);
            setOptions(defaultOptions);
          } else {
            setSeries([detailData.totalClicked, detailData.totalUnclicked]);
            setOptions(pushOptions);
          }
        } else {
          if (detailData.psnotscn === 0 && detailData.psnotfcn === 0) {
            setSeries([1]);
            setOptions(defaultOptions);
          } else {
            setSeries([detailData.psnotscn, detailData.psnotfcn]);
            setOptions(emailOptions);
          }
        }
      }
    }
  }, [detailData]);

  async function handleTabChange(index: string) {
    formik.setFieldValue("tabIndex", index);
    triggerAPi(index);
    // if (msgLanguage !== index) {
    //   if (!formik.values.isContentChanged) {
    //     setMsgLanguage(index);
    //     if (mode !== "ADD") {
    //       triggerAPi(index);
    //     } else {
    //       formik.setFieldValue("resetFlag", true);
    //     }
    //   }
    // }
  }

  async function triggerAPi(index: string) {
    await sendRequest({
      fn: fetchHistoriesByTemplateDetail({
        id,
        language: index,
      }),
    });
  }

  function handlePreview() {
    onOpen();
  }

  return (
    <>
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Sent History Detail
          </Text>

          {screenType == "ACC" ? (
            <Breadcrumbs
              breadcrumbItems={[
                {
                  title: "Loans Account Listing Inquiry",
                  href: `/accountManagement`, // Add parameter if needed eg. /generalParameter/?id=123
                },
                {
                  title: "Loans Accounts",
                  href: `/accountManagement/Detail?id=${cifId}&mode=${previousMode}`, // Add parameter if needed eg. /generalParameter/?id=123
                },
                {
                  title: "Loans Account Detail",
                  href: `/accountManagement/accountDetails/Detail/?id=${accountNo}&cifId=${cifId}&mode=${previousMode}`, // Add parameter if needed eg. /generalParameter/?id=123
                },
                {
                  title: "Sent History Detail" + " (" + mode + ")",
                },
              ]}
            />
          ) : (
            <Breadcrumbs
              breadcrumbItems={[
                {
                  title: "Sent History",
                  href: `/notificationSentHistory`, // Add parameter if needed eg. /generalParameter/?id=123
                },
                {
                  title: "Sent History Detail" + " (" + mode + ")",
                },
              ]}
            />
          )}
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
            <Buttons buttonDefaultType={"BACK"} onclick={() => router.back()} />
            {mode !== "VIEW" && (
              <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
            )}
          </Space>
        </Box>
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
            <Text fontSize={"lg"}>Sent History</Text>
            <Box display="flex" flexDir="column" gap={6}>
              <Flex flexDir={"row"}>
                <FormControl
                  id="psnotcde"
                  isInvalid={
                    Boolean(formik.errors.psnotcde) &&
                    Boolean(formik.touched.psnotcde)
                  }
                  isReadOnly={true}
                  //w={"50%"}
                  pr={1}
                >
                  <FormLabel>Notification Code</FormLabel>
                  <Input
                    placeholder={"Enter Notification Code"}
                    type="text"
                    name="psnotcde"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.psnotcde}
                  />
                  {formik.errors.psnotcde && (
                    <FormErrorMessage>
                      {formik.errors.psnotcde}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psnotdsc"
                  isInvalid={
                    Boolean(formik.errors.psnotdsc) &&
                    Boolean(formik.touched.psnotdsc)
                  }
                  isReadOnly={true}
                >
                  <FormLabel>Notification Description*</FormLabel>
                  <Input
                    placeholder={"Enter Notification Description"}
                    type="text"
                    name="psnotdsc"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.psnotdsc}
                  />
                  {formik.errors.psnotdsc && (
                    <FormErrorMessage>
                      {formik.errors.psnotdsc}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Flex>
              <Flex flexDir={"row"}>
                <FormControl
                  id="psnotchn"
                  isInvalid={
                    Boolean(formik.errors.psnotchn) &&
                    Boolean(formik.touched.psnotchn)
                  }
                  isReadOnly={true}
                  pr={1}
                >
                  <FormLabel>Notification Type</FormLabel>
                  <Select
                    //placeholder="Please Select Notification Type"
                    value={formik.values.psnotchn}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isDisabled={true}
                  >
                    {ddlData?.NOTCHNL?.map((option: DDL_TYPES) => (
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    ))}
                  </Select>
                  {formik.errors.psnotchn && (
                    <FormErrorMessage>
                      {formik.errors.psnotchn}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psnotcat"
                  isInvalid={
                    Boolean(formik.errors.psnotcat) &&
                    Boolean(formik.touched.psnotcat)
                  }
                  isReadOnly={true}
                >
                  <FormLabel>Notification Category</FormLabel>
                  <Select
                    placeholder="Please Select Notification Category"
                    value={formik.values.psnotcat}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isDisabled={true}
                  >
                    {ddlData?.NOTCATG?.map((option: DDL_TYPES) => (
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    ))}
                  </Select>
                  {formik.errors.psnotcat && (
                    <FormErrorMessage>
                      {formik.errors.psnotcat}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Flex>
              <Flex flexDir={"row"}>
                {/* <FormControl
                  id="psnothrf"
                  isInvalid={
                    Boolean(formik.errors.psnothrf) &&
                    Boolean(formik.touched.psnothrf)
                  }
                  isReadOnly={true}
                  pr={1}
                >
                  <FormLabel>Sent ID</FormLabel>
                  <Input
                    placeholder={"Enter Sent ID"}
                    type="text"
                    name="psnothrf"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.psnothrf}
                  />
                  {formik.errors.psnothrf && (
                    <FormErrorMessage>
                      {formik.errors.psnothrf}
                    </FormErrorMessage>
                  )}
                </FormControl> */}
                <FormControl
                  id="psnotdvd"
                  isInvalid={
                    Boolean(formik.errors.psnotdvd) &&
                    Boolean(formik.touched.psnotdvd)
                  }
                  w={"50%"}
                >
                  <FormLabel>Sent At</FormLabel>
                  <DatePicker
                    id="psnotdvd"
                    name="psnotdvd"
                    style={{ width: "100%" }}
                    format={"DD/MM/YYYY"}
                    disabled={true}
                    value={
                      formik.values.psnotdvd
                        ? dayjs(formik.values.psnotdvd)
                        : null
                    }
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "psnotdvd" },
                      })
                    }
                  />
                  {formik.errors.psnotdvd && (
                    <FormErrorMessage>
                      {formik.errors.psnotdvd}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Flex>
            </Box>
          </div>
        </Card>
        <Card className="grid grid-cols-1 gap-6" borderRadius={0}>
          <div className="flex flex-col sm:flex-column gap-3">
            <Text fontSize={"lg"}>Sent Status</Text>
            <Box display={"flex"} flexDir={"row"}>
              <Box display="flex" flexDir="column" gap={6} pr={1} w={"49%"}>
                <FormControl
                  id="totalSent"
                  isInvalid={
                    Boolean(formik.errors.totalSent) &&
                    Boolean(formik.touched.totalSent)
                  }
                  isReadOnly={true}
                >
                  <FormLabel>Total Sent</FormLabel>
                  <Input
                    placeholder={"Enter Total Sent"}
                    type="text"
                    name="totalSent"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.totalSent}
                  />
                  {formik.errors.totalSent && (
                    <FormErrorMessage>
                      {formik.errors.totalSent}
                    </FormErrorMessage>
                  )}
                </FormControl>
                {formik.values.psnotchn === "PSH" ? (
                  <>
                    <Flex flexDir={"row"}>
                      <FormControl
                        id="totalClicked"
                        isInvalid={
                          Boolean(formik.errors.totalClicked) &&
                          Boolean(formik.touched.totalClicked)
                        }
                        isReadOnly={true}
                        pr={1}
                      >
                        <FormLabel whiteSpace={"nowrap"}>
                          Total Clicked
                        </FormLabel>
                        <Input
                          placeholder={"Enter Total Clicked"}
                          type="text"
                          name="totalClicked"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.totalClicked}
                        />
                        {formik.errors.totalClicked && (
                          <FormErrorMessage>
                            {formik.errors.totalClicked}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                      <FormControl
                        id="totalClickedRate"
                        isInvalid={
                          Boolean(formik.errors.totalClickedRate) &&
                          Boolean(formik.touched.totalClickedRate)
                        }
                        isReadOnly={true}
                      >
                        <FormLabel whiteSpace={"nowrap"}>
                          Clicked Rate(%)
                        </FormLabel>
                        <Input
                          placeholder={"Enter Clicked Rate"}
                          type="text"
                          name="totalClickedRate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.totalClickedRate}
                        />
                        {formik.errors.totalClickedRate && (
                          <FormErrorMessage>
                            {formik.errors.totalClickedRate}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </Flex>
                    <Flex flexDir={"row"}>
                      <FormControl
                        id="totalUnclicked"
                        isInvalid={
                          Boolean(formik.errors.totalUnclicked) &&
                          Boolean(formik.touched.totalUnclicked)
                        }
                        isReadOnly={true}
                        pr={1}
                      >
                        <FormLabel whiteSpace={"nowrap"}>
                          Total Unclicked
                        </FormLabel>
                        <Input
                          placeholder={"Enter Total Unclicked"}
                          type="text"
                          name="totalUnclicked"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.totalUnclicked}
                        />
                        {formik.errors.totalUnclicked && (
                          <FormErrorMessage>
                            {formik.errors.totalUnclicked}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                      <FormControl
                        id="totalUnclickedRate"
                        isInvalid={
                          Boolean(formik.errors.totalUnclickedRate) &&
                          Boolean(formik.touched.totalUnclickedRate)
                        }
                        isReadOnly={true}
                      >
                        <FormLabel whiteSpace={"nowrap"}>
                          Unclicked Rate(%)
                        </FormLabel>
                        <Input
                          placeholder={"Enter Total Unclicked Rate"}
                          type="text"
                          name="totalUnclickedRate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.totalUnclickedRate}
                        />
                        {formik.errors.totalUnclickedRate && (
                          <FormErrorMessage>
                            {formik.errors.totalUnclickedRate}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </Flex>
                  </>
                ) : (
                  <>
                    <FormControl
                      id="psnotscn"
                      isInvalid={
                        Boolean(formik.errors.psnotscn) &&
                        Boolean(formik.touched.psnotscn)
                      }
                      isReadOnly={true}
                    >
                      <FormLabel>Success Count</FormLabel>
                      <Input
                        placeholder={"Enter Success Count"}
                        type="text"
                        name="psnotscn"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.psnotscn}
                      />
                      {formik.errors.psnotscn && (
                        <FormErrorMessage>
                          {formik.errors.psnotscn}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl
                      id="psnotfcn"
                      isInvalid={
                        Boolean(formik.errors.psnotfcn) &&
                        Boolean(formik.touched.psnotfcn)
                      }
                      isReadOnly={true}
                    >
                      <FormLabel>Failed Count</FormLabel>
                      <Input
                        placeholder={"Enter Failed Count"}
                        type="text"
                        name="psnotcde"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.psnotfcn}
                      />
                      {formik.errors.psnotfcn && (
                        <FormErrorMessage>
                          {formik.errors.psnotfcn}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </>
                )}
              </Box>
              <Box display="flex" flexDir="column" w={"50%"}>
                <Text alignSelf={"center"} fontSize={"sm"}>
                  Notification Sent Status
                </Text>
                <ReactApexChart
                  //width={"280px"}
                  height={"280px"}
                  options={options}
                  series={series}
                  type="donut"
                />
              </Box>
            </Box>
          </div>
        </Card>
      </Flex>

      {/* Tabs */}
      <Flex mt={4} bgColor="#fff" py={2}>
        <Tabs onChange={(index) => handleTabChange(String(index + 1))}>
          {/* <Tabs
          index={
            Number(msgLanguage) > 0
              ? Number(msgLanguage) - 1
              : Number(msgLanguage)
          }
        > */}
          <TabList
            border={0}
            //overflowX={'auto'}
            //overflowY="hidden"
            w="100vw"
          >
            {ddlData?.NOTLANG?.map((option: DDL_TYPES, index: number) => (
              <Tab
                key={`notlang-tab-${option.prgecode}`}
                ml={
                  index > 0
                    ? {}
                    : {
                        base: 0,
                        md: "5px",
                      }
                }
                py={3}
                onClick={() => handleTabChange(option.prgecode)}
                whiteSpace={"nowrap"}
              >
                {option.prgedesc}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </Flex>

      <Flex
        flexDir={{
          base: "column",
          lg: "row",
        }}
        gap={Spacing.gap}
        mt={Spacing.gap}
      >
        {/* Email(EML) */}
        {formik.values.psnotchn === "EML" && (
          <PreviewEmailNotification
            mode={mode}
            id={id}
            detailData={detailData}
            formik={formik}
          />
        )}
        {/* Email Editor(EMLE) */}
        {formik.values.psnotchn === "EMLE" && (
          <PreviewEmailHTMLNotification
            mode={mode}
            id={id}
            detailData={detailData}
            formik={formik}
          />
        )}
        {/* Push Notification(PSH) */}
        {formik.values.psnotchn === "PSH" && (
          <PreviewPushNotification
            mode={mode}
            id={id}
            detailData={detailData}
            formik={formik}
          />
        )}
        {/* Whatsapp(WAP) */}
        {formik.values.psnotchn === "WAP" && (
          <PreviewWhatsappNotification
            mode={mode}
            id={id}
            detailData={detailData}
            formik={formik}
          />
        )}
        <Card className="grid grid-cols-1 gap-6" borderRadius={0}>
          <div className="flex flex-col sm:flex-column gap-3">
            <Text fontSize={"lg"}>Recipients</Text>
            <Box display="flex" flexDir="column" gap={6}>
              <RadioGroup
                name="recipientType"
                value={formik.values.recipientType}
                onChange={(value) =>
                  formik.handleChange({
                    target: { value, name: "recipientType" },
                  })
                }
                isDisabled={true}
              >
                <Stack gap={3} direction="row">
                  {/* <Radio value="SEGMENT">Segment</Radio> */}
                  <Radio value="MANUAL">Manual</Radio>
                </Stack>
              </RadioGroup>
              <Box display="flex" flexDir="column" gap={6}>
                {/* <FormControl
                  id="pssegcde"
                  isInvalid={
                    Boolean(formik.errors.pssegcde) &&
                    Boolean(formik.touched.pssegcde)
                  }
                >
                  <FormLabel>Segment</FormLabel>
                  <Flex direction={"row"} alignItems={"center"}>
                    <Select
                      placeholder="Please Select Segment"
                      value={formik.values.pssegcde}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      pr={1}
                      isDisabled={true}
                    >
                      {Array.isArray(ddlSegment) &&
                        ddlSegment?.map((option: any) => {
                          return (
                            <option
                              key={option.pssegcde}
                              value={option.pssegcde}
                            >
                              {option.pssegdsc}
                            </option>
                          );
                        })}
                    </Select>
                  </Flex>

                  {formik.errors.pssegcde && (
                    <FormErrorMessage>
                      {formik.errors.pssegcde}
                    </FormErrorMessage>
                  )}
                </FormControl> */}
                <Buttons
                  width={"30%"}
                  variant={"outline"}
                  borderColor={Colors.PRIMARY}
                  color={Colors.PRIMARY}
                  buttonText="View Recipients"
                  style={{ alignSelf: "center" }}
                  buttonDefaultType="CUSTOM"
                  buttonHoverBackgroundColor={Colors.PRIMARY}
                  buttonHoverColor={Colors.BACKGROUND}
                  isDisabled={
                    formik.values.recipientType == "SEGMENT" &&
                    formik.values.pssegcde == ""
                      ? true
                      : false
                  }
                  onClick={handlePreview}
                />
              </Box>
            </Box>
          </div>
        </Card>
      </Flex>
      <Flex justifyContent="flex-end" pl={10} pr={10} pt={10}>
        <Box>
          <Space size="small">
            <Buttons buttonDefaultType={"BACK"} onclick={() => router.back()} />
            {mode !== "VIEW" && (
              <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
            )}
          </Space>
        </Box>
      </Flex>
      {/* Modal Dialog */}
      <ModalDialogPopUp
        isOpen={isOpen}
        onClose={onClose}
        size="6xl"
        children={
          <PreviewRecipients id={id} language={formik.values.tabIndex} />
        }
      />
    </>
  );
}
