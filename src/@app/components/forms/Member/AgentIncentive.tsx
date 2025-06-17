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
  Tooltip,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
// assets
import React, { ChangeEventHandler, useEffect, useState, CSSProperties } from "react";

import { DatePicker, Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { formatDate } from "@app/utils/DateUtils";
import Table from "@app/components/common/Table/Table";
import { IoAdd, IoTrash, IoWarningOutline } from "react-icons/io5";
import { FiMoreVertical } from "react-icons/fi";
import { AiFillEye } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import {
  closeGlobalModal,
  openGlobalModal,
  refreshTable,
  selectHome,
} from "@app/redux/app/slice";
import {
  Table as ChakraUITable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { showModal } from "@app/helpers/modalHelper";
import { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";

// import useFetchGeneralType from "@app/hooks/selector/useFetchGeneralType";
import useFetchMembers from "@app/hooks/selector/useFetchMembers";

import {
  //   fetchGenType,
  //   removeAgent,
  fetchAgent,
  getagentDetail,

} from "@app/redux/agentIncentive/slice";

import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { BsPencil, BsFillEyeFill } from "react-icons/bs";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { MdLockReset } from "react-icons/md";
import useFetchAgents from "@app/hooks/selector/useFetchAgents";
import dayjs from "dayjs";
import { removeAgent } from "@app/redux/agentIncentive/api";

export default function AgentIncentive(props: any) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sendRequest, loading } = useApi({ title: "Agent Profile" });
  const homeData = useAppSelector(selectHome);
  const [tempFromDate, setTempFromDate] = useState<any>(dayjs().startOf('month'));
  const [tempToDate, setTempToDate] = useState<any>();
  const [dateError, setDateError] = useState(false);
  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] =
    useFetchAgents({ id: props.id });
  const [ddlData] = useFetchDDL({ code: ["INCTYP", "YESORNO"] });

  //pass tableData to table

  useEffect(() => {
    if (tempToDate && tempFromDate && tempToDate < tempFromDate)
      setDateError(true);
    else setDateError(false);
  }, [tempFromDate, tempToDate]);


  const [category, setCategory] = useState();
  const customHeaderCellStyle: CSSProperties = {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    marginRight: 35
  };

  const customDataCellStyle: CSSProperties = {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginLeft: 12,
  };


  function categoryOnchange(event: any) {
    setCategory(event.target.value);
  }
  const columns: any[] = [
    {
      title: "Date",
      dataIndex: "psincdat",
      key: "psincdat",

      render: (_: any, record: any) => {
        const formattedDate = _.slice(0, 10).split('-').reverse().join('-');
        return <Text>{formattedDate}</Text>;
      }
    },
    {
      title: "Time",
      dataIndex: "psincdat",
      key: "psincdat",
      render: (_: any, record: any) => {
        const a = _.slice(11, 19);
        return <Text>{a}</Text>;
      }
    },
    {
      title: "Description",
      dataIndex: "psincdsc",
      key: "psincdsc",
      
    },
    {
      title: "Incentive Type",
      dataIndex: "psinctyp",
      key: "psinctyp",
      render: (_: any, record: any) => (
        <Text>{`${record.psinctypdsc}`}</Text>
      )
    },
   
    {
      title: "Amount",
      dataIndex: "psincamt",
      key: "psincamt",
    },
    {
      title: "Status",
      dataIndex: "psincsts",
      key: "psincsts",
      render: (data: any, record: any) => (
        <Flex sx={{
          marginRight: 0
        }}>
          {data === "Y" ? <Text fontWeight={"normal"} color={"white"} textAlign="center" style={{
            width: 60,
            height: 20,
            backgroundColor: Colors.SUCCESS,
            borderRadius: 10
          }}>{record?.psincstsdsc}</Text> : <Text fontWeight={"normal"} color={"white"} textAlign="center" style={{
            width: 60,
            height: 20,
            backgroundColor: Colors.DANGER,
            borderRadius: 10,
          }}>{record?.psincstsdsc}</Text>}

        </Flex>
      )
    },
    {
      title: <div style={customHeaderCellStyle}>ACTIONS</div>,
      key: "action",
      align: "center",
      width: "10rem",
      render: (_: any, record: any) => (
        <div style={customDataCellStyle}>
          <Space size="small">
            {/* {
                         (homeData?.access && checkAccessMatrix(homeData?.access, accessType.prodCom_VIEW)) && (
                             <Tooltip label='View' fontSize='sm'>
                                 <IconButton
                                     variant="outline"
                                     size={"sm"}
                                     borderRadius={2}
                                     colorScheme="blue"
                                     sx={{ _hover: { backgroundColor: Colors.PRIMARY, color: Colors.BACKGROUND } }}
                                     icon={<BsEye />}
                                     aria-label={"view"}
                                     onClick={() => goView(record?.id)}
                                 />
                             </Tooltip>
                         )
                     } */}
            {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.MBRPROF_EDIT)) && (
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
            }
            {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.MBRPROF_DEL)) && (
                <Tooltip label='Delete' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="red"
                    sx={{ _hover: { backgroundColor: Colors.DANGER, color: Colors.BACKGROUND } }}
                    icon={<IoTrash />}
                    aria-label={"delete"}
                    onClick={() => alertRemove(record?.id, record?.psincdat, record?.psinctypdsc)}
                  />
                </Tooltip>
              )
            }

            <TableMenu
              menus={[
                {
                  url: `/maintLogs`,
                  query: {
                    id: record?.psmbruid + '-' + record?.psinctyp + '-' + dayjs(record?.psincdat).subtract(8,'hour').format("DD/MM/YYYY HH:mm"),

                    file: extra.file,
                  },
                  label: "Maint Log",
                  breadcrumbRoute: [
                    {
                      title: "Agent Incentive",
                      href: `/member/Detail/?id=1001&mode=VIEW&tabIndex=2`,// Add parameter if needed eg. /generalParameter/?id=123
                    },
                    {
                      title: "Maintenance Log",
                    },
                  ]
                },

              ]}
            />
          </Space>
        </div>
      ),
    },

  ];
  function goEdit(id: string) {
    router.push({
      pathname: `/member/incentive/`,
      query: {
        id: id,
        memberId: props.id,
        tabIndex: 2,
        mode: "EDIT"
      },
    });
  }


  function alertRemove(id: string, desc: string, desc2: string) {

    dispatch(
      openGlobalModal({
        title: "Delete Record",
        message: RemoveDetail(desc, desc2),
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
      fn: removeAgent({ id }),
    });
    if (success) {

      setTimeout(() => {
        dispatch(refreshTable())
        showModal(dispatch, {
          title: "Delete Record",
          message: "Record Deleted",
        });
        router.push(`/member/Detail/?id=${props.id}`);
      }, 200);
    }
  }

  // function goAdd() {
  //   router.push({
  //     pathname: `/member/Detail/?id=&memberId=${props.id}`,
  //     query: {
  //       id: "",
  //       mode: "ADD"
  //     },
  //   });
  // }


  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"} pl={4} pr={4}
        >
          {/* <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Agent Profile
            </Text>
            <Breadcrumbs
              breadcrumbItems={[
                {
                  title: "Agent Profile",
                },
              ]}
            />
          </Flex> */}
          <Box
            display={"flex"}
            alignSelf={"center"}
            pr={{
              base: 0,
              md: Spacing.containerPx,
            }}
          >
            {/* {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.GEN_ADD)) && (
                <Buttons 
                  buttonDefaultType={"ADD"} onclick={() => goAdd()}
                />
              )
            } */}
          </Box>
        </Flex>
        <Card p={1} mt={`${Spacing.containerPx}`}>
          <Flex alignItems={"center"} w={"100%"} bgColor="#fff" justifyContent={"flex-start"} p={3} gap={16}>
            <Box
              flex={1}
              pr={{
                base: 0,
                md: Spacing.containerPx,
              }}
              display="flex"
            >


              <Flex flexDir="column" gap={4} flex={1}>
                <Flex flexDir="row" gap={4} flex={1}>

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
                  <Box
                    flex={1}
                    display="flex"
                    flexDir={"column"}
                    gap={1}
                  >
                    <FormLabel>Incentive Type</FormLabel>

                    <Select
                      name="category"
                      onChange={categoryOnchange}
                      placeholder="Please Select Type"
                      value={category}
                    >
                      {ddlData?.INCTYP?.map((option: DDL_TYPES) => (
                        <option key={option.prgecode} value={option.prgecode}>
                          {option.prgedesc}
                        </option>
                      ))}
                    </Select>
                  </Box>
                </Flex >


              </Flex>

            </Box>

          </Flex>
          <Table
            rowKey="id"
            columns={columns}
            data={tableData}
            refreshFn={fetchAgent}
            totalRecords={totalRecords}
            extraParams={{
              from: dayjs(tempFromDate).format("YYYY-MM-DD"),
              to: dayjs(tempToDate).format("YYYY-MM-DD"),
              id: props.id,
              type: category
            }}
          />
        </Card>
      </Box>
    </>
  );
}

const RemoveDetail = (item: string, itemDesc: string) => {
  const date = dayjs(item).format("DD/MM/YYYY HH:mm")
  return (
    <Box w={"100%"} display="flex" flexDirection="column" alignItems="center">
      {/* <Icon as={IoWarningOutline} w={150} h={150} color={Colors.DANGER}/> */}
      <Text p={3}>Are you sure to delete this record?</Text>
      <Text>{date} - {itemDesc}</Text>
    </Box>
  )
};