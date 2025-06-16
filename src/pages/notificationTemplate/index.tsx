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
import { BsPencil } from "react-icons/bs";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Buttons from "@app/components/common/Buttons/Buttons";
import useFetchNotificationTemplates from "@app/hooks/selector/useFetchNotificationTemplates";
import {
  fetchNotificationTemplates,
  getRemoveNotificationTemplate,
} from "@app/redux/notificationtemplate/slice";

export default function NotificationTemplatePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const homeData = useAppSelector(selectHome);
  const { sendRequest, loading } = useApi({ title: "Notification Template" });

  //sample code how to use this hook
  //const [tableData, refreshFn, totalRecords, extra] = useFetchAdminAccounts();
  const [tableData, refreshFn, totalRecords, extra] =
    useFetchNotificationTemplates();
  const [ddlData] = useFetchDDL({ code: ["NOTCHNL", "NOTCATG", "YESORNO"] });
  //pass tableData to table
  // const [pageSize, setPageSize] = useState(10);
  // const [page, setPage] = useState(1);

  const [search, setSearch] = useState();
  const [notType, setNotType] = useState();
  const [notStatus, setNotStatus] = useState();
  const [notCat, setNotCat] = useState();

  const columns: any[] = [
    {
      title: "Notification Code",
      dataIndex: "psnotcde",
      key: "psnotcde",
      // render: (_: any, record: any) => (
      //   <Link color={Colors.PRIMARY} textDecoration={"underline"} onClick={() => goView(record?.id)}>{record?.psusrunm}</Link>
      // )
    },
    {
      title: "Description",
      dataIndex: "psnotdsc",
      key: "psnotdsc",
    },
    {
      title: "Type",
      dataIndex: "psnotchndsc",
      key: "psnotchndsc",
    },
    {
      title: "Category",
      dataIndex: "psnotcatdsc",
      key: "psnotcatdsc",
    },
    {
      title: "Status",
      dataIndex: "psnotistdsc",
      key: "psnotistdsc",
      render: (_: string, record: any) =>
        record?.psnotist === "Y" ? (
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
        <Flex justifyContent="flex-end">
          <Space size="small">
            {homeData?.access &&
              checkAccessMatrix(homeData?.access, accessType.NOT_EDIT) && (
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
                    onClick={() => goEdit(record?.psnotcde, record?.psnotchn)}
                  />
                </Tooltip>
              )}
            {homeData?.access &&
              checkAccessMatrix(homeData?.access, accessType.NOT_DEL) && (
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
                        record?.psnotcde,
                        record?.psnotchn,
                        record?.psnotdsc
                      )
                    }
                  />
                </Tooltip>
              )}
            <TableMenu
              menus={[
                // homeData?.access &&
                //   checkAccessMatrix(homeData?.access, accessType.NOT_EDIT) && {
                //     label: "Notification Schedule Detail",
                //     url: `/notificationScheduleDetail`,
                //     query: {
                //       id: record?.psnotcde,
                //       id2: record?.psnotchn,
                //       desc: record?.psnotdsc,
                //     },
                //     breadcrumbRoute: [
                //       {
                //         title: "Notification Template",
                //         href: `/notificationTemplate`,
                //       },
                //       {
                //         title: "Notification Schedule Detail",
                //       },
                //     ],
                //   },
                {
                  url: `/maintLogs`,
                  query: {
                    id: record?.psnotcde + "-" + record?.psnotchn,
                    file: extra.file,
                  },
                  label: "Maint Log",
                  breadcrumbRoute: [
                    {
                      title: "Notification Template",
                      href: `/notificationTemplate`,
                    },
                    {
                      title: "Maintenance Log",
                    },
                  ],
                },
              ]}
            />
          </Space>
        </Flex>
      ),
    },
  ];

  function alertRemove(id: string, id2: string, desc: string) {
    dispatch(
      openGlobalModal({
        title: "Delete Record",
        message: RemoveDetail(id, desc),
        status: "warning",
        actions: [
          {
            title: "Confirm",
            onClick: () => onRemove(id, id2),
          },
          {
            title: "Cancel",
            isClose: true,
            props: {
              variant: "danger",
            },
          },
        ],
      })
    );
  }

  async function onRemove(id: string, id2: string) {
    const { success } = await sendRequest({
      fn: getRemoveNotificationTemplate({ psnotcde: id, psnotchn: id2 }),
    });

    if (success) {
      dispatch(refreshTable());
      setTimeout(() => {
        showModal(dispatch, {
          title: "Delete Record",
          message: "Record Deleted",
        });
      }, 200);
    }
  }

  function goAdd() {
    router.push({
      pathname: "/notificationTemplate/Detail",
      query: {
        id: "",
        mode: "ADD",
      },
    });
  }

  function goEdit(id: string, id2: string) {
    router.push({
      pathname: "/notificationTemplate/Detail",
      query: {
        id: id,
        id2: id2,
        mode: "EDIT",
      },
    });
  }

  function searchOnChange(event: any) {
    setSearch(event.target.value);
  }

  function notificationTypeOnchange(event: any) {
    setNotType(event.target.value);
  }

  function notificationStatusOnchange(event: any) {
    setNotStatus(event.target.value);
  }

  function notificationCategoryOnchange(event: any) {
    setNotCat(event.target.value);
  }

  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="500" mb={1}>
              Notification Template
            </Text>
            <Breadcrumbs
              breadcrumbItems={[
                {
                  title: "Notification Template",
                },
              ]}
            />
          </Flex>
          <Box
            display={"flex"}
            alignSelf={"center"}
            pr={{
              base: 0,
              md: Spacing.containerPx,
            }}
          >
            {homeData?.access &&
              checkAccessMatrix(homeData?.access, accessType.NOT_ADD) && (
                <Buttons buttonDefaultType={"ADD"} onclick={() => goAdd()} />
              )}
          </Box>
        </Flex>
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
                  name="search"
                  onChange={searchOnChange}
                  placeholder="Search"
                  value={search}
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
                  name="notCat"
                  onChange={notificationCategoryOnchange}
                  placeholder="Please Select Notification Category"
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
                <Select
                  name="notStatus"
                  onChange={notificationStatusOnchange}
                  placeholder="Please Select Notification Status"
                  value={notStatus}
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
            rowKey="psnotcde"
            columns={columns}
            data={tableData}
            refreshFn={fetchNotificationTemplates}
            totalRecords={totalRecords}
            extraParams={{
              search: search,
              psnotchn: notType,
              psnotist: notStatus,
              psnotcat: notCat,
            }}
          />
        </Card>
      </Box>
    </>
  );
}

const RemoveDetail = (item: string, itemDesc: string) => {
  return (
    <Box w={"100%"} display="flex" flexDirection="column" alignItems="center">
      {/* <Icon as={IoWarningOutline} w={150} h={150} color={Colors.DANGER}/> */}
      <Text p={3}>Are you sure to delete this record?</Text>
      <Text>
        {item} - {itemDesc}
      </Text>
    </Box>
  );
};
