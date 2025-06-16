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
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
// assets
import React, { ChangeEventHandler, useEffect, useState } from "react";
import useFetchApplicationDetail from "@app/hooks/selector/useFetchApplicationDetail";

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
import {  getApplicationDocList, getApplicationList, getApproveApplication, getRemoveApplicationDoc } from "@app/redux/application/slice";
import useFetchApplicationDocuments from "@app/hooks/selector/useFetchApplicationDocuments";
import { formatDate } from "@app/utils/DateUtils";
import ApplicationDocumentForm from "./ContractDocumentForm";
import useFetchContractDoc from "@app/hooks/selector/useFetchContractDocs";
import useFetchContractDetail from "@app/hooks/selector/useFetchContractDetail";
import { getContractDocList, getRemoveContractDoc } from "@app/redux/contract/slice";

export default function DocumentListing(props: any) {

  useEffect(()=>{
    console.log(props.mode)
  },[props.mode])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen:isOpen2, onOpen:onOpen2, onClose:onClose2 } = useDisclosure()

  const router = useRouter();
  const dispatch = useAppDispatch();
  const homeData = useAppSelector(selectHome);
  const { sendRequest, loading } = useApi({ title: "Contract Document" });
  const id = props.id
  //sample code how to use this hoo k
  const [tableData, refreshFn, totalRecords, extra] = useFetchContractDoc({psconuid:id});
  // const [ddlData] = useFetchDDL({ code: ["APRV"] });

  //pass tableData to table
  // const [pageSize, setPageSize] = useState(10);
  // const [page, setPage] = useState(1);
  
  const [detailData, onInit, loading2, reset] = useFetchContractDetail(
    id,
  );
  const [mode, setMode] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [filename, setFilename] = useState<string>("");
  function searchOnChange(event: any) {
    setSearch(event.target.value);
  }

    const columns: any[] = [
    {
      title: "Document ID",
      dataIndex: "original_filename",
      key: "original_filename",
    },
    {
      title: "Document Description",
      dataIndex: "psdocdsc",
      key: "psdocdsc",
    },
    {
      title: "Date Received",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    
    {
      title: "Date Received",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    
    {
      title: "Actions",
      key: "action",
      align: "center",
      width: "10rem",
      render: (_: any, record: any) => (
        <Flex justifyContent="flex-end">
          <Space size="small">
            {
              // (homeData?.access && checkAccessMatrix(homeData?.access, accessType.TRCV_VIEW)) && (
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
                    onClick={() => goView(record?.psdocnme)}
                  />
                </Tooltip>
              // )
            }
            {/* {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.TRCV_EDIT)) && ( */}
            { mode!=="VIEW"&&<Tooltip label='Edit' fontSize='sm'>
              <IconButton
                variant="outline"
                size={"sm"}
                borderRadius={2}
                colorScheme="blue"
                sx={{ _hover: { backgroundColor: Colors.PRIMARY, color: Colors.BACKGROUND } }}
                icon={<BsPencil />}
                aria-label={"edit"}
                onClick={() => goEdit(record?.psdocnme)}
              />
            </Tooltip>}
            {/* //   )
            // } */}
            {/* { */}
              {/* // (homeData?.access && checkAccessMatrix(homeData?.access, accessType.TRCV_DEL)) && ( */}
               { mode!=="VIEW"&&<Tooltip label='Delete' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="red"
                    sx={{ _hover: { backgroundColor: Colors.DANGER, color: Colors.BACKGROUND } }}
                    icon={<IoTrash />}
                    aria-label={"delete"}
                    onClick={() => alertRemove(record?.psdocnme, record?.original_filename, record?.psdocdsc)}
                  />
                </Tooltip>}
              {/* // ) */}
            {/* } */}
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

  function alertRemove(id: string, id2: string, desc: string) {
    dispatch(
      openGlobalModal({
        title: "Delete Record",
        message: RemoveDetail(id2, desc),
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
      fn: getRemoveContractDoc({ id }),
    });

    if (success) {
      dispatch(refreshTable())
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
      pathname: "/application/Detail",
      query: {
        id: "",
        mode: "ADD"
      },
    });
  }

  function goView(id: string) {
    setFilename(id)
    setMode("VIEW")
    onOpen2()
  }

  function goEdit(id: string) {
    setFilename(id)
    setMode("EDIT")

    onOpen2()
    
    // router.push({
    //   pathname: "/application/Detail",
    //   query: {
    //     id: id,
    //     mode: "EDIT",
    //   },
    // });
  }



  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            {/* <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
              Document Listing
            </Text> */}
            {/* <Breadcrumbs breadcrumbItems={[
              {
                title: "Loan Application Listing"
              },
            ]} /> */}
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
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.TRCV_ADD)) && ( */}
               {props.mode!=="VIEW"&&<Buttons
                  buttonDefaultType={"ADD"} onclick={onOpen}
                />}
              {/* )
            } */}

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
                  refreshFn={getContractDocList}
                  totalRecords={totalRecords}
                  extraParams={{
                    psconuid:id,
                  }}
                />
              </Card>
        

        {/* </Card> */}
      </Box>
      <Modal  isOpen={isOpen} size="xl" onClose={onClose}>
        <ModalOverlay  />
        <ModalContent w={"150%"}   >
          <ModalHeader><Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Documents - Add
          </Text></ModalHeader>
          <ModalCloseButton />
          <ModalBody >
            <ApplicationDocumentForm onClose={onClose}  id={id} mode="ADD"/>
            {/* <Lorem count={2} /> */}
          </ModalBody>

          <ModalFooter>
            {/* <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Secondary Action</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal  isOpen={isOpen2} size="xl" onClose={()=>{onClose2();setMode("EDIT")}}>
        <ModalOverlay  />
        <ModalContent w={"150%"}   >
          <ModalHeader><Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Documents - { mode }
          </Text></ModalHeader>
          <ModalCloseButton onClick={()=>{onClose2();setMode("EDIT")}} />
          <ModalBody >
            <ApplicationDocumentForm filename={filename} onClose={onClose2} setMode={setMode} mode={mode} id={id} />
            {/* <Lorem count={2} /> */}
          </ModalBody>

          <ModalFooter>
            {/* <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Secondary Action</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
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
