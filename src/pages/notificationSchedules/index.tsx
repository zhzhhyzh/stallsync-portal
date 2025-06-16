// Chakra imports
import {
  Box,
  Flex,
  Text,
  Input,
  Select,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
// assets
import React, { useState } from "react";
import { DatePicker, Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";
import Card from "@app/components/common/Card/Card";
import Table from "@app/components/common/Table/Table";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import useFetchSchedules from "@app/hooks/selector/useFetchSchedules";
import {
  fetchSchedules,
  removeSchedule,
} from "@app/redux/notificationsheduledetail/slice";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import {
  openGlobalModal,
  refreshTable,
  selectHome,
} from "@app/redux/app/slice";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import { BsFillEyeFill, BsPencil } from "react-icons/bs";
import Colors from "@app/constants/Colors";
import { IoTrash } from "react-icons/io5";
import { showModal } from "@app/helpers/modalHelper";
import { MdLockReset } from "react-icons/md";

export default function NotificationSchedulePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sendRequest, loading } = useApi({ title: "Notification Schedule" });
  const homeData = useAppSelector(selectHome);

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] = useFetchSchedules();
  const [ddlData] = useFetchDDL({ code: ["NOTCHNL", "YESORNO"] });
  //pass tableData to table
  // const [pageSize, setPageSize] = useState(10);
  // const [page, setPage] = useState(1);

  const [search, setSearch] = useState();
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [notType, setNotType] = useState();
  const [status, setStatus] = useState();

  const columns: any[] = [
    // {
    //   title: "Status",
    //   dataIndex: "psschinddsc",
    //   key: "psschinddsc",
    //   // render: (_: any, record: any) => (
    //   //   <Link color={Colors.PRIMARY} textDecoration={"underline"} onClick={() => goView(record?.id)}>{record?.psusrunm}</Link>
    //   // )
    // },
    {
      title: "Notification Type",
      dataIndex: "psnotchndsc",
      key: "psnotchndsc",
    },
    {
      title: "Notification Template",
      dataIndex: "psnotcde",
      key: "psnotcde",
      render: (_: any, record: any) => {
        if (_ == "") {
          return <Text>-</Text>;
        } else {
          return <Text>{`${record.psnotcde} - ${record.psnotcdedsc}`}</Text>;
        }
      },
    },
    {
      title: "Notification Title",
      dataIndex: "psmsgttl",
      key: "psmsgttl",
    },
    {
      title: "Scheduled At",
      dataIndex: "psschstd",
      key: "psschstd",
    },
    {
      title: "Active",
      dataIndex: "psschsts",
      key: "psschsts",
      render: (_: any) =>
        _ === "Y" ? (
          <Text
            fontWeight={"normal"}
            color={"white"}
            textAlign="center"
            style={{
              width: 40,
              height: 20,
              backgroundColor: Colors.SUCCESS,
              borderRadius: 10,
            }}
          >
            Yes
          </Text>
        ) : (
          <Text
            fontWeight={"normal"}
            color={"white"}
            textAlign="center"
            style={{
              width: 40,
              height: 20,
              backgroundColor: Colors.DANGER,
              borderRadius: 10,
            }}
          >
            No
          </Text>
        ),
    },
    {
      title: "Actions",
      key: "action",
      align: "center",
      width: "10rem",
      render: (_: any, record: any) => (
        <Flex justifyContent="center">
          <Space size="small">
            {/* {homeData?.access &&
              checkAccessMatrix(homeData?.access, accessType.NOTSCHED_VIEW) && (
                <>
                  {record.psschind === "C" && (
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
                        icon={<BsFillEyeFill />}
                        aria-label={"view"}
                        onClick={() => goView(record?.id)}
                      />
                    </Tooltip>
                  )}
                </>
              )} */}
            {homeData?.access &&
              checkAccessMatrix(homeData?.access, accessType.NOTSCHED_EDIT) && (
                <>
                  <Tooltip label="Edit" fontSize="sm">
                    <IconButton
                      variant="outline"
                      size={"sm"}
                      borderRadius={2}
                      colorScheme="blue"
                      sx={{
                        _hover: {
                          backgroundColor: Colors.PRIMARY,
                          color: Colors.BACKGROUND,
                        },
                      }}
                      icon={<BsPencil />}
                      aria-label={"edit"}
                      onClick={() => goEdit(record?.id)}
                    />
                  </Tooltip>
                </>
              )}
            {homeData?.access &&
              checkAccessMatrix(homeData?.access, accessType.NOTSCHED_DEL) && (
                <Tooltip label="Delete" fontSize="sm">
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="red"
                    sx={{
                      _hover: {
                        backgroundColor: Colors.DANGER,
                        color: Colors.BACKGROUND,
                      },
                    }}
                    icon={<IoTrash />}
                    aria-label={"delete"}
                    onClick={() =>
                      alertRemove(
                        record?.id,
                        record?.psnotchndsc,
                        record?.psmsgttl
                      )
                    }
                  />
                </Tooltip>
              )}
          </Space>
        </Flex>
      ),
    },
  ];

  function searchOnChange(event: any) {
    setSearch(event.target.value);
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

  function statusOnchange(event: any) {
    setStatus(event.target.value);
  }

  function goEdit(id: string) {
    router.push({
      pathname: "/notificationSchedules/Detail",
      query: {
        id: id,
        mode: "EDIT",
      },
    });
  }

  function goView(id: string) {
    router.push({
      pathname: "/notificationSchedules/Detail",
      query: {
        id,
        mode: "VIEW",
      },
    });
  }

  function alertRemove(id: string, channelDesc: string, title: string) {
    dispatch(
      openGlobalModal({
        title: "Delete Record",
        message: RemoveDetail(id, channelDesc, title),
        status: "warning",
        actions: [
          {
            title: "Confirm",
            onClick: () => {
              onRemove(id);
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

  async function onRemove(id: string) {
    const { success } = await sendRequest({
      fn: removeSchedule({ id }),
    });
    if (success) {
      setTimeout(() => {
        dispatch(refreshTable());
        showModal(dispatch, {
          title: "Delete Record",
          message: "Record Deleted",
        });
      }, 200);
    }
  }

  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="500" mb={1}>
              Scheduled Notification Listing
            </Text>
            <Breadcrumbs
              breadcrumbItems={[
                {
                  title: "Scheduled Notification Listing",
                },
              ]}
            />
          </Flex>
        </Flex>
        <Card p={1} mt={4}>
          <Flex bgColor="#fff" justifyContent={"space-between"} p={3}>
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
                  name="search"
                  onChange={searchOnChange}
                  placeholder="Search"
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
                  placeholder="Please Select Notification Type"
                  value={notType}
                >
                  {ddlData?.NOTCHNL?.map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                <Select
                  name="status"
                  onChange={statusOnchange}
                  placeholder="Please Select Status"
                  value={status}
                >
                  {ddlData?.YESORNO?.map((option: DDL_TYPES) => (
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
            refreshFn={fetchSchedules}
            totalRecords={totalRecords}
            extraParams={{
              search: search,
              from: from,
              to: to,
              psnotchn: notType,
              psschsts: status,
            }}
            //onDoubleClick={showInfo}
            //length={pageSize}
          />
        </Card>
      </Box>
    </>
  );
}

const RemoveDetail = (id: string, desc: string, title: string) => {
  return (
    <Box w={"100%"} display="flex" flexDirection="column" alignItems="center">
      {/* <Icon as={IoWarningOutline} w={150} h={150} color={Colors.DANGER}/> */}
      <Text p={3}>Are you sure to delete this record?</Text>
      <Text>
        {"(" + desc + ")"} {title}
      </Text>
    </Box>
  );
};
