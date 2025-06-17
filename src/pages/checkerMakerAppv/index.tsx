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
import { fetchRequest } from "@app/redux/request/slice";
import useFetchRequests from "@app/hooks/selector/useFetchRequests";
import useFetchDDLChkMkr from "@app/hooks/selector/useFetchDDLChkMkr";
import useFetchDDLUser from "@app/hooks/selector/useFetchDDLUser";
export default function TestReceiverPage(type: String) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const homeData = useAppSelector(selectHome);
  const { sendRequest, loading } = useApi({ title: "Checker Maker Approval" });

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] = useFetchRequests();
  const [ddlData] = useFetchDDL({ code: ["APRV"] });
  const [checkerMakerParams] = useFetchDDLChkMkr();
  const [users] = useFetchDDLUser();
  //pass tableData to table
  // const [pageSize, setPageSize] = useState(10);
  // const [page, setPage] = useState(1);
  const [tempFromDate, setTempFromDate] = useState<any>();
  const [tempToDate, setTempToDate] = useState<any>();
  const [dateError, setDateError] = useState(false);
  const [index, setIndex] = useState(0);
  const [pscmkcde, setPscmkcde] = useState("");
  const [psrqtmkr, setPsrqtmkr] = useState("");
  const [psrqtsts, setPsrqtsts] = useState("PEN");
  const [search, setSearch] = useState();
  const [psrwmuid, setPsrwmuid] = useState("");
  const [psrwpoid, setpsrwpoid] = useState("");
  const [psrwaveh, setpsrwaveh] = useState("");
  useEffect(() => {
    if (tempToDate && tempFromDate && tempToDate < tempFromDate)
      setDateError(true);
    else setDateError(false);
  }, [tempFromDate, tempToDate]);
  const columns: any[] = [
    {
      title: "Submitted Date",
      dataIndex: "psrqtmkd",
      key: "psrqtmkd",
    },
    {
      title: "Request Type",
      dataIndex: "pscmkcdedsc",
      key: "pscmkcdedsc",
    },
   
    {
      title: "Member ID",
      dataIndex: "psrqtbdy",
      key: "psrqtbdy",
      render: (_: any) =>
        <Flex direction={"column"} alignItems={"center"}>
            <Text>{JSON.parse(_).psrwmuid}</Text>
            <Text fontSize={"smaller"}>{JSON.parse(_).psrwmbnm}</Text>
          </Flex>

    },
    
    {
      title: "Policy No.",
      dataIndex: "psrqtbdy",
      key: "psrqtbdy",
      render: (_: any) =>
        <Flex direction={"column"} alignItems={"center"}>
      <Text>{  (JSON.parse(_).psrwpoid === "undefined" || !(JSON.parse(_).psrwpoid)) ? "-" : JSON.parse(_).psrwpoid
      }</Text>
      <Text fontSize={"smaller"}>{(JSON.parse(_).psrwaveh === "undefined" || !(JSON.parse(_).psrwaveh)) ? "-" : JSON.parse(_).psrwaveh
      }</Text>
    </Flex>

      
    },
   
    {
      title: "Submitted By",
      dataIndex: "psrqtmkr",
      key: "psrqtmkr",
    },
    {
      title: "Status",
      dataIndex: "psrqtstsdsc",
      key: "psrqtstsdsc",
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
            {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.CHKMKRAPV_EDIT)) && (
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
            {/* {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.TRCV_DEL)) && (
                <Tooltip label='Delete' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="red"
                    sx={{ _hover: { backgroundColor: Colors.DANGER, color: Colors.BACKGROUND } }}
                    icon={<IoTrash />}
                    aria-label={"delete"}
                    onClick={() => alertRemove(record?.id, record?.psusrunm, record?.pstrctypdsc)}
                  />
                </Tooltip>
              )
            } */}
            {/* <TableMenu
              menus={[
                {
                  url: `/maintLogs`,
                  query: {
                    id: record?.psusrunm + "-" + record?.pstrctyp,
                    file: extra.file,
                  },
                  label: "Maint Log",
                  breadcrumbRoute: [
                    {
                      title: "Test Recipients",
                      href: `/testReceiver`,
                    },
                    {
                      title: "Maintenance Log",
                    },
                  ]
                },
              ]}
            /> */}
          </Space>
        </Flex>
      ),
    },
  ];

  // function alertRemove(id: string, id2: string, desc: string) {
  //   dispatch(
  //     openGlobalModal({
  //       title: "Delete Record",
  //       message: RemoveDetail(id2, desc),
  //       status: "warning",
  //       actions: [
  //         {
  //           title: "Confirm",
  //           onClick: () => onRemove(id),
  //         },
  //         {
  //           title: "Cancel",
  //           isClose: true,
  //           props: {
  //             variant: "danger",
  //           },
  //         },
  //       ],
  //     })
  //   );
  // }

  // async function onRemove(id: string) {
  //   const { success } = await sendRequest({
  //     fn: remove({ id }),
  //   });

  //   if (success) {
  //     dispatch(refreshTable())
  //     setTimeout(() => {
  //       showModal(dispatch, {
  //         title: "Delete Record",
  //         message: "Record Deleted",
  //       });
  //     }, 200);
  //   }
  // }

  function goAdd() {
    router.push({
      pathname: "/testReceiver/Detail",
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

  function goEdit(id: string) {
    router.push({
      pathname: "/checkerMakerAppv/Detail",
      query: {
        id: id,
        mode: "EDIT",
        myReq: index === 0 ? false : true,
      },
    });
  }


  function statusOnChange(event: any) {
    setPsrqtsts(event.target.value);
  }
  function makerOnChange(event: any) {
    setPsrqtmkr(event.target.value);
  }
  function typeOnChange(event: any) {
    setPscmkcde(event.target.value);
  }
  function psrwmuidOnChange(event: any) {
    setPsrwmuid(event.target.value);
  }
  function psrwavehOnChange(event: any) {
    setpsrwaveh(event.target.value);
  }
  function psrwpoidOnChange(event: any) {
    setpsrwpoid(event.target.value);
  }

  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
              Checker Maker Approval Listing
            </Text>
            <Breadcrumbs breadcrumbItems={[
              {
                title: "Checker Maker Approval Listing"
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
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.TRCV_ADD)) && (
                <Buttons
                  buttonDefaultType={"ADD"} onclick={() => goAdd()}
                />
              )
            } */}

            {/* <Link href="#" onClick={() => {
              setPscmkcde("");
              setPsrqtmkr("");
              setPsrqtsts("PEN");

              setPsrwmuid("");
              setpsrwpoid("");
              setpsrwaveh("");
            }}>Clear All</Link> */}

            <Buttons
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
            />
          </Box>
        </Flex>
        {/* <Card p={4} mt={5}> */}
        <Card
          borderRadius={0}
          p={4}
          mt={Spacing.containerPx}
          className="grid grid-cols-1 gap-6"
        >


          <Flex mb="0" bgColor="#fff" justifyContent={"space-between"} >
            <Box
              pr={{
                base: 0,
                md: Spacing.containerPx,
              }}
              display="flex"
            >
              <Space size="middle">
                <Flex flexDir="row" gap={12} flex={1} w="100%" >

                  <Flex flexDir="column" gap={4} flex={1}
                  >

                    <Box display="flex" flexDir={"column"} gap={1}
                    >
                      {/* <Input
                  type="text"
                  name="search"
                  onChange={searchOnChange}
                  placeholder="Search"
                  value={search}
                /> */}

                      {/* <Text>From Date</Text> */}
                      <FormLabel>From Date</FormLabel>

                      <DatePicker
                        format="DD/MM/YYYY"
                        className="w-full"
                        placeholder="Select Date"
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
                    <Box display="flex" flexDir={"column"} gap={1}
                    >
                      {/* <Input
                  type="text"
                  name="search"
                  onChange={searchOnChange}
                  placeholder="Search"
                  value={search}
                /> */}

                      {/* <Text>Member ID / Name</Text> */}
                      <FormLabel>Member ID / Name</FormLabel>

                      <Input
                        type="text"
                        name="search"
                        onChange={psrwmuidOnChange}
                        placeholder="Member ID / Name"
                        value={psrwmuid}
                      />
                      {/* <RangePicker style={{ width: '100%' }} placeholder={['From Date', 'To Date']} /> */}
                    </Box>


                  </Flex>
                  {/* todo dropdown */}
                  <Flex flexDir="column" gap={4} flex={1}>
                    <FormControl isInvalid={dateError}>
                      <Box display="flex" flexDir="column">
                        <Box
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
                        {dateError && (
                          <FormErrorMessage>
                            {"From Date cannot be greater than To Date"}
                          </FormErrorMessage>
                        )}
                      </Box>
                    </FormControl>


                    <Box display="flex" flexDir={"column"} gap={1}
                    >
                      {/* <Input
                  type="text"
                  name="search"
                  onChange={searchOnChange}
                  placeholder="Search"
                  value={search}
                /> */}

                      {/* <Text>Policy No.</Text> */}
                      <FormLabel>Policy No.</FormLabel>


                      <Input
                        type="text"
                        name="search"
                        onChange={psrwpoidOnChange}
                        placeholder="Policy No."
                        value={psrwpoid}
                      />
                      {/* <RangePicker style={{ width: '100%' }} placeholder={['From Date', 'To Date']} /> */}
                    </Box>


                  </Flex>
                  <Flex flexDir="column" gap={4} flex={1} >
                    <Box display="flex" flexDir={"column"} gap={1}>
                      {/* <Text>Request Type</Text> */}
                      <FormLabel>Request Type</FormLabel>

                      <Select
                        name="requestType"
                        onChange={typeOnChange}
                        placeholder="Select Request Type"
                        value={pscmkcde}
                      >
                        {Array.isArray(checkerMakerParams) && checkerMakerParams?.map((option: any) => (
                          <option key={option.pscmkcde} value={option.pscmkcde}>
                            {option.pscmkdsc}
                          </option>
                        ))}
                      </Select>
                    </Box>
                    <Box display="flex" flexDir={"column"} gap={1}
                    >
                      {/* <Input
                  type="text"
                  name="search"
                  onChange={searchOnChange}
                  placeholder="Search"
                  value={search}
                /> */}

                      {/* <Text>Vehicle No.</Text> */}
                      <FormLabel>Vehicle No.</FormLabel>

                      <Input
                        type="text"
                        name="search"
                        onChange={psrwavehOnChange}
                        placeholder="Vehicle No."
                        value={psrwaveh}
                      />
                      {/* <RangePicker style={{ width: '100%' }} placeholder={['From Date', 'To Date']} /> */}
                    </Box>

                  </Flex>
                  <Flex flexDir="column" gap={4} flex={1} >
                    <Box display="flex" flexDir={"column"} gap={1}>
                      {/* <Text>Status</Text> */}
                      <FormLabel>Status</FormLabel>

                      <Select
                        name="status"
                        onChange={statusOnChange}
                        placeholder="Select Status"
                        value={psrqtsts}
                      >
                        {ddlData?.APRV?.map((option: DDL_TYPES) => (
                          <option key={option.prgecode} value={option.prgecode}>
                            {option.prgedesc}
                          </option>
                        ))}
                      </Select>
                    </Box>
                    {index === 0 && <Box display="flex" flexDir={"column"} gap={1}>
                      {/* <Text>Submitted By</Text> */}
                      <FormLabel>Submitted By</FormLabel>


                      <Select
                        name="submittedBy"
                        onChange={makerOnChange}
                        placeholder="Select Submitted By"
                        value={psrqtmkr}
                      >
                        {Array.isArray(users) && users?.filter(user => user.psusrunm !== homeData.psusrunm)?.map((option: any) => (
                          <option key={option.psusrunm} value={option.psusrunm}>
                            {option.psusrnam}
                          </option>
                        ))}
                      </Select>
                    </Box>}


                  </Flex>

                </Flex>

              </Space>
            </Box>
          </Flex>
        </Card>

        <Tabs onChange={async (idx) => {
          setIndex(idx);

          if (idx === 0) {
            await dispatch(fetchRequest({
              fromDate: tempFromDate,
              toDate: tempToDate,
              psrqtmkr,
              pscmkcde, psrqtsts,

            }));
          } else {
            await dispatch(fetchRequest({
              fromDate: tempFromDate,
              toDate: tempToDate,
              psrqtmkr: homeData?.psusrunm,
              pscmkcde, psrqtsts,

            }))
          }

        }
        }
          mt={Spacing.containerPx} position="relative" variant="unstyled" sx={{
            // ".chakra-tabs__tab-indicator" :{
            //   marginLeft:'17.5px',
            // }
          }}>

          <Card
            borderRadius={0}
            p={4}
            mt={1}
            className="grid grid-cols-1 gap-6"
          >
            <TabList >
              <Tab>Approval Listing</Tab>
              <Tab>My Request</Tab>
            </TabList>
          </Card>

          <TabIndicator
            mt="-1.5px"
            height="2px"
            bg="blue.500"
            borderRadius="1px"
          />
          <TabPanels mt={2}>
            <TabPanel p={0}>
              {index === 0 && <Card
                borderRadius={0}
                p={4}
                mt={Spacing.containerPx}
                className="grid grid-cols-1 gap-6"
              >
                <Table
                  rowKey="id"
                  columns={columns}
                  data={tableData}
                  refreshFn={fetchRequest}
                  totalRecords={totalRecords}
                  extraParams={{
                    from: tempFromDate,
                    to: tempToDate,
                    psrqtmkr,
                    pscmkcde,
                    psrqtsts,
                    psrwmuid,
                    psrwpoid,
                    psrwaveh,
                  }}
                />
              </Card>}
            </TabPanel>
            <TabPanel p={0}>
              {index === 1 && <Card
                borderRadius={0}
                p={4}
                mt={Spacing.containerPx}
                className="grid grid-cols-1 gap-6"
              ><Table
                  rowKey="id"
                  columns={columns}
                  data={tableData}
                  refreshFn={fetchRequest}
                  totalRecords={totalRecords}
                  extraParams={{
                    from: tempFromDate,
                    to: tempToDate,
                    psrqtmkr: homeData?.psusrunm,
                    pscmkcde,
                    psrqtsts,
                    psrwmuid,
                    psrwpoid,
                    psrwaveh,
                  }}
                />                 </Card>
              }
            </TabPanel>

          </TabPanels>
        </Tabs>

        {/* </Card> */}
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
