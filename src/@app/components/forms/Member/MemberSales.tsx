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

export default function MemberSales(props: any) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sendRequest, loading } = useApi({ title: "Agent Profile" });
  const homeData = useAppSelector(selectHome);
  const [tempFromDate, setTempFromDate] = useState<any>(dayjs().startOf('month'));
  const [tempToDate, setTempToDate] = useState<any>();
  const [dateError, setDateError] = useState(false);
  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] =
    useFetchSales({id:props.id});
  const [ddlData] = useFetchDDL({ code: ["GTCAT"] });
  const [products] = useFetchDDLProduct();
  const [agents] = useFetchDDLAgent();
  //pass tableData to table

  useEffect(() => {
    if (tempToDate && tempFromDate && tempToDate < tempFromDate)
      setDateError(true);
    else setDateError(false);
   }, [tempFromDate, tempToDate]);

   useEffect(()=>{
    setPsagtuid(Array.isArray(agents)&&agents?.find((agent:any)=>agent.psusrunm===homeData?.psusrunm  )?.psmbruid)
   },[homeData])
  const [search, setSearch] = useState();
  const [contact, setContact] = useState();
  const [category, setCategory] = useState();
  const [psagtuid, setPsagtuid] = useState();
  const [psprdcde, setPsprdcde] = useState();
  function psprdcdeOnChange(event: any) {
    setPsprdcde(event.target.value);
  }
  function psagtuidOnChange(event: any) {
    setPsagtuid(event.target.value);
  }
  const columns: any[] = [
    {
      title: "Trans. Date",
      dataIndex: "trans_date",
      key: "trans_date",
    },
    {
      title: "Sales Type",
      dataIndex: "sales_type",
      key: "sales_type",
    },
    {
      title: "Product Code",
      dataIndex: "product_code",
      key: "product_code",
      render: (_: string, record: any) =>
        <>{_} - {record?.product_desc}</>,
    },
    {
      title: "Trans. Amount",
      dataIndex: "trans_amount",
      key: "trans_amount",
      align:'right',
    },
    {
      title: "Agent ID",
      dataIndex: "agent_id",
      key: "agent_id",
    },
    {
      title: "Agent Name",
      dataIndex: "agent_name",
      key: "agent_name",
    },
    {
      title: "Recruiter Agent",
      dataIndex: "recruiter_agent",
      key: "recruiter_agent",
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
        <Card p={1}   mt={`${Spacing.containerPx}`}>
          <Flex  alignItems={"center"}w={"100%"} bgColor="#fff" justifyContent={"flex-start"} p={3} gap={16}>
            <Box
            flex={1}
              pr={{
                base: 0,
                md: Spacing.containerPx,
              }}
              display="flex"
            >
                <Flex flexDir="column" gap={4} flex={1}>
                <Flex  flexDir="row" gap={4} flex={1}>

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
                      <Select
                  name="psagtuid"
                  onChange={psagtuidOnChange}
                  placeholder="Please Select Agent ID"
                  value={psagtuid}
                  flex={1}  >
                  {Array.isArray(agents)&&agents?.map((option: any) => (
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
                  {Array.isArray(products)&&products?.map((option: any) => (
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
            <TableContainer             flex={1.5}
            >
              <ChakraUITable  variant={"unstyled"}>
                <Thead>
                  <Tr  > 
                    <Th py={'7px'}></Th>
                    <Th py={'7px'}  textAlign="right">Sales By Search</Th>
                    <Th py={'7px'}  textAlign="right">3 Month Sales</Th>
                    <Th py={'7px'}  textAlign="right">6 Month Sales</Th>
                  </Tr>
                </Thead>
                <Tbody >
                  <Tr>
                    <Th py={'7px'} >Personal Sales</Th>
                    <Td py={'7px'} textAlign="right">{extra?.personal_sales_by_search}</Td>
                    <Td py={'7px'} textAlign="right">{extra?.personal_3_month_sales}</Td>
                    <Td py={'7px'} textAlign="right">{extra?.personal_6_month_sales}</Td>
                  </Tr>
                  <Tr>
                    <Th py={'7px'}>Group Sales</Th>
                    <Td py={'7px'}textAlign="right">{extra?.group_sales_by_search}</Td>
                    <Td py={'7px'}textAlign="right">{extra?.group_3_month_sales}</Td>
                    <Td py={'7px'} textAlign="right">{extra?.group_6_month_sales}</Td>
                  </Tr>
                  <Tr borderTopWidth='1px'>
                    <Th py={'7px'}>Total Sales</Th>
                    <Td py={'7px'}fontWeight={"medium"} textAlign="right">{extra?.total_sales_by_search}</Td>
                    <Td py={'7px'} fontWeight={"medium"}textAlign="right">{extra?.total_3_month_sales}</Td>
                    <Td  py={'7px'}fontWeight={"medium"}textAlign="right">{extra?.total_6_month_sales}</Td>
                  </Tr>
                </Tbody>
              </ChakraUITable>
            </TableContainer>
          </Flex>
          <Table
            rowKey="id"
            columns={columns}
            data={tableData}
            refreshFn={getMemberSales}
            totalRecords={totalRecords}
            extraParams={{
              search: search,
              from_date: tempFromDate,
              to_date: tempToDate,
              id:props.id,
              psprdcde,
              psagtuid,
              //   type: category,
            }}
          />
        </Card>
      </Box>
    </>
  );
}

