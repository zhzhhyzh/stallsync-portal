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
import Form from "@app/components/forms/omnisendReportForm/ReportForm";
import axios from "axios";
import { DatePicker, Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";
import path from "path";
import Card from "@app/components/common/Card/Card";

import { formatDate } from "@app/utils/DateUtils";
import Table from "@app/components/common/Table/Table";
import { IoAdd, IoDownload, IoTrash, IoWarningOutline } from "react-icons/io5";
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
import ReportForm from "@app/components/forms/omnisendReportForm/ReportForm";
import { fetchReports, fetchDownloadReport } from "@app/redux/reports/slice";
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
      title: "Actions",
      key: "action",
      align: "center",
      width: "10rem",
      render: (_: any, record: any) => (
        <Flex justifyContent="center">
          <Space size="middle">
            {/* <IconButton
              // colorScheme={"blue"}
              icon={<AiFillEye />}
              aria-label={"view"}
              onClick={() => showInfo(record)}
            /> */}
            {/* {homeData?.access &&
              checkAccessMatrix(homeData?.access, accessType.RPT_DOWNLOAD) && */}
        {

             record?.prrptsts === "C" && (
              <Tooltip label='Download' fontSize='sm'>
              <IconButton
                variant="outline"
                size={"sm"}
                borderRadius={2}
                colorScheme="blue"
                sx={{ _hover: { backgroundColor: Colors.PRIMARY, color: Colors.BACKGROUND } }}
                icon={<IoDownload />}
                aria-label={"edit"}
                onClick={() => goDownload(record?.prrptnme)}
              />
            </Tooltip>
              )}
          </Space>
        </Flex>
      ),
    },
  ];

  // function showInfo(record: any, index: number) {
  //   dispatch(
  //     openGlobalModal({
  //       title: "Admin Account Detail",
  //       status: "custom",
  //       message: <ShowDetail data={record} />,
  //     })
  //   );
  // }

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

// const ShowDetail = ({ data }: { data: any }) => (
//   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
//     <div className="">
//       <Text fontSize="sm" color={Colors.GRAY}>
//         User ID
//       </Text>
//       <Text>{data?.id}</Text>
//     </div>
//     <div className="">
//       <Text fontSize="sm" color={Colors.GRAY}>
//         Name
//       </Text>
//       <Text>{data?.psusrnam}</Text>
//     </div>
//     <div className="">
//       <Text fontSize="sm" color={Colors.GRAY}>
//         Role
//       </Text>
//       <Text>{data?.psusrtypdsc}</Text>
//     </div>
//     <div className="">
//       <Text fontSize="sm" color={Colors.GRAY}>
//         Status
//       </Text>
//       <Text>{data?.psusrstsdsc}</Text>
//     </div>
//     <div className="">
//       <Text fontSize="sm" color={Colors.GRAY}>
//         Email
//       </Text>
//       <Text>{data?.psusreml}</Text>
//     </div>
//     <div className="">
//       <Text fontSize="sm" color={Colors.GRAY}>
//         Phone no.
//       </Text>
//       <Text>{data?.psusrphn}</Text>
//     </div>
//   </div>
// );

const RemoveDetail = () => (
  <Box w={"100%"} display="flex" flexDirection="column" alignItems="center">
    <Icon as={IoWarningOutline} w={150} h={150} color={Colors.DANGER} />
    <Text p={3}>Are you sure to remove this item?</Text>
  </Box>
);
