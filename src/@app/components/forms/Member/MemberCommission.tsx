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
import React, { ChangeEventHandler, useEffect, useState } from "react";

import { DatePicker, Space, TableColumnsType, Tag } from "antd";
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
  //   getRemoveGenType,
  getMemberList,
  getMemberSales,
} from "@app/redux/member/slice";

import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { BsPencil, BsFillEyeFill } from "react-icons/bs";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { MdLockReset } from "react-icons/md";
import useFetchSales from "@app/hooks/selector/useFetchSales";
import useFetchDDLProduct from "@app/hooks/selector/useFetchDDLProduct";
import useFetchDDLAgent from "@app/hooks/selector/useFetchDDLAgent";
import dayjs from "dayjs";
import { getCom, getGroupCom, getPersonalCom } from "@app/redux/commission/slice";
import useFetchPersonalCommissions from "@app/hooks/selector/useFetchPersonalCommissions";
import useFetchGroupCommissions from "@app/hooks/selector/useFetchGroupCommissions";
import useFetchCommissions from "@app/hooks/selector/useFetchCommissions";

export default function MemberCommission(props: any) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sendRequest, loading } = useApi({ title: "Agent Profile" });
  const homeData = useAppSelector(selectHome);
  const [tempFromDate, setTempFromDate] = useState<any>();
  const [tempToDate, setTempToDate] = useState<any>();
  const [dateError, setDateError] = useState(false);
  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] =
    useFetchCommissions()
  const [ddlData] = useFetchDDL({ code: ["MONTH"] });
  const [products] = useFetchDDLProduct();
  const [agents] = useFetchDDLAgent();

  const [fromYear, setFromYear] = useState<any>();
  const [fromMonth, setFromMonth] = useState<any>();
  const [toYear, setToYear] = useState<any>();
  const [toMonth, setToMonth] = useState<any>();

  // //sample code how to use this hook
  // const [tableData2, refreshFn2, totalRecords2, extra2] =
  //   useFetchGroupCommissions();



  const expandColumns: any[] = [
    {
      title: "Over-Riding",
      dataIndex: "psmbrnme",
      key: "psmbrnme",
      render: (_: string, record: any) => <>{`${_} (${parseFloat(record?.commission_percentage).toFixed(2)}%)`}</>
    },
    {
      title: "Submission",
      dataIndex: "submission",
      key: "submission",
    },
    {
      title: "OR %",
      dataIndex: "pscompec", render: (_: string, record: any) => <>{record?.commission_percentage?`${parseFloat(record?.commission_percentage).toFixed(2)}%`:"-"}</>,

      key: "pscompec", align: 'right',
    },
    {
      title: "OR (RM)",
      dataIndex: "pscomamt",
      key: "pscomamt", align: 'right',
    },
    {
      title: "Net Comm. (RM)",
      dataIndex: "pscomamt",
      key: "pscomamt", align: 'right',

    },
    {
      title: "Comm. Hold (RM)",
      dataIndex: "comm_hold",
      key: "comm_hold", align: 'right',
    },
    {
      title: "Comm. Paid (RM)",
      dataIndex: "comm_pay",
      key: "comm_pay", align: 'right',
    },

  ];


  useEffect(() => {
    if (fromMonth && fromYear)
      setTempFromDate(new Date(fromYear, fromMonth - 1, 1))
    if (toMonth && toYear)
      setTempToDate(new Date(toYear, toMonth - 1, 1))
  }, [fromMonth, fromYear, toMonth, toYear])


  useEffect(() => {
    if (tempToDate && tempFromDate && tempToDate < tempFromDate)
      setDateError(true);
    else setDateError(false);
  }, [tempFromDate, tempToDate]);

  // useEffect(() => {
  //   setPsagtuid(Array.isArray(agents) && agents?.find((agent: any) => agent.psusrunm === homeData?.psusrunm)?.psmbruid)
  // }, [homeData])
  const [search, setSearch] = useState();
  const [contact, setContact] = useState();
  const [category, setCategory] = useState();
  const [ psagtuid, setPsagtuid] = useState();
  const [psprdcde, setPsprdcde] = useState();
  function psprdcdeOnChange(event: any) {
    setPsprdcde(event.target.value);
  }
  function psagtuidOnChange(event: any) {
    setPsagtuid(event.target.value);
  }
  function fromYearOnChange(event: any) {
    setFromYear(event.target.value);
  }
  function toYearOnChange(event: any) {
    setToYear(event.target.value);
  }
  function fromMonthOnChange(event: any) {
    setFromMonth(event.target.value);
  }
  function toMonthOnChange(event: any) {
    setToMonth(event.target.value);
  }
  const columns: any[] = [
    {
      title: "Trans. Date",
      dataIndex: "pstrxdat",
      key: "pstrxdat",
    },
    {
      title: "Comm. Type",
      dataIndex: "pscomtyp",
      key: "pscomtyp",
    },
    {
      title: "Product Code",
      dataIndex: "psprdcde",
      key: "psprdcde",
    },
    {
      title: "Trust Deed Number",
      dataIndex: "psconuid",
      key: "psconuid",

    },
    {
      title: "Trans. Amount",
      dataIndex: "psconamt",
      key: "psconamt", align: 'right',
    },
    {
      title: "Agent ID",
      dataIndex: "user_tag",
      key: "user_tag",
    },

    {
      title: "Agent Name",
      dataIndex: "agentName",
      key: "agentName",
    },
    {
      title: "Comm %",
      dataIndex: "pscompec",
      key: "pscompec", align: 'right',
    },
    {
      title: "Comm Amt",
      dataIndex: "pscomamt",
      key: "pscomamt", align: 'right',
    },
    {
      title: "Comm On Hold",
      dataIndex: "onhold",
      key: "onhold", align: 'right',
    },
    {
      title: "Comm. Paid",
      dataIndex: "paid",
      key: "paid", align: 'right',
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

  //   function alertRemove(id: string, desc: string) {

  //     dispatch(
  //       openGlobalModal({
  //         title: "Delete Record",
  //         message: RemoveDetail(id, desc),
  //         status: "warning",
  //         actions: [
  //           {
  //             title: "Confirm",
  //             onClick: () => {
  //               onRemove(id);
  //             },

  //           },
  //           {
  //             title: "Cancel",
  //             isClose: true,
  //           },
  //         ],
  //       })
  //     );
  //   }

  //   async function onRemove(id: string) {
  //     const { success } = await sendRequest({
  //       fn: getRemoveGenType({prgtycde:id}),
  //     });
  //     if (success) {

  //       setTimeout(() => {
  //         dispatch(refreshTable())
  //         showModal(dispatch, {
  //           title: "Delete Record",
  //           message: "Record Deleted",
  //         });
  //         router.push("/generalParameter");
  //       }, 200);
  //     }
  //   }

  //   function goAdd() {
  //     router.push({
  //       pathname: "/generalParameter/Detail",
  //       query: {
  //         id: "",
  //         mode: "ADD"
  //       },
  //     });
  //   }


  return (
    <>
      <Box>
        {/* <Flex justifyContent={"space-between"} pl={4} pr={4}
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
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.GEN_ADD)) && (
                <Buttons 
                  buttonDefaultType={"ADD"} onclick={() => goAdd()}
                />
              )
            } 
          </Box>
        </Flex> */}
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

                  <Flex flexDir={"column"}>
                  <FormLabel>Month</FormLabel>

                    <Select
                      name="fromMonth"
                      onChange={fromMonthOnChange}
                      placeholder="Select Month"
                      value={fromMonth}
                    >
                      {ddlData?.MONTH?.map((option: DDL_TYPES) => (
                        <option key={option.prgecode} value={option.prgecode}>
                          {option.prgedesc}
                        </option>
                      ))}
                    </Select>
                    {fromYear && !fromMonth && <Text fontSize={"sm"} color={"red"} mt={2}>Field is required</Text>}
                  </Flex>
                  <Flex flexDir={"column"}>
<FormLabel>Year</FormLabel>
                    <Input
                      name="year"
                      onChange={fromYearOnChange}
                      placeholder="Enter Year"
                      value={fromYear}
                    >

                    </Input>
                    {fromYear && new Date(fromYear, 0, 1).getFullYear() !== +fromYear && <Text fontSize={"sm"} color={"red"} mt={2}>Invalid Year</Text>}

                    {!fromYear && fromMonth && <Text fontSize={"sm"} color={"red"} mt={2}>Field is required</Text>}
                  </Flex>
                </Flex >
                <Select
                  name="psagtuid"
                  onChange={psagtuidOnChange}
                  placeholder="Please Select Agent ID"
                  value={psagtuid}
                  flex={1}  >
                  {Array.isArray(agents) && agents?.map((option: any) => (
                    <option key={option.psmbruid} value={option.psmbruid}>
                      {option.psmbruid} - {option.psmbrnme}
                    </option>
                  ))}
                </Select>
                <Select
                  name="psprdcde"
                  onChange={psprdcdeOnChange}
                  placeholder="Please Select Product"
                  value={psprdcde}
                  flex={1}
                >
                  {Array.isArray(products) && products?.map((option: any) => (
                    <option key={option.psprdcde} value={option.psprdcde}>
                      {option.psprdcde} - {option.psprddsc}
                    </option>
                  ))}
                </Select>


              </Flex>
              {/* <Select
                         name="category"
                         onChange={categoryOnchange}
                         placeholder="Please Select Category"
                         value={category}
                       >
                         {ddlData?.GTCAT?.map((option: DDL_TYPES) => (
                           <option key={option.prgecode} value={option.prgecode}>
                             {option.prgedesc}
                           </option>
                         ))}
                       </Select> */}
            </Box>
            <TableContainer flex={1.5}
            >
              <ChakraUITable variant={"unstyled"}>
                <Thead>
                  <Tr  >
                    <Th py={'7px'}></Th>
                    <Th py={'7px'} textAlign="right"></Th>
                  
                  </Tr>
                </Thead>
                <Tbody >
                  <Tr>
                    <Th py={'7px'} >Permission Commission</Th>
                    <Td py={'7px'} textAlign="right">{extra?.personalCommission}</Td>
                    
                  </Tr>
                  <Tr>
                    <Th py={'7px'}>Overriding Commission</Th>
                    <Td py={'7px'} textAlign="right">{extra?.groupCommission}</Td>
                    
                  </Tr>
                  <Tr>
                    <Th py={'7px'}>Commission on Hold</Th>
                    <Td py={'7px'} textAlign="right">{extra?.onHold}</Td>
                    
                  </Tr>
                  <Tr borderTopWidth='1px'>
                    <Th py={'7px'}>Total Commission Paid</Th>
                    <Td py={'7px'} fontWeight={"medium"} textAlign="right">{extra?.totalPaid}</Td>
                   
                  </Tr>
                </Tbody>
              </ChakraUITable>
            </TableContainer>
          </Flex>
          <Table
            rowKey="id"
            columns={columns}
            data={tableData}
            refreshFn={getCom}
            totalRecords={totalRecords}
            // expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }}
            extraParams={{
              id:props.id,
              psmbruid: psagtuid,
              month:fromMonth,
              year:fromYear,
              psprdcde,
              // toMonth,
              // toYear

              //   type: category,
            }}
          />
        </Card>
      </Box>
    </>
  );
}

