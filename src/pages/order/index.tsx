// Chakra imports
import Colors from "@app/constants/Colors";
import {
  Box,
  Flex,
  Text,
  IconButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Heading,
  Button,
  Select,
  Link,
  Icon,
  Tooltip,
} from "@chakra-ui/react";
// assets
import React, { ChangeEventHandler, useEffect, useState } from "react";

import { DatePicker, Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { formatDate } from "@app/utils/DateUtils";
import Table from "@app/components/common/Table/Table";
import { IoAdd, IoTrash, IoWarningOutline } from "react-icons/io5";
import { FiMoreVertical } from "react-icons/fi";
import { AiFillEye } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal, refreshTable, selectHome } from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import useFetchOrders from "@app/hooks/selector/useFetchOrders";
import {
  fetchOrders,

} from "@app/redux/order/slice";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { BsPencil } from "react-icons/bs";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { MdLockReset } from "react-icons/md";
import useFetchMerchants from "@app/hooks/selector/useFetchMerchants";

export default function OrderPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sendRequest, loading } = useApi({ title: "Order" });
  const homeData = useAppSelector(selectHome);

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] = useFetchOrders({});
  // const [ddlData] = useFetchDDL({ code: ["GTCAT"] });
  //pass tableData to table
  // const [ddlData] = useFetchDDL({ code: ["STAFFTYP", "YESORNO", "NATION"] });
  const [ddlData1] = useFetchMerchants({});
  const [search, setSearch] = useState();
  const [status, setStatus] = useState();
  const [dateError, setDateError] = useState(false);

  const [tempFromDate, setTempFromDate] = useState<any>();
  const [tempToDate, setTempToDate] = useState<any>();
  useEffect(() => {
    if (tempToDate && tempFromDate && tempToDate < tempFromDate)
      setDateError(true);
    else setDateError(false);
  }, [tempFromDate, tempToDate]);

  const columns: any[] = [
    {
      title: "Date",
      dataIndex: "psordodt",
      key: "psordodt",
    },
    {
      title: "Order Id",
      dataIndex: "psorduid",
      key: "psorduid",
    },
    {
      title: "Order Grand Total",
      dataIndex: "psordgra",
      key: "psordgra",
    },

    // {
    //   title: "Member",
    //   dataIndex: "psmbruid",
    //   key: "psmbruid",
    //   render: (_: any, record: any) => (
    //     <Text>{`${record.psmbruid}-${record.psmbruiddsc}`}</Text>
    //   )
    // },
    {
      title: "Phone No.",
      dataIndex: "psordphn",
      key: "psordphn",
      render: (_: any, record: any) => (
        <Text>{`${record.psordpredsc}${record.psordphn}`}</Text>
      )
    },

    {
      title: "Merchant",
      dataIndex: "psmrcuid",
      key: "psmrcuid",
      render: (_: any, record: any) => (
        <Text>{`${record.psmrcuid}-${record.psmrcuiddsc}`}</Text>
      )
    },

    {
      title: "Order Status",
      dataIndex: "psordsts",
      key: "psordsts",
      render: (_: any, record: any) => (
        _ === "N" ? <Text fontWeight={"normal"} color={"black"} textAlign="center" style={{
          width: 40,
          height: 20,
          // backgroundColor: Colors.SUCCESS,
          borderRadius: 10
        }}>New</Text> : _ === "P" ? <Text fontWeight={"normal"} color={"white"} textAlign="center" style={{
          width: 40,
          height: 20,
          backgroundColor: Colors.WARNING,
          borderRadius: 10
        }}>Paid</Text> : _ === "G" ? <Text fontWeight={"normal"} color={"white"} textAlign="center" style={{
          width: 40,
          height: 20,
          // backgroundColor: Colors.WARNING,
          borderRadius: 10
        }}>Pending</Text> : _ === "A" ? <Text fontWeight={"normal"} color={"white"} textAlign="center" style={{
          width: 80,
          height: 20,
          backgroundColor: Colors.WARNING,
          borderRadius: 10
        }}>Preparing</Text> : _ === "D" ? <Text fontWeight={"normal"} color={"white"} textAlign="center" style={{
          width: 85,
          height: 20,
          backgroundColor: Colors.SUCCESS,
          borderRadius: 10
        }}>Completed</Text> : <Text fontWeight={"normal"} color={"white"} textAlign="center" style={{
          width: 40,
          height: 20,
          backgroundColor: Colors.DANGER,
          borderRadius: 10,
        }}>Cancelled</Text>
      )
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_: any, record: any) => (
        <Flex justifyContent="flex-end">
          <Space size="small">
            {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.ORD_VIEW)) && (

                <Tooltip label='View' fontSize='sm'>

                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="teal"
                    sx={{ _hover: { backgroundColor: Colors.SUCCESS2, color: Colors.BACKGROUND } }}

                    icon={<AiFillEye />}
                    aria-label={"view"}
                    onClick={() => goView(record?.id)}
                  />
                </Tooltip>
              )
            }
            {/* {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.ORD_EDIT)) && (
                <Tooltip label='Edit' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="yellow"
                    sx={{ _hover: { backgroundColor: Colors.PRIMARY, color: Colors.BACKGROUND } }}
                    icon={<BsPencil />}
                    aria-label={"edit"}
                    onClick={() => goEdit(record?.id)}
                  />
                </Tooltip>

              )
            } */}
            {/* {
              // todo
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.ORD_DEL)) && (
                <Tooltip label='Delete' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="red"
                    sx={{ _hover: { backgroundColor: Colors.DANGER, color: Colors.BACKGROUND } }}
                    icon={<IoTrash />}
                    aria-label={"delete"}
                    onClick={() => alertRemove(record?.id, record?.psorduid)}
                  />
                </Tooltip>
              )
            } */}

            <TableMenu menus={[
              {
                url: `/maintLogs`,
                query: {
                  id: record?.id,
                  file: extra.file
                },
                label: "Maint Log",
                breadcrumbRoute: [
                  {
                    title: "Order",
                    href: `/order`,// Add parameter if needed eg. /generalParameter/?id=123
                  },
                  {
                    title: "Maintenance Log",
                  },
                ]
              }
            ]} />

          </Space>
        </Flex>
      ),
    },
  ];

  // function showInfo(record: any, index: number) {
  //   dispatch(
  //     openGlobalModal({
  //       title: "Function Account Detail",
  //       status: "custom",
  //       message: <ShowDetail data={record} />,
  //     })
  //   );
  // }

  // function alertRemove(id: string, desc: string) {

  //   dispatch(
  //     openGlobalModal({
  //       title: "",
  //       message: RemoveDetail(id, desc),
  //       status: "warning",
  //       actions: [
  //         {
  //           title: "Confirm",
  //           onClick: () => {
  //             onRemove(id);
  //           },

  //         },
  //         {
  //           title: "Cancel",
  //           isClose: true,
  //         },
  //       ],
  //     })
  //   );
  // }

  // async function onRemove(id: string) {
  //   const { success } = await sendRequest({
  //     fn: getremoveStaff({ id }),
  //   });
  //   if (success) {

  //     setTimeout(() => {
  //       dispatch(refreshTable())
  //       showModal(dispatch, {
  //         title: "Remove item",
  //         message: "Removed",
  //       });
  //       router.push("/staff");
  //     }, 200);
  //   }
  // }

  function goAdd() {
    router.push({
      pathname: "/order/Detail",
      query: {
        id: "",
        mode: "ADD"
      },
    });
  }

  function goEdit(id: string) {
    router.push({
      pathname: "/order/Detail",
      query: {
        id: id,
        mode: "EDIT"
      },
    });
  }

  function goView(id: string) {
    router.push({
      pathname: "/order/Detail",
      query: {
        id: id,
        mode: "VIEW"
      },
    });
  }

  function searchOnChange(event: any) {
    setSearch(event.target.value);
  }

  function statusOnChange(event: any) {
    setStatus(event.target.value);
  }



  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
              Order
            </Text>
            <Breadcrumbs breadcrumbItems={[
              {
                title: "Order"
              },
            ]} />
          </Flex>
          <Box
            display={"flex"}
            alignSelf={"center"}
            pr={{
              base: 0,
              md: Spacing.containerPx,
            }}
          >
            {/* {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.ORD_ADD)) && (
                <Buttons
                  buttonDefaultType={"ADD"} onclick={() => goAdd()}
                />
              )
            } */}
          </Box>
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
                  placeholder="Order Phone No."
                  value={search}
                />

                <Select
                  name="status"
                  placeholder="Please Select Merchants"
                  value={status}
                  onChange={statusOnChange}
                >
                  {Array.isArray(ddlData1) &&
                    ddlData1
                      .map((option: any) => (
                        <option
                          key={option.psmrcuid}
                          value={option.psmrcuid}
                        >
                          {option.psmrcuid + " - " + option.psmrcnme}
                        </option>
                      ))}
                </Select>

                {/* Everyone can use*/}
                <Box display="flex" flexDir={"row"} gap={4} alignItems={"center"}>
                  {/* <Text minW={"35%"} >From Date</Text> */}

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
                      {/* <Text minW={"35%"}>To Date</Text> */}

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
          <Table
            columns={columns}
            data={tableData}
            refreshFn={fetchOrders}
            totalRecords={totalRecords}
            extraParams={{
              psordphn: search,
              ...(tempFromDate ? { from: new Date(tempFromDate) } : {}),
              ...(tempToDate ? { to: new Date(tempToDate) } : {}),
              psmrcuid: status

            }}
          //onDoubleClick={showInfo}
          //length={pageSize}
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
      <Text>{item} - {itemDesc}</Text>
    </Box>
  )
};
