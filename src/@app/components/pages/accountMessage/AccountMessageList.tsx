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
  Modal,
  ModalOverlay,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  RadioGroup,
  Stack,
  Radio,
  FormLabel,
} from "@chakra-ui/react";
// assets
import React, { ChangeEventHandler, useEffect, useState } from "react";

import { DatePicker, Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";
import Card from "@app/components/common/Card/Card";
import Table from "@app/components/common/Table/Table";
import { IoAdd, IoTrash, IoWarningOutline } from "react-icons/io5";
import { FiMoreVertical } from "react-icons/fi";
import { AiFillEye } from "react-icons/ai";
import { BsPencil } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import {
  closeGlobalModal,
  openGlobalModal,
  refreshTable,
  selectHome,
} from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { fetchAccountMessages, fetchAccountTransactions } from "@app/redux/accountManagement/slice";
import useFetchAccountTransactions from "@app/hooks/selector/useFetchAccountTransactions";
import useFetchAccountMessages from "@app/hooks/selector/useFetchAccountMessages";

export default function AccountMessageList(props: any) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sendRequest, loading } = useApi({
    title: "Account Message List",
  });
  const homeData = useAppSelector(selectHome);
  const accountNo = props.accountNo;

  const { isOpen, onOpen, onClose } = useDisclosure();

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] =
    useFetchAccountMessages();
  //pass tableData to table

  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [recordId, setRecordId] = useState("");

  const columns: any[] = [
    {
      title: "Date Created",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Notes Type",
      dataIndex: "psmsgtypdesc",
      key: "psmsgtypdesc",
    },
    {
      title: "Notes",
      dataIndex: "psmsgcon",
      key: "psmsgcon",
    },
    {
      title: "Created By",
      dataIndex: "crtuser",
      key: "crtuser",
    },
    {
      title: "Expiry Date",
      dataIndex: "psexpdte",
      key: "psexpdte",
    },
    {
      title: "Actions",
      key: "action",
      align: "center",
      width: "10rem",
      render: (_: any, record: any) => (
        <Flex justifyContent="flex-end">
          <Space size="small">
            {/* <IconButton
              // colorScheme={"blue"}
              icon={<AiFillEye />}
              aria-label={"view"}
              onClick={() => showInfo(record)}
            /> */}
            {homeData?.access &&
              checkAccessMatrix(homeData?.access, accessType.GEN_EDIT) && (
                <Tooltip label="View" fontSize="sm">
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="green"
                    sx={{
                      _hover: {
                        backgroundColor: Colors.SUCCESS,
                        color: Colors.BACKGROUND,
                      },
                    }}
                    icon={<AiFillEye />}
                    aria-label={"view"}
                    onClick={() => goView(record?.pscifuid)}
                  />
                </Tooltip>
              )}
            <TableMenu
              menus={[
                {
                  url: `/maintLogs`,
                  query: {
                    id: record?.psaccnam,
                    file: extra.file,
                  },
                  label: "Maint Log",
                  breadcrumbRoute: [
                    {
                      title: "Loan Account Listing Inquiry",
                      href: `/accountManagement`, // Add parameter if needed eg. /generalParameter/?id=123
                    },
                    {
                      title: "Maintenance Log",
                    },
                  ],
                },
              ]}
            />
          </Space>
        </Flex>
      ),
    },
  ];

  function goView(id: string) {
    setRecordId(id);
    onOpen();
  }

  function alertRemove(id: string, desc: string) {
    dispatch(
      openGlobalModal({
        title: "Delete Record",
        message: RemoveDetail(id, desc),
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
    // const { success } = await sendRequest({
    //   fn: getRemoveProdCode({id}),
    // });
    // if (success) {
    //   setTimeout(() => {
    //     dispatch(refreshTable())
    //     showModal(dispatch, {
    //       title: "Delete Record",
    //       message: "Record Deleted",
    //     });
    //     router.push("/productCodes");
    //   }, 200);
    // }
  }

  function fromDateOnChange(event: any) {
    setFrom(event.target.value);
  }

  function toDateOnChange(event: any) {
    setTo(event.target.value);
  }

  return (
    <>
      <Card>
        <Text fontSize={"19pt"} fontWeight={"medium"} pb={2}>
          Account Notes Listing
        </Text>
        <Flex flexDir="row" gap={4} flex={1} p={3}>
          <Flex flexDir={"column"} w="200px">
            <FormLabel>From Date</FormLabel>
            <DatePicker
              format="DD/MM/YYYY"
              className="w-full"
              placeholder="From Date"
              onChange={(d) => {
                // @ts-ignore
                // if (new Date(formatDate(d)) instanceof Date && !isNaN(new Date(formatDate(d)))) setTempFromDate(formatDate(d))
                // else setTempFromDate("")
                setFrom(d);
              }}
              value={from}
            />
          </Flex>
          <Flex flexDir={"column"} w="200px">
            <FormLabel>To Date</FormLabel>
            <DatePicker
              format="DD/MM/YYYY"
              className="w-full"
              placeholder="To Date"
              onChange={(d) => {
                // @ts-ignore
                // if (new Date(formatDate(d)) instanceof Date && !isNaN(new Date(formatDate(d)))) setTempFromDate(formatDate(d))
                // else setTempFromDate("")
                setTo(d);
              }}
              value={to}
            />
          </Flex>
        </Flex>

        <Table
          columns={columns}
          data={tableData}
          refreshFn={fetchAccountMessages}
          totalRecords={totalRecords}
          extraParams={{
            accNo: accountNo,
            from_date: from,
            to_date: to,
          }}
          //onDoubleClick={showInfo}
          //length={pageSize}
        />
      </Card>
      <Modal isOpen={isOpen} size="xl" onClose={onClose}>
        <ModalOverlay />
        <ModalContent w={"150%"}>
          <ModalHeader>
            <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
              Account Note Details
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>

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
      <Text>
        {item} - {itemDesc}
      </Text>
    </Box>
  );
};
