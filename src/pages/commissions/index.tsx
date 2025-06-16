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
import moment from "moment";

import useFetchCheckerMakers from "@app/hooks/selector/useFetchCheckerMakers";

import {
    getCheckerMakerList,
    getRemoveCheckerMaker
} from "@app/redux/checkerMaker/slice";


import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { BsFillEyeFill, BsPencil } from "react-icons/bs";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { MdLockReset } from "react-icons/md";
import dayjs from "dayjs";
import { table } from "console";
import MemberCommission from "@app/components/forms/Member/MemberCommission";
import useFetchDDLAgent from "@app/hooks/selector/useFetchDDLAgent";
import { getGroupCom, getPersonalCom } from "@app/redux/commission/slice";
import useFetchGroupCommissions from "@app/hooks/selector/useFetchGroupCommissions";
import useFetchPersonalCommissions from "@app/hooks/selector/useFetchPersonalCommissions";

export default function CheckerMakerPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sendRequest, loading } = useApi({ title: "Checker Maker Parameter" });
  const homeData = useAppSelector(selectHome);  
  const [ddlData] = useFetchDDL({ code: ["MONTH"] });

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] = useFetchPersonalCommissions();
  // const [ddlData] = useFetchDDL({ code: ["PRMTYPE", "RWDAUD", "YESORNO"] });
  //pass tableData to table

  const [search, setSearch] = useState();
  const [category, setCategory] = useState();
  const [status, setStatus] = useState();
  const [agents] = useFetchDDLAgent()
    const [fromYear, setFromYear] = useState<any>();
    const [fromMonth, setFromMonth] = useState<any>();
    const [toYear, setToYear] = useState<any>();
    const [toMonth, setToMonth] = useState<any>();
  
    
  //sample code how to use this hook
  const [tableData2, refreshFn2, totalRecords2, extra2] =
    useFetchGroupCommissions();
    useEffect(()=>{
        if(fromMonth&&fromYear)
        setTempFromDate(new Date(fromYear,fromMonth-1,1))
        if(toMonth&&toYear)
        setTempToDate(new Date(toYear,toMonth-1,1))
      },[fromMonth, fromYear, toMonth, toYear])
    
     
    
const [tempFromDate, setTempFromDate] = useState<any>(dayjs().startOf('month'));
  const [tempToDate, setTempToDate] = useState<any>();
  const [dateError, setDateError] = useState(false);
    const columns: any[] = [
      {
        title: "Year",
        dataIndex: "year",
        key: "year",
      },
      {
        title: "Month",
        dataIndex: "month",
        key: "month",
      },
      {
        title: "Agent",
        dataIndex: "psmbruid",
        key: "psmbruid",
        render: (_: string, record: any) => <>{`${record?.user_tag} - ${record?.psmbrnme}`}</>
      },
      {
        title:"Personal",
        children:[
          {
            title: "Submission",
            dataIndex: "submission_personal",
            key: "submission_personal", align: 'right',
      
          },
          {
            title: "Level %",
            dataIndex: "pscompec",
            key: "pscompec", align: 'right',
            render: (_: string, record: any) => _?<>{parseFloat(_).toFixed(2)}%</>:"-"
          },
          {
            title: "Comm. (RM)",
            dataIndex: "personal_total",
            key: "personal_total",
            align: 'right',
          },
        ]
      },
      {
        title:"Group",
        children:[

          {
            title: "Submission",
            dataIndex: "submission_group",
            key: "submission_group", align: 'right',
          },
          {
            title: "Comm. (RM)",
            dataIndex: "override_total",
            key: "override_total", align: 'right',
          },
        ]
      },
    
    
  
      {
        title: "Net Comm. (RM)",
        dataIndex: "netcom",
        key: "netcom", align: 'right',
      },
      {
        title: "Comm. Hold",
        dataIndex: "comm_hold",
        key: "comm_hold", align: 'right',
      },
      {
        title: "Comm. Pay (RM)",
        dataIndex: "comm_pay",
        key: "comm_pay", align: 'right',
      },
       {
            title: "Actions",
            key: "action",
            align: "center",
            width: "10rem",
            render: (_: any, record: any) => (
              <Flex justifyContent="center">
                <Space size="small">
                  {/* {homeData?.access && checkAccessMatrix(homeData?.access, accessType.MBRPROF_VIEW) && ( */}
      
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
                        onClick={() => goView(record?.psmbruid,record?.year,record?.month)}
                      />
                    </Tooltip>
      
      
                  {/* )} */}
                  {/* {homeData?.access &&
                    checkAccessMatrix(homeData?.access, accessType.MBRPROF_VIEW) && (
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
                          onClick={() => goEdit(record?.id)}
                        />
                      </Tooltip>
                    )} */}
                  {/* {
                    (homeData?.access && checkAccessMatrix(homeData?.access, accessType.GEN_DEL)) && (
                      <Tooltip label='Delete' fontSize='sm'>
                        <IconButton
                          variant="outline"
                          size={"sm"}
                          borderRadius={2}
                          colorScheme="red"
                          sx={{ _hover: { backgroundColor: Colors.DANGER, color: Colors.BACKGROUND } }}
                          icon={<IoTrash />}
                          aria-label={"delete"}
                          onClick={() => alertRemove(record?.id, record?.prgtydsc)}
                        />
                      </Tooltip>
                    )
                  } */}
      
                  {/* <TableMenu menus={[
                   
                    // {
                    //     url: `/maintLogs`,
                    //     query: {
                    //       id: record?.id,
                    //       file: extra.file
                    //     },
                    //     label: "Maint Log",
                    //     breadcrumbRoute: [
                    //       {
                    //         title: "Member Profile",
                    //         href: `/memberProfile`,// Add parameter if needed eg. /generalParameter/?id=123
                    //       },
                    //       {
                    //         title: "Maintenance Log",
                    //       },
                    //     ]
                    // }
                  ]} />
                     */}
                </Space>
              </Flex>
            ),
          },
  
    ];

    function goView(id: string,year:string,month:string) {
      router.push({
        pathname: "/commissions/Group",
        query: {
          id: id,
          mode: "VIEW",
          year,
          month,
        },
      });
    }
  // function showInfo(record: any, index: number) {
  //   dispatch(
  //     openGlobalModal({
  //       title: "Function Account Detail",
  //       status: "custom",
  //       message: <ShowDetail data={record} />,
  //     })
  //   );
  // }

  function alertRemove(id: string, itemDesc: string, desc: string) {
    
    dispatch(
      openGlobalModal({
        title: "Delete Record",
        message: RemoveDetail(itemDesc, desc),
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
      fn: getRemoveCheckerMaker({ id }),
    });
    if (success) {

      setTimeout(() => {
        dispatch(refreshTable())
        showModal(dispatch, {
          title: "Delete Record",
          message: "Record Deleted",
        });
        // router.push("/generalParameter");
      }, 200);
    }
  }

  function goAdd() {
    router.push({
      pathname: "/checkerMaker/Detail",
      query: {
        // id: "",
        mode: "ADD"
      },
    });
  }

  function goEdit(id: string, pscmkcde:string) {
    router.push({
      pathname: "/checkerMaker/Detail",
      query: {
        id: id,
        pscmkcde: pscmkcde,
        mode: "EDIT", 
      },
    });
  }

//   function goView(id: string) {
//     router.push({
//       pathname: "/generalParameter/Detail",
//       query: {
//         id: id,
//         mode: "VIEW"
//       },
//     });
//   }

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
    dataIndex: "pscompec", render: (_: string, record: any) => <>{`${parseFloat(record?.commission_percentage).toFixed(2)}%`}</>,

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
    title: "Comm. Hold (RM)",
    dataIndex: "comm_pay",
    key: "comm_pay", align: 'right',
 },
 
];
 const expandedRowRender = (record:any) => (
    <Table
      rowKey="id"
      data={tableData2}
      refreshFn={getGroupCom}
      totalRecords={totalRecords2}
      extraParams={{
       month: record.month,
        year: record.year,
        psmbruid: record.psmbruid,
        //   type: category,
      }}
      columns={expandColumns}
    // pagination={false}
    />
  );
  function searchOnChange(event: any) {
    setSearch(event.target.value);
  }

  function categoryOnchange(event: any) {
    setCategory(event.target.value);
  }

  function statusOnchange(event: any) {
    setStatus(event.target.value);
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
  useEffect(() => {
    if (tempToDate && tempFromDate && tempToDate < tempFromDate)
      setDateError(true);
    else setDateError(false);
  }, [tempFromDate, tempToDate]);
  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
             Commissions
            </Text>
            <Breadcrumbs breadcrumbItems={[
              {
                title: "Commissions",
                // href: '/memberProfile'
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
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.CHKMKRPAR_ADD)) && (
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
                <Flex flexDir={"column"}>
                                  <Input
                                    name="fromYear"
                                    onChange={fromYearOnChange}
                                    placeholder="Enter From Year"
                                    value={fromYear}
                                  >
                
                                  </Input>
                                  {dateError && <Text fontSize={"sm"} color={"red"} mt={2}>From cannot be greater than To</Text>}
                
                                  {fromYear && new Date(fromYear, 0,1).getFullYear()!==+fromYear && <Text fontSize={"sm"} color={"red"} mt={2}>Invalid Year</Text>}
                
                                  {!fromYear && fromMonth && <Text fontSize={"sm"} color={"red"} mt={2}>Field is required</Text>}
                                </Flex>
                                <Flex flexDir={"column"}>
                
                                  <Select
                                    name="fromMonth"
                                    onChange={fromMonthOnChange}
                                    placeholder="Select From Month"
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
                
                                  <Input
                                    name="toYear"
                                    onChange={toYearOnChange}
                                    placeholder="Enter To Year"
                                    value={toYear}
                                  >
                
                                  </Input>
                                  {toYear && new Date(toYear, 0,1).getFullYear()!==+toYear && <Text fontSize={"sm"} color={"red"} mt={2}>Invalid Year</Text>}
                
                                  {!toYear && toMonth && <Text fontSize={"sm"} color={"red"} mt={2}>Field is required</Text>}
                                </Flex>
                                <Flex flexDir={"column"}>
                
                                  <Select
                                    name="toMonth"
                                    onChange={toMonthOnChange}
                                    placeholder="Select To Month"
                                    value={toMonth}
                                  >
                                    {ddlData?.MONTH?.map((option: DDL_TYPES) => (
                                      <option key={option.prgecode} value={option.prgecode}>
                                        {option.prgedesc}
                                      </option>
                                    ))}
                                  </Select>
                
                                  {!toMonth && toYear && <Text fontSize={"sm"} color={"red"} mt={2}>Field is required</Text>}
                                </Flex>
                {/* <Input
                  type="text"
                  name="search"
                  onChange={searchOnChange}
                  placeholder="Search"
                  value={search}
               */} 
                <Select
                  name="status"
                  onChange={statusOnchange}
                  placeholder="Please Select Agent"
                  value={status}
                >
                  {Array.isArray(agents)&&agents?.map((option: any) => (
                    <option key={option.psmbruid} value={option.psmbruid}>
                      {option.psmbrnme}
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
                   refreshFn={getPersonalCom}
                   totalRecords={totalRecords}
                  //  expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }}
                   extraParams={{
                    psmbruid:status,
                    //  psmbruid: props.id,
                    fromMonth,
                    fromYear,
                    toMonth,
                    toYear,
                     //   type: category,
                   }}
                 />
        </Card>
      </Box>
    </>
  );
}


const RemoveDetail = (item: string, itemDesc: string ) => {
  return (
    <Box w={"100%"} display="flex" flexDirection="column" alignItems="center">
      {/* <Icon as={IoWarningOutline} w={150} h={150} color={Colors.DANGER}/> */}
      <Text p={3}>Are you sure to delete this record?</Text>
      <Text>{item} - {itemDesc}</Text>
    </Box>
  )
};
