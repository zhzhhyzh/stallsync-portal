// Chakra imports
import Colors from "@app/constants/Colors";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Input,
  Heading,
  Button,
  Select,
  Link,
  Icon,
  FormLabel,
  FormControl,
  FormErrorMessage,
  Tooltip,
} from "@chakra-ui/react";
// assets
import { API_ROUTES } from "@app/routes/apis";

import React, { ChangeEventHandler, useEffect, useState } from "react";
import axios from "axios";
import { DatePicker, Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";
import path from "path";
import Card from "@app/components/common/Card/Card";

import { formatDate } from "@app/utils/DateUtils";
import Table from "@app/components/common/Table/Table";
import { IoAdd, IoBarChartOutline, IoDownload, IoTrash, IoTrendingUpOutline, IoWarningOutline } from "react-icons/io5";
import { FiMoreVertical } from "react-icons/fi";
import { AiFillEye } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal, selectHome } from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import useFetchReports from "@app/hooks/selector/useFetchReports";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { BsDownload, BsPencil } from "react-icons/bs";
import ReportForm from "@app/components/forms/Report/ReportForm";
import { fetchReports, fetchDownloadReport, fetchForecast } from "@app/redux/reports/slice";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";

export default function ReportPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sendRequest, loading } = useApi({ title: "Omnisend Reports" });
  const homeData = useAppSelector(selectHome);

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] = useFetchReports();
  const [ddlData] = useFetchDDL({ code: ["RPTTYPE"] });
  //pass tableData to table
  // const [pageSize, setPageSize] = useState(10);
  // const [page, setPage] = useState(1);
  const [dateError, setDateError] = useState(false);

  const [search, setSearch] = useState();
  const [status, setStatus] = useState();

  const [tempFromDate, setTempFromDate] = useState<any>();
  const [tempToDate, setTempToDate] = useState<any>();
  useEffect(() => {
    if (tempToDate && tempFromDate && tempToDate < tempFromDate)
      setDateError(true);
    else setDateError(false);
  }, [tempFromDate, tempToDate]);

  const columns: any[] = [
    {
      title: "Report Name",
      dataIndex: "prrptnme",
      key: "prrptnme",
    },
    // {
    //   title: "Report Type",
    //   dataIndex: "prrpttyp",
    //   key: "prrpttyp",
    //   render: (_: any, record: any) => (
    //     <>
    //       {record?.prrpttyp} - {record?.prrpttypdsc}
    //     </>
    //   ),
    // },
    {
      title: "Status",
      dataIndex: "prrptstsdsc",
      key: "prrptstsdsc",
    },
    {
      title: "Report Generated Date",
      dataIndex: "prrptgdt",
      key: "prrptgdt",
    },
    {
      title: "Merchant",
      dataIndex: "prrptmch",
      key: "prrptmch",
      render: (_: any, record: any) => (
        <>
          {record?.psrptmch} - {record?.psrptmchdsc}
        </>
      ),
    },
    {
      title: "Actions",
      key: "action",
      align: "center",
      width: "10rem",
      render: (_: any, record: any) => (
        <Flex justifyContent="center">
          <Space size="middle">

            {

              record?.prrptsts === "C" && (
                <Tooltip label='Download' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="yellow"
                    sx={{ _hover: { backgroundColor: Colors.PRIMARY, color: Colors.BACKGROUND } }}
                    icon={<IoDownload />}
                    aria-label={"edit"}
                    onClick={() => goDownload(record?.prrptnme)}
                  />
                </Tooltip>
              )}
            {

              record?.prrptsts === "C" && record?.prrptfcs == "N" && (
                <Tooltip label='Forecast Sales' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="yellow"
                    sx={{ _hover: { backgroundColor: Colors.PRIMARY, color: Colors.BACKGROUND } }}
                    icon={<IoTrendingUpOutline />}
                    aria-label={"edit"}
                    onClick={() => alertForecast(record?.prrptnme, "S")}
                  />
                </Tooltip>
              )}
            {

              record?.prrptsts === "C" && record?.prrptfco == "N" && (
                <Tooltip label='Forecast Order Counts' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="yellow"
                    sx={{ _hover: { backgroundColor: Colors.PRIMARY, color: Colors.BACKGROUND } }}
                    icon={<IoBarChartOutline />}
                    aria-label={"edit"}
                    onClick={() => alertForecast(record?.prrptnme, "O")}
                  />
                </Tooltip>
              )}
            {

              record?.prrptsts === "C" && (record?.prrptfcs == "Y" || record?.prrptfco == "Y") && (
                <TableMenu menus={[
                  {
                    url: `/report/forecast`,
                    query: {
                      prrptnme: record?.prrptnme,
                      prrptfco: record?.prrptfco,
                      prrptfcs: record?.prrptfcs,
                    },
                    label: "Forecast",
                  },
                ]} />
              )}

          </Space>
        </Flex>
      ),
    },
  ];

  function alertForecast(prrptnme: string, forecast_type: string) {

    dispatch(
      openGlobalModal({
        title: "",
        message: ForecastDetail(prrptnme, forecast_type),
        status: "warning",
        actions: [
          {
            title: "Confirm",
            onClick: async () => {
              try {
                const result = await dispatch(fetchForecast({ prrptnme, forecast_type })).unwrap();

                if (result?.result === "success") {
                  dispatch(
                    openGlobalModal({
                      title: "Forecast Triggered",
                      message: `${forecast_type === "O" ? "Order Count Forecast" : "Sales Forecast"} successfully initiated for ${prrptnme}.`,
                      status: "success",
                      actions: [
                        {
                          title: "OK",
                          isClose: true,
                        },
                      ],
                    })
                  );
                } else {
                  throw new Error("Unexpected response");
                }
              } catch (err) {
                console.error("Error triggering forecast:", err);
                dispatch(
                  openGlobalModal({
                    title: "Error",
                    message: "Something went wrong while triggering the forecast.",
                    status: "error",
                    actions: [
                      {
                        title: "Close",
                        isClose: true,
                      },
                    ],
                  })
                );
              }
            },
          },
          {
            title: "Cancel",
            isClose: true,
          },
        ],
      })
    );
  }

  async function goDownload(filename: string) {
    var fileDownload = require("js-file-download");
    let accessToken = localStorage.getItem("AUTH_TOKEN");
    // console.log(params)
    return (
      axios
        .get(
          process.env.NEXT_PUBLIC_API_URL + "/" + API_ROUTES.REPORT_DOWNLOAD,
          {
            headers: {
              Authorization: `${accessToken}`,
              Locale: "en",
              "api-key": process.env.NEXT_PUBLIC_API_KEY,
            },
            // mode: "no-cors",
            withCredentials: true,
            params: {
              filename,
              t: new Date().getTime(),
            },
            timeout: 2000,
            responseType: "blob", // Important
          }
        )

        // return axios({
        //   // method: "GET",
        //   url: process.env.NEXT_PUBLIC_API_URL + "/" + API_ROUTES.REPORT_DOWNLOAD,
        //   headers: {
        //     Authorization: `${accessToken}`,
        //     Locale: "en",
        //     "api-key": constants.API_KEY,
        //   },
        //   mode: "no-cors",
        //   withCredentials: true,
        //   params,
        //   timeout: 2000,
        //   responseType: "blob", // Important
        // })
        .then((response) => response)
        .then((result) => {
          if (result.data) {
            fileDownload(result.data, filename || new Date().getTime());
          } else {
            // swal("Download", "File not found!", "warning");
          }
        })
        .catch((error) => {
          if (error.message === "t" || error.message === "Network Error") {
            throw {
              message: error.message,
            };
          }
          throw error.response;
        })
    );
  }

  function searchOnChange(event: any) {
    setSearch(event.target.value);
  }

  function statusOnchange(event: any) {
    setStatus(event.target.value);
  }

  return (
    <>
      <Flex direction={"column"} alignSelf={"center"} pl={4} py={Spacing.gap}>
        <Text fontSize={"3xl"} fontWeight="500" mb={1}>
          Reporting
        </Text>
        <Breadcrumbs
          breadcrumbItems={[
            {
              title: "Reporting",
            },
          ]}
        />
      </Flex>

      <ReportForm reportType={status} />
      <Flex
        mt={Spacing.gap}
        // mx={"-20px"}
        bgColor="#fff"
        justifyContent={"space-between"}
        p={3}
      >
        <Box
          pr={{
            base: 0,
            md: Spacing.containerPx,
          }}
          display="flex"
        >
          <Space size="middle">
            {/* <Select
              name="prrpttyp"
              onChange={statusOnchange}
              placeholder="Please Select Report Type"
              value={status}
            >
              {ddlData?.RPTTYPE?.map((option: DDL_TYPES) => (
                <option key={option.prgecode} value={option.prgecode}>
                  {option.prgedesc}
                </option>
              ))}
            </Select> */}
            <Box display="flex" flexDir={"row"} gap={4} alignItems={"center"}>
              <Text minW={"35%"}>From Date</Text>

              <DatePicker
                format="DD/MM/YYYY"
                className="w-full"
                placeholder="From Date"
                onChange={(d) => {
                  // @ts-ignore
                  // if (new Date(formatDate(d)) instanceof Date && !isNaN(new Date(formatDate(d)))) setTempFromDate(formatDate(d))
                  // else setTempFromDate("")
                  setTempFromDate(d);
                }}
                value={tempFromDate}
              />
              {/* <RangePicker style={{ width: '100%' }} placeholder={['From Date', 'To Date']} /> */}
            </Box>
            <FormControl isInvalid={dateError}>
              <Box display="flex" flexDir="column">
                <Box
                  display="flex"
                  flexDir={"row"}
                  gap={4}
                  alignItems={"center"}
                >
                  <Text minW={"35%"}>To Date</Text>

                  <DatePicker
                    format="DD/MM/YYYY"
                    className="w-full"
                    placeholder="To Date"
                    onChange={(d) => {
                      // @ts-ignore
                      // if (new Date(formatDate(d)) instanceof Date && !isNaN(new Date(formatDate(d)))) setTempToDate(formatDate(d))
                      // else setTempToDate("")

                      setTempToDate(d);
                    }}
                    value={tempToDate}
                  />
                </Box>
                {dateError && (
                  <FormErrorMessage>
                    {"From Date cannot be greater than To Date"}
                  </FormErrorMessage>
                )}
              </Box>
            </FormControl>
          </Space>
        </Box>
      </Flex>
      <Box>
        <Card p={0}>
          <Table
            columns={columns}
            data={tableData}
            refreshFn={fetchReports}
            totalRecords={totalRecords}
            extraParams={{
              prrpttyp: status,
              fromDate: tempFromDate && new Date(tempFromDate),
              toDate: tempToDate && new Date(tempToDate),
            }}
          />
        </Card>
      </Box>
    </>
  );
}

const ForecastDetail = (item: string, itemDesc: string) => {
  return (
    <Box w={"100%"} display="flex" flexDirection="column" alignItems="center">
      {/* <Icon as={IoWarningOutline} w={150} h={150} color={Colors.DANGER}/> */}
      <Text p={3}>It will spends time to forecast the result.</Text>
      <Text>{item} - {itemDesc == "O" ? "Order Counts Forecasting" : "Sales Forecasting"}</Text>
    </Box>
  )
};
