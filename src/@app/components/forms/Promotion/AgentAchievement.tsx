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
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Table as ChakraUITable,
  Td,

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
import { getApplicationList, getRemoveApplication } from "@app/redux/application/slice";
import useFetchApplications from "@app/hooks/selector/useFetchApplications";
import { formatDate } from "@app/utils/DateUtils";
import dayjs, { Dayjs } from "dayjs"
import CustomTabs from "@app/components/common/Tabs/CustomTabs";
import useFetchPromotionSales from "@app/hooks/selector/useFetchPromotionSales";
import { getDownlinePromotions, getRecruits, getSalesList } from "@app/redux/promotion/slice";
import useFetchDWPromotions from "@app/hooks/selector/useFetchDWPromotions";
import useFetchRecruitments from "@app/hooks/selector/useFetchRecruitments";
import { formatDecimal, numberWithCommas } from "@app/utils/StringUtils";
export default function AgentAcheivement() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const homeData = useAppSelector(selectHome);
  const { sendRequest, loading } = useApi({ title: "Promotion Sales" });

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] = useFetchPromotionSales();
  const [tableData2, refreshFn2, totalRecords2, extra2] = useFetchDWPromotions();
  const [tableData3, refreshFn3, totalRecords3, extra3] = useFetchRecruitments();
//   const [ddlData] = useFetchDDL({ code: ["APRV", "CUSTTYPE"] });

  //pass tableData to table
  // const [pageSize, setPageSize] = useState(10);
  // const [page, setPage] = useState(1);
  const [tempFromDate, setTempFromDate] = useState<any>();
  const [tempToDate, setTempToDate] = useState<any>();
  const [index, setIndex] = useState<number>(0);
  const [dateError, setDateError] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
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
      title: "Trans. Date",
      dataIndex: "pscomtrn",
      key: "pscomtrn",
    },
    {
      title: "Sales Type",
      dataIndex: "pscomstp",
      key: "pscomstp",
    },
    {
      title: "Product Code",
      dataIndex: "psprdcde",
      key: "psaplidn",
      render:(_:string,record:any)=>
        <>{_} - {record?.psprdcdedsc}</>
    },
    {
      title: "Trans. Amount",
      dataIndex: "psconamt",
      key: "psconamt",
      align:'right'
    },
    {
      title: "Agent ID",
      dataIndex: "psmbruid",
      key: "psmbruid",
   
    },
    {
      title: "Agent Name",
      dataIndex: "psmbrnme",
      key: "psmbrnme",
    },
    {
      title: "PSN/GRP",
      dataIndex: "indicator",
      key: "indicator",
      //   render: (_: any) =>
      //     formatDate(_)

    },
  
   
  ];
  const columns2: any[] = [
    {
      title: "Agent ID",
      dataIndex: "psmbruid",
      key: "psmbruid",
    },
    {
      title: "Agent Name",
      dataIndex: "psmbrnme",
      key: "psaplnme",
    },
    {
      title: "Recruited Date",
      dataIndex: "recruited_at",
      key: "recruited_at",
    },
    {
      title: "Promotion Date",
      dataIndex: "promoted_at",
      key: "promoted_at",
      align:'right'
    },
    {
      title: "New Designation",
      dataIndex: "new_designation",
      key: "new_designation",
   
    },
 
  ];
  const columns3: any[] = [
    {
      title: "Agent ID",
      dataIndex: "psmbruid",
      key: "psmbruid",
    },
    {
      title: "Agent Name",
      dataIndex: "psmbrnme",
      key: "psmbrnme",
    },
    {
      title: "Recruited Date",
      dataIndex: "recruited_at",
      key: "recruited_at",
    },
    {
      title: "No. of Case",
      dataIndex: "case_count",
      key: "case_count",
      align:'right'
    },
    
 
  ];

  

  



  return (
    <>
      <Box>
        
        {/* <Card p={4} mt={5}> */}
       
        <Flex mt={4} bgColor="#fff" py={2}>
          <Tabs onChange={async (idx) => {
            setIndex(idx);

            // if (idx === 0) {
            //   await dispatch(fetchApplications({


            //   }));
            // } else if(idx===1){
            //   await dispatch(fetchApplications({
            //    psaplsts:"NEW"


            //   }));
            // } else if(idx===2){
            //   await dispatch(fetchApplications({
            //    psaplsts:"PENREV"


            //   }));
            // } else if(idx===3){
            //   await dispatch(fetchApplications({
            //    psaplsts:"PENAPV"


            //   }));
            // } else if(idx===4){
            //   await dispatch(fetchApplications({
            //    psaplsts:"APV"


            //   }));
            // } else if(idx===5){
            //   await dispatch(fetchApplications({
            //    psaplsts:"REJ"


            //   }));
            // } else if(idx===6){
            //   await dispatch(fetchApplications({
            //    psaplsts:"CNL"


            //   }));
            // }

          }
          }
          >
            <Flex
              bgColor="#fff"
              justifyContent={"space-between"}
              alignItems={"flex-end"}
              gap={5}
            >
              <TabList          border={0}
              >
                <CustomTabs label={`Sales Achievement`} index={0} selectedTabIndex={index} />
                <CustomTabs label={`Downline Promotion`} index={1} selectedTabIndex={index} />
                <CustomTabs label={`Recruitment`} index={2} selectedTabIndex={index} />
                 </TabList>
            </Flex>
            </Tabs>
            </Flex>
            {index === 0 && router?.query?.id&&<>
            <Card   borderRadius={0}
                  p={4}
                  mt={Spacing.containerPx}
                  className="grid grid-cols-1 gap-6">
              <TableContainer             flex={1.5} w="400px"
            >
              <ChakraUITable  variant={"unstyled"}>
             
                <Tbody >
                  <Tr>
                    <Th py={'7px'} >Personal Sales</Th>
                    <Td py={'7px'} textAlign="right">{extra?.personal_sales}</Td>
             
                  </Tr>
                  <Tr>
                    <Th py={'7px'}>Group Sales</Th>
                    <Td py={'7px'}textAlign="right">{extra?.group_sales}</Td>
                  
                  </Tr>
                  <Tr borderTopWidth='1px'>
                    <Th py={'7px'}>Total Sales</Th>
                    <Td py={'7px'}fontWeight={"medium"} textAlign="right">{formatDecimal(parseFloat(extra?.personal_sales)+parseFloat(extra?.group_sales))}</Td>
                     </Tr>
                </Tbody>
              </ChakraUITable>
            </TableContainer>
            </Card>
             <Card
                  borderRadius={0}
                  p={4}
                  mt={Spacing.containerPx}
                  className="grid grid-cols-1 gap-6"
                >
                  <Table
                    rowKey="id"
                    columns={columns}
                    data={tableData}
                    refreshFn={getSalesList}
                    totalRecords={totalRecords}
                    extraParams={{
                      search,
                      psprmref: router?.query?.id,
                    }}
                  />
                </Card></>}
            {index === 1 && <Card
                  borderRadius={0}
                  p={4}
                  mt={Spacing.containerPx}
                  className="grid grid-cols-1 gap-6"
                >
                  <Table
                    rowKey="id"
                    columns={columns2}
                    data={tableData2}
                    refreshFn={getDownlinePromotions}
                    totalRecords={totalRecords2}
                    extraParams={{
                      search,
                      psprmref: router?.query?.id,
                    }}
                  />
                </Card>}
            {index === 2 && <Card
                  borderRadius={0}
                  p={4}
                  mt={Spacing.containerPx}
                  className="grid grid-cols-1 gap-6"
                >
                  <Table
                    rowKey="id"
                    columns={columns3}
                    data={tableData3}
                    refreshFn={getRecruits}
                    totalRecords={totalRecords3}
                    extraParams={{
                      search,
                      psprmref: router?.query?.id,
                    }}
                  />
                </Card>}
            {/* 
          <TabIndicator
            mt="-1.5px"
            height="2px"
            bg="blue.500"
            borderRadius="1px"
          /> */}

              
            
            
        
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
