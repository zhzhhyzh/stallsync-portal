// Chakra imports
import { Box, Flex, Text, Tabs, TabList, Tab } from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";

import { DatePicker, Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import Table from "@app/components/common/Table/Table";

import { useAppSelector } from "@app/hooks/useRedux";
import {
  fetchMaintlogs,
  fetchSubFileMaintlogs,
  selectBreadcrumbInfo,
} from "@app/redux/app/slice";

import { useRouter } from "next/router";
import useFetchMaintLogs from "@app/hooks/selector/useFetchMaintLogs";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import useFetchSubMaintLogs from "@app/hooks/selector/useFetchSubMaintLogs";
import SubHeader from "@app/components/common/Header/SubHeader";
import CustomTabs from "@app/components/common/Tabs/CustomTabs";

export default function MaintLogsPage() {
  const router = useRouter();
  const breadcrumbInfo = useAppSelector(selectBreadcrumbInfo);
  // const [pageSize, setPageSize] = useState(10);
  // const [page, setPage] = useState(1);

  const fileName = String(router.query?.file);
  const id = String(router.query?.id);
  const datee = String(router.query?.date)

  const [tableData, extra, refreshFn, totalData, tableLoading] =
    useFetchMaintLogs({});

  const [subTableData, subRefreshFn, subTotalData, subTableLoading] =
    useFetchSubMaintLogs({});

  const [logfile, setLogfile] = useState(fileName);
  const [tabIndex, setTabIndex] = useState(0);
  const [fileNameDisplay, setFileNameDisplay] = useState("");

  useEffect(() => {
    if (fileName !== "undefined") setLogfile(fileName);
  }, [fileName]);

  useEffect(() => {
    if (tabIndex && tabIndex !== 0) {
      setFileNameDisplay(extra?.sub_files[tabIndex - 1]?.description);
    } else {
      setFileNameDisplay(extra?.main_file?.description);
    }
  }, [tabIndex]);

  useEffect(() => {
    if (extra?.main_file?.description) {
      setFileNameDisplay(extra?.main_file?.description);
    }
  }, [extra])

  const columns: any[] = [
    {
      title: "Field",
      dataIndex: "prfieldnme",
      key: "prfieldnme",
    },
    {
      title: "Previous Data",
      dataIndex: "prfldolddta",
      key: "prfldolddta",
      width: "400px",
      render: (_: any, record: any) => (
        <Text style={{ whiteSpace: "break-spaces" }}>{_}</Text>
      ),
    },
    {
      title: "New Data",
      dataIndex: "prfldnewdta",
      key: "prfldnewdta",
      width: "400px",
      render: (_: any, record: any) => (
        <Text style={{ whiteSpace: "break-spaces" }}>{_}</Text>
      ),
    },
    {
      title: "Action Data",
      dataIndex: "praction",
      key: "praction",
      render: (data: any) => {
        switch (data) {
          case "A":
            return <span className="text-green">ADD</span>;
          case "C":
            return <span className="text-yellow">CHANGE</span>;
          case "D":
            return <span className="text-red">DELETE</span>;
          default:
            return <span>N/A</span>;
        }
      },
    },
    {
      title: "User",
      dataIndex: "prmntusr",
      key: "prmntusr",
    },
    {
      title: "Date",
      dataIndex: "updatedAt",
      key: "updatedAt",
    },
  ];
  const generateKeyText = (keyList: any) => {
    return (
      <>
        {Array.isArray(keyList) &&
          keyList.map((items: any, index: number) => {
            return (
              <Text>
                {items.name}: {items.value}
              </Text>
            );
          })}
      </>
    );
  };

  const allKeyText = <>{generateKeyText(extra?.key_list)}</>;

  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="500" mb={1}>
              Maintenance Logs
            </Text>
            <Breadcrumbs breadcrumbItems={breadcrumbInfo} />
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
                buttonDefaultType={"BACK"}
                onclick={() => router.back()}
              />
            </Space>
          </Box>
        </Flex>

        <Card p={0} mt={4} mb={4}>
          <Flex flexDir={"column"} p={5}>
            {/* <Text fontWeight={"semibold"} pb={3}>
              Maintenance Log Infomation
            </Text> */}
            <SubHeader labelText="Maintenance Log Infomation" />
            <Text>File Name: {fileNameDisplay || "-"}</Text>
            <Text>Date: {datee}</Text>
            {/* {allKeyText} */}

          </Flex>
        </Card>

        <Tabs onChange={(index) => setTabIndex(index)}>
          <Flex
            bgColor="#fff"
            justifyContent={"space-between"}
            alignItems={"center"}
            gap={5}
            borderRadius={5}
          >
            <TabList border={0} w="100vw">
              <CustomTabs index={0} label={extra?.main_file && Object.keys(extra?.main_file).length > 0 ? extra?.main_file?.description : "Main"} selectedTabIndex={tabIndex}  onClick={() => {
      setTabIndex(0);
      setLogfile(extra?.main_file?.file); // Set log file for main tab
    }} />
              {/* <Tab
                key={`maintlog-tab-Main`}
                ml={{
                  base: 0,
                  md: "5px",
                }}
                py={3}
                onClick={() => setLogfile(fileName)}
                whiteSpace={"nowrap"}
                fontWeight={"medium"}
                paddingBottom={"3px"}
                borderBottomWidth={2}

              >
                {extra?.main_file && Object.keys(extra?.main_file).length > 0 ? extra?.main_file?.description : "Main"}
              </Tab> */}
              {extra?.sub_files?.map((items: any, index: number) => (
                // <Tab
                //   key={`maintlog-tab-${items.file}`}
                //   ml={
                //     index > 0
                //       ? {}
                //       : {
                //           base: "0",
                //           md: "5px",
                //         }
                //   }
                //   py={3}
                //   onClick={() => setLogfile(items.file)}
                //   whiteSpace={"nowrap"}
                //   fontWeight={"medium"}
                //   paddingBottom={"3px"}
                // borderBottomWidth={2}

                // >
                //   {items.description}
                // </Tab>
                <CustomTabs index={index + 1} label={items.description} selectedTabIndex={tabIndex} onClick={() => {
                  setTabIndex(index + 1);
                  setLogfile(items.file);
                }}
                />

              ))}
            </TabList>
          </Flex>
        </Tabs>

        <Card p={0} mt={4}>
          {id !== "undefined" &&
            logfile !== "undefined" &&
            (tabIndex !== 0 ? (
              <Table
                // rowKey="id"
                columns={columns}
                data={subTableData}
                refreshFn={fetchSubFileMaintlogs}
                extraParams={{
                  file: logfile,
                  key: id,
                }}
                totalRecords={subTotalData}
              />
            ) : (
              <Table
                // rowKey="id"
                columns={columns}
                data={tableData}
                refreshFn={fetchMaintlogs}
                extraParams={{
                  file: logfile,
                  key: id,
                }}
                totalRecords={totalData}
              />
            ))}
        </Card>
      </Box>
    </>
  );
}
