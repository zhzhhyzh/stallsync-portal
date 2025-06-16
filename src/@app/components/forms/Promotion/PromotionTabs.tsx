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
import { getApplicationList, getRemoveApplication } from "@app/redux/application/slice";
import useFetchApplications from "@app/hooks/selector/useFetchApplications";
import { formatDate } from "@app/utils/DateUtils";
import dayjs, { Dayjs } from "dayjs"
import CustomTabs from "@app/components/common/Tabs/CustomTabs";
import AgentAcheivement from "./AgentAchievement";
import Approval from "./Approval";
import useFetchPromotionDetail from "@app/hooks/selector/useFetchPromotionDetail";
import useFetchDDLDsagent from "@app/hooks/selector/useFetchDDLDsAgent";
export default function PromotionTabs(props:any) {
    const id = props.id
    const mode = props.mode
  const router = useRouter();
  const dispatch = useAppDispatch();
  const homeData = useAppSelector(selectHome);
  const { sendRequest, loading: reqLoading } = useApi({ title: "Promotion" });
  const [detailData, onInit, loading2, reset] = useFetchPromotionDetail(id);

  const [loading, setLoading ] = useState(false)

  useEffect(()=>{
    setLoading(reqLoading)
  },[reqLoading])
  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] = useFetchApplications({});
  const [ddlData] = useFetchDDL({ code: ["APRV", "CUSTTYPE"] });
  const [designations] = useFetchDDLDsagent()
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
  const [formik, setFormik] = useState<any>("");

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
      title: "Appln No.",
      dataIndex: "psaplref",
      key: "psaplref",
    },
    {
      title: "Agent Name",
      dataIndex: "psaplnme",
      key: "psaplnme",
    },
    {
      title: "ID No",
      dataIndex: "psaplidn",
      key: "psaplidn",
    },
    {
      title: "Mobile No.",
      dataIndex: "psaplphn",
      key: "psaplphn",
    },
    {
      title: "Agent Class",
      dataIndex: "psapltyp",
      key: "psapltyp",
      render: (_: string, record: any) =>
        <> {_} - {record?.psapltypdsc}</>
    },
    {
      title: "Submitted By",
      dataIndex: "crtuser",
      key: "crtuser",
    },
    {
      title: "Appln Date",
      dataIndex: "psapldat",
      key: "psapldat",
      //   render: (_: any) =>
      //     formatDate(_)

    },
    {
      title: "Status",
      dataIndex: "psaplsts",
      key: "psaplsts",
      render: (_: any, record: any) =>
        <>{_} - {record.psaplstsdsc}</>

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
                onClick={() => goEdit(record?.psaplref, record?.psaplstsdsc)}
              />
            </Tooltip>
            {/* //   )
            // } */}
            <Tooltip label='Delete' fontSize='sm'>
              <IconButton
                variant="outline"
                size={"sm"}
                borderRadius={2}
                colorScheme="red"
                sx={{ _hover: { backgroundColor: Colors.DANGER, color: Colors.BACKGROUND } }}
                icon={<IoTrash />}
                aria-label={"delete"}
                onClick={() => alertRemove(record?.psaplref)}
              />
            </Tooltip>


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
                      title: "Application",
                      href: `/application`,
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
      fn: getRemoveApplication({ id }),
    });

    if (success) {
      dispatch(refreshTable())
      setTimeout(() => {
        showModal(dispatch, {
          title: "Delete Record",
          message: "Record Deleted",
        });
        // router.push("/application");
      }, 200);
    }
  }

  function goAdd() {
    router.push({
      pathname: "/application/Detail",
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
      pathname: "/application/Detail",
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
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4} py={Spacing.gap}>
             <Flex direction={"column"} alignSelf={"center"}>
               <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
                  Agent Promotion
               </Text>
               <Breadcrumbs breadcrumbItems={[
                 {
                   title: "Agent Promotion",
                   href: `/promotions`,// Add parameter if needed eg. /generalParameter/?id=123
                 },
                 {
                   title: "Agent Promotion Details",
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
               <Space size="small">
                 <Buttons
                   buttonDefaultType={"BACK"} onclick={() => {
                     router.back()
                     // setFeeMode("LISTING")
                   }}
                 />
                 {
                   index === 1 && (
                     <Buttons
                       buttonDefaultType={"SAVE"} buttonLoading={loading} onClick={formik?.handleSubmit}
                     />
                   )} 
               </Space>
             </Box>
           </Flex>
           <Card
          borderRadius={0}
          p={4}
          mt={Spacing.containerPx}
          className="grid grid-cols-1 gap-6"
        >
          <Flex w="70%" justifyContent={"space-between"} flexDir="row" px={"50px"} py="10px">
          <Flex flexDir="column">
            <Text fontWeight="semibold">{detailData?.member?.psmbrnme}</Text>
            <Text  >{detailData?.psmbruid}</Text>
            <Text>{detailData?.member?.application?.psaplidn}</Text>
          </Flex>

          <Flex flexDir="row">
          <Text fontWeight="semibold" mr="15px" textTransform={"uppercase"}>Upline: </Text>

          <Flex flexDir="column">
            <Text fontWeight="semibold">{detailData?.member?.psmbrnme}</Text>
            <Text>{detailData?.psmbruid}</Text>
            <Text>{detailData?.member?.application?.psaplidn}</Text>
          </Flex>
          </Flex>
          </Flex>

        </Card>
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
                <CustomTabs label={`Achievement`} index={0} selectedTabIndex={index} />
                <CustomTabs label={`Approval`} index={1} selectedTabIndex={index} />
                 </TabList>
            </Flex>
            </Tabs>
            </Flex>
          { index===0&&  <Card
          borderRadius={0}
          p={4}
          mt={Spacing.containerPx}
          className="grid grid-cols-1 gap-6"
        >


            <Flex mb="0" bgColor="#fff" justifyContent={"space-between"} >
                
<Flex flexDir="row" w="full" gap={Spacing.gap}>

<Flex flexDir="column"              flex={1}
>
                <FormLabel>Current Designation</FormLabel>
                  
                <Select
                    name="psapltyp"
                    disabled={true}
                    // onChange={psapltypOnChange}
                    // placeholder="Please Select Agent Class"
                    value={detailData?.member?.next_designation}
                    >
                    {Array.isArray(designations)&&designations?.map((option: any) => (
                        <option key={option.psdsgcde} value={option.psdsgdsc}>
                        {option.psdsgdsc}
                        </option>
                    ))}
                    </Select>
                  
                    
</Flex>

<Flex flexDir="column"   flex={1}>
                <FormLabel>Current Designation Status Date</FormLabel>
                  
               <DatePicker
                    name="psaplstd"
                    disabled={true}
                    // onChange={psapltypOnChange}
                    // placeholder="Please Select Agent Class"
                    value={dayjs(detailData?.psaplstd)}
                    />
                   
              
</Flex>
<Flex flexDir="column"                  flex={1}
>
                <FormLabel>New Designation</FormLabel>
                  
               <Select
                    name="next_designation"
                    disabled={true}
                    // onChange={psapltypOnChange}
                    // placeholder="Please Select Agent Class"
                    value={detailData?.member?.next_designation}
                    >
                    {Array.isArray(designations)&&designations?.map((option: any) => (
                        <option key={option.psdsgcde} value={option.psdsgdsc}>
                        {option.psdsgdsc}
                        </option>
                    ))}
                    </Select>
              
</Flex>   
                 
<Flex flexDir="column"                 flex={1}
>
                <FormLabel>Eligibility Start Date</FormLabel>
                  
               <DatePicker
                    name="eligibility_start"
                    disabled={true}
                    // onChange={psapltypOnChange}
                    // placeholder="Please Select Agent Class"
                    value={dayjs(detailData?.eligibility_start)}
                    />
                   
              
</Flex>

          <Flex flexDir="column"                 flex={1}
>
                <FormLabel>Eligibility End Date</FormLabel>
                  
               <DatePicker
                    name="eligibility_end"
                    disabled={true}
                    // onChange={psapltypOnChange}
                    // placeholder="Please Select Agent Class"
                    value={dayjs(detailData?.eligibility_end)}
                    />
                   
              
</Flex>         
</Flex>  
            </Flex>
        </Card>}
            {/* 
          <TabIndicator
            mt="-1.5px"
            height="2px"
            bg="blue.500"
            borderRadius="1px"
          /> */}

                {index === 0 && <AgentAcheivement/>}
            
                {index === 1 && <Approval setFormik={setFormik} id={id} mode={mode} setLoading={setLoading} detailData={detailData}/>}
            
            
        
        {/* </Card> */}
          { index===0&&<Flex justifyContent="flex-end" pl={10} pr={10} pt={10} >
              <Box>
                <Space size="small">
                  <Buttons buttonDefaultType={"BACK"} onclick={homeData?.psusrtyp === "AGT" ? () => router.push("/applicationAgent") : () => router.push("/application")} />
      
                
                    
                  
                </Space>
              </Box>
            </Flex>}
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
