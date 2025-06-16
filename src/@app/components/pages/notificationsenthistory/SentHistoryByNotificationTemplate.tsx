// Chakra imports
import Colors from "@app/constants/Colors";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Input,
  Select,
  Tooltip,
} from "@chakra-ui/react";
// assets
import React, { ChangeEventHandler, useEffect, useState } from "react";

import { DatePicker, Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import Table from "@app/components/common/Table/Table";
import { IoAdd, IoTrash, IoWarningOutline } from "react-icons/io5";
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
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { BsFillEyeFill, BsPencil, BsSend } from "react-icons/bs";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Buttons from "@app/components/common/Buttons/Buttons";

import useFetchSentHistoriesByTemplate from "@app/hooks/selector/useFetchSentHistoryByTemplate";
import { fetchHistoriesByTemplate } from "@app/redux/notificationSentHistory/slice";

export default function SentHistoryByNotificationTemplatePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const homeData = useAppSelector(selectHome);
  const { sendRequest, loading } = useApi({
    title: "Sent History By Template",
  });
  const type = "";
  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] =
    useFetchSentHistoriesByTemplate();
  const [ddlData] = useFetchDDL({ code: ["NOTCHNL", "NOTCATG"] });

  //pass tableData to table
  // const [pageSize, setPageSize] = useState(10);
  // const [page, setPage] = useState(1);

  const [search, setSearch] = useState();
  const [notificationCode, setNotificationCode] = useState();
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [notType, setNotType] = useState();
  const [notCat, setNotCat] = useState();

  const columns: any[] = [
    {
      title: "Notification Code",
      dataIndex: "psnotcde",
      key: "psnotcde",
    },
    {
      title: "Title",
      dataIndex: "psnotttl",
      key: "psnotttl",
    },
    {
      title: "Type",
      dataIndex: "psnotchndsc",
      key: "psnotchn",
    },
    {
      title: "Category",
      dataIndex: "psnotcatdsc",
      key: "psnotcat",
    },
    {
      title: "Sent At",
      dataIndex: "psnotcmd",
      key: "psnotcmd",
    },
    {
      title: "Total Sent",
      dataIndex: "totalSent",
      key: "totalSent",
      align: "right",
    },
    // {
    //   title: "Total Click",
    //   dataIndex: "pstrctypdsc",
    //   key: "pstrctypdsc",
    // },
    // {
    //   title: "Click Rate",
    //   dataIndex: "pstrctypdsc",
    //   key: "pstrctypdsc",
    // },
    {
      title: "Actions",
      key: "action",
      align: "center",
      width: "5rem",
      render: (_: any, record: any) => (
        <Flex justifyContent="center">
          <Space size="small">
            {homeData?.access &&
              checkAccessMatrix(homeData?.access, accessType.NOTSNDH_VIEW) && (
                <Tooltip label="View" fontSize="sm">
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="teal"
                    sx={{
                      _hover: {
                        backgroundColor: Colors.SUCCESS2,
                        color: Colors.BACKGROUND,
                      },
                    }}
                    //icon={<BsPencil />}
                    icon={<BsFillEyeFill />}
                    aria-label={"view"}
                    onClick={() =>
                      goView(record?.id, record?.psnotchn, record?.psnotcde)
                    }
                  />
                </Tooltip>
              )}
            {/* <TableMenu
              menus={[
                {
                  url: `/maintLogs`,
                  query: {
                    id: record?.psusrunm + " - " + record?.pstrctyp,
                    file: extra.file,
                  },
                  label: "Maint Log",
                  breadcrumbRoute: [
                    {
                      title: "Test Recipient Listing",
                      href: `/testReceiver`,
                    },
                    {
                      title: "Maintenance Log",
                    },
                  ]
                },
              ]}
            /> */}
          </Space>
        </Flex>
      ),
    },
  ];

  function goView(id: string, channel: string, templateCode: string) {
    router.push({
      pathname: "/notificationSentHistory/ByTemplateDetail",
      query: {
        id: id,
        channel: channel,
        templateCode: templateCode,
        mode: "VIEW",
      },
    });
  }

  function searchOnChange(event: any) {
    setSearch(event.target.value);
  }

  function notificationCodeOnChange(event: any) {
    setNotificationCode(event.target.value);
  }

  function fromOnchange(value: any) {
    setFrom(value);
  }

  function toOnchange(value: any) {
    setTo(value);
  }

  function notificationTypeOnchange(event: any) {
    setNotType(event.target.value);
  }

  function notificationCategoryOnchange(event: any) {
    setNotCat(event.target.value);
  }

  return (
    <>
      <Box>
        <Card p={4} mt={5}>
          <Flex bgColor="#fff" justifyContent={"space-between"} pb={3}>
            <Box
              pr={{
                base: 0,
                md: Spacing.containerPx,
              }}
              display="flex"
            >
              <Space size="middle">
                <Input
                  type="text"
                  name="psnotcde "
                  onChange={notificationCodeOnChange}
                  placeholder="Notification Code"
                  value={notificationCode}
                />
                <Input
                  type="text"
                  name="search"
                  onChange={searchOnChange}
                  placeholder="Title"
                  value={search}
                />
                <DatePicker
                  id="from"
                  name="from"
                  placeholder="From Date"
                  className="w-full"
                  format={"DD/MM/YYYY"}
                  value={from}
                  onChange={fromOnchange}
                />
                <DatePicker
                  id="to"
                  name="to"
                  placeholder="To Date"
                  className="w-full"
                  format={"DD/MM/YYYY"}
                  value={to}
                  onChange={toOnchange}
                />
                <Select
                  name="notType"
                  onChange={notificationTypeOnchange}
                  placeholder="Please Select Type"
                  value={notType}
                >
                  {ddlData?.NOTCHNL?.map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                <Select
                  name="notCat"
                  onChange={notificationCategoryOnchange}
                  placeholder="Please Select Category"
                  value={notCat}
                >
                  {ddlData?.NOTCATG?.filter(
                    (item: DDL_TYPES) => item.prgecode !== "INS"
                  ).map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
              </Space>
            </Box>
          </Flex>
          <Table
            rowKey="id"
            columns={columns}
            data={tableData}
            refreshFn={fetchHistoriesByTemplate}
            totalRecords={totalRecords}
            extraParams={{
              search: search,
              from_date: from,
              to_date: to,
              psnotcde: notificationCode,
              psnotchn: notType,
              psnotcat: notCat,
            }}
          />
        </Card>
      </Box>
    </>
  );
}
