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
  TabList,
  TabPanels,
  TabPanel,
  Tabs,
  Tab,
  TabIndicator,
  FormErrorMessage,
  FormControl,
  Link,
  FormLabel,
} from "@chakra-ui/react";
// assets
import React, { ChangeEventHandler, useEffect, useState } from "react";

import { DatePicker, Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import Table from "@app/components/common/Table/Table";
import { IoAdd, IoTrash, IoWarningOutline } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal, refreshTable, selectHome } from "@app/redux/app/slice";

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
import { getContractList, getRemoveContract } from "@app/redux/contract/slice";
import useFetchContracts from "@app/hooks/selector/useFetchContracts";
import { formatDate } from "@app/utils/DateUtils";
import dayjs, { Dayjs } from "dayjs"
import useFetchDDLCustomer from "@app/hooks/selector/useFetchDDLCustomer";
export default function ContractPage(type: string) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const homeData = useAppSelector(selectHome);
  const { sendRequest, loading } = useApi({ title: "Contract" });

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] = useFetchContracts();
  const [ddlData] = useFetchDDL({ code: [] });
  const [customers] = useFetchDDLCustomer({ filter: "Y" });

  //pass tableData to table
  // const [pageSize, setPageSize] = useState(10);
  // const [page, setPage] = useState(1);
  const [tempFromDate, setTempFromDate] = useState<any>();
  const [tempToDate, setTempToDate] = useState<any>();
  const [index, setIndex] = useState<number>(0);
  const [dateError, setDateError] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [pscifuid, setPscifuid] = useState<string>("");
  const [psapltyp, setPsapltyp] = useState<string>("");
  const [psapldat, setPsapldat] = useState<Dayjs | null>(null);
  const [psaplsts, setPsaplsts] = useState<string>("");

  function searchOnChange(event: any) {
    setSearch(event.target.value);
  }
  function psapltypOnChange(event: any) {
    setPsapltyp(event.target.value);
  }
  function psapldatOnChange(value: any) {
    setPsapldat(value);
  }
  function psaplstsOnChange(event: any) {
    setPsaplsts(event.target.value);
  }
  function pscifuidOnchange(event: any) {
    setPscifuid(event.target.value);
  }

  // useEffect(()=>{
  //   console.log(psapldat?.format('YYYY-MM-DD')," ",dayjs().format('YYYY-MM-DD'))
  // },[psapldat])

  useEffect(() => {
    if (tempToDate && tempFromDate && tempToDate < tempFromDate)
      setDateError(true);
    else setDateError(false);
  }, [tempFromDate, tempToDate]);
  const columns: any[] = [
    {
      title: "Customer",
      dataIndex: "pscifuid",
      key: "pscifuid",
      render: (_: string, record: any) =>
        <> {_} - {record?.pscifnme}</>
    },
    {
      title: "Product",
      dataIndex: "psprddsc",
      key: "psprddsc",
    },
    {
      title: "Sales Date",
      dataIndex: "psconsbd",
      key: "psconsbd",
    },
    {
      title: "Deal Date",
      dataIndex: "psconesd",
      key: "psconesd",
    },
    // {
    //   title: "Submission Date",
    //   dataIndex: "psaplphn",
    //   key: "psaplphn",
    // },
    {
      title: "Status",
      dataIndex: "psconsts",
      key: "psconsts",
      render: (_: string, record: any) =>
        <> {_} - {record?.psconstsdsc}</>
    },
    {
      title: "Agent",
      dataIndex: "psmbruid",
      key: "psmbruid",
      render: (_: string, record: any) =>
        <> {_} - {record?.psmbrnme}</>
    },
    {
      title: "Amount",
      dataIndex: "psconamt",
      key: "psconamt",
      align: 'right'
      //   render: (_: any) =>
      //     formatDate(_)

    },
    {
      title: "Actions",
      key: "action",
      align: "center",
      width: "10rem",
      render: (_: any, record: any) => (
        <Flex justifyContent="flex-end">
          <Space size="small">
            {/* {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.TRCV_VIEW)) && (
                <Tooltip label='View' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="teal"
                    sx={{ _hover: { backgroundColor: Colors.SUCCESS2, color: Colors.BACKGROUND } }}
                    //icon={<BsPencil />}
                    icon={<BsFillEyeFill />}
                    aria-label={"view"}
                    onClick={() => goView(record?.id)}
                  />
                </Tooltip>
              )
            } */}
            {/* {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.TRCV_EDIT)) && ( */}
            <Tooltip label='Edit' fontSize='sm'>
              <IconButton
                variant="outline"
                size={"sm"}
                borderRadius={2}
                colorScheme="blue"

                sx={{ _hover: { backgroundColor: Colors.PRIMARY, color: Colors.BACKGROUND } }}
                icon={<BsPencil />}
                aria-label={"edit"}
                onClick={() => goEdit(record?.psconuid, record?.psaplstsdsc)}
              />
            </Tooltip>
            {/* //   )
            // } */}
            {homeData?.psusrtyp === "AGT" && <Tooltip label='Delete' fontSize='sm'>
              <IconButton
                variant="outline"
                size={"sm"}
                borderRadius={2}
                disabled={record?.psconsts !== "N" && record?.psconsts !== "P"}

                colorScheme="red"
                sx={{ _hover: { backgroundColor: Colors.DANGER, color: Colors.BACKGROUND } }}
                icon={<IoTrash />}
                aria-label={"delete"}
                onClick={() => alertRemove(record?.psconuid)}
              />
            </Tooltip>
            }

            <TableMenu
              menus={[
                {
                  url: `/maintLogs`,
                  query: {
                    id: record?.id,
                    file: extra?.file,
                  },
                  label: "Maint Log",
                  breadcrumbRoute: [
                    {
                      title: "Contract",
                      href: `/contract`,
                    },
                    {
                      title: "Maintenance Log",
                    },
                  ]
                },
              ]}
            />
          </Space>
        </Flex>
      ),
    },
  ];

  function alertRemove(id: string) {
    dispatch(
      openGlobalModal({
        title: "Delete Record",
        message: RemoveDetail(id),
        status: "warning",
        actions: [
          {
            title: "Confirm",
            onClick: () => onRemove(id),
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

  async function onRemove(id: string) {
    const { success } = await sendRequest({
      fn: getRemoveContract({ id }),
    });

    if (success) {
      dispatch(refreshTable())
      setTimeout(() => {
        showModal(dispatch, {
          title: "Delete Record",
          message: "Record Deleted",
        });
        // router.push("/contract");
      }, 200);
    }
  }

  function goAdd() {
    router.push({
      pathname: "/contract/Detail",
      query: {
        id: "",
        mode: "ADD"
      },
    });
  }

  function goView(id: string) {
    router.push({
      pathname: "/testReceiver/Detail",
      query: {
        id: id,
        mode: "VIEW"
      },
    });
  }

  function goEdit(id: string, status: string) {
    router.push({
      pathname: "/contract/Detail",
      query: {
        id: id,
        mode: "EDIT",
        status,
      },
    });
  }



  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
              Sales Contract Information
            </Text>
            <Breadcrumbs breadcrumbItems={[
              {
                title: "Sales Contract Information"
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


            {(homeData?.access && checkAccessMatrix(homeData?.access, accessType.CON_ADD)) && (
              <Buttons
                buttonDefaultType={"ADD"} onclick={() => goAdd()}
              />)}


            {/* <Link href="#" onClick={() => {
              setPscmkcde("");
              setPsrqtmkr("");
              setPsrqtsts("PEN");

              setPsrwmuid("");
              setpsrwpoid("");
              setpsrwaveh("");
            }}>Clear All</Link> */}

            {/* <Buttons
              buttonDefaultType="CUSTOM"
              buttonText="Clear All"
              buttonHoverBackgroundColor={Colors.DANGER}
              buttonHoverColor="#ffffff"
              textColor={Colors.DANGER2}
              bgColor="#ffffff"
              onClick={() => {
                setPscmkcde("");
                setPsrqtmkr("");
                setPsrqtsts("PEN");

                setPsrwmuid("");
                setpsrwpoid("");
                setpsrwaveh("");
              }}
              // leftIcon={<IoCloudDownloadOutline />}
              variant="primary"
              type="submit"
              isLoading={loading}
              style={{ border: `1px solid ${Colors.DANGER2}`, borderRadius: "5px" }}
            /> */}
          </Box>
        </Flex>
        {/* <Card p={4} mt={5}> */}

        <Card p={1} mt={`${Spacing.containerPx}`}>

          <Flex bgColor="#fff" justifyContent={"flex-start"} p={3} gap={16}>
            <Box
              // flex={1}
              pr={{
                base: 0,
                md: Spacing.containerPx,
              }}
              display="flex"
            >
              <Flex flexDir="row" alignItems={"flex-end"} gap={4} flex={1}>
                <Box display="flex" flexDir="column" gap={1}>
                  <FormLabel>Customer</FormLabel>

                  <Select
                    name="pscifuid"
                    onChange={pscifuidOnchange}
                    placeholder="Select Customer"
                    value={pscifuid}
                  >
                    {Array.isArray(customers) && customers?.map((option: any) => (
                      <option key={option.pscifuid} value={option.pscifuid}>
                        {option.pscifuid} - {option.pscifnme}
                      </option>
                    ))}
                  </Select>


                </Box>
                <FormControl flex={1} isInvalid={dateError}>
                  <Box display="flex" flexDir="column">
                    <Box
                      display="flex"
                      flexDir={"column"}
                      gap={1}
                    >
                      {/* <Text >To Date</Text> */}
                      <FormLabel>From Date</FormLabel>

                      <DatePicker
                        format="DD/MM/YYYY"
                        className="w-full"
                        placeholder="Select Date"
                        onChange={(d) => {
                          // @ts-ignore
                          // if (new Date(formatDate(d)) instanceof Date && !isNaN(new Date(formatDate(d)))) setTempToDate(formatDate(d))
                          // else setTempToDate("")

                          setTempFromDate(d);
                        }}
                        value={tempFromDate}
                      />
                    </Box>
                    {dateError && (
                      <FormErrorMessage>
                        {"From Date cannot be greater than To Date"}
                      </FormErrorMessage>
                    )}
                  </Box>
                </FormControl>
                <Box
                  flex={1}
                  display="flex"
                  flexDir={"column"}
                  gap={1}
                >
                  {/* <Text >To Date</Text> */}
                  <FormLabel>To Date</FormLabel>

                  <DatePicker
                    format="DD/MM/YYYY"
                    className="w-full"
                    placeholder="Select Date"
                    onChange={(d) => {
                      // @ts-ignore
                      // if (new Date(formatDate(d)) instanceof Date && !isNaN(new Date(formatDate(d)))) setTempToDate(formatDate(d))
                      // else setTempToDate("")

                      setTempToDate(d);
                    }}
                    value={tempToDate}
                  />
                </Box>

              </Flex >


            </Box>
          </Flex>
          <Table
            rowKey="id"
            columns={columns}
            data={tableData}
            refreshFn={getContractList}
            totalRecords={totalRecords}
            extraParams={{
              search,
              from_date: tempFromDate,
              to_date: tempToDate,
              pscifuid
            }}
          />                 </Card>


        {/* </Card> */}
      </Box>
    </>
  );
}

const RemoveDetail = (item: string) => {
  return (
    <Box w={"100%"} display="flex" flexDirection="column" alignItems="center">
      {/* <Icon as={IoWarningOutline} w={150} h={150} color={Colors.DANGER}/> */}
      <Text p={3}>Are you sure to delete this record?</Text>
      <Text>{item}</Text>
    </Box>
  )
};
