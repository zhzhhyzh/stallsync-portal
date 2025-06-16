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
import { fetchAccountBillings, fetchAccountRelationships } from "@app/redux/accountManagement/slice";
import useFetchAccountBillings from "@app/hooks/selector/useFetchAccountBillings";
import BillingDetailForm from "@app/components/forms/AccountManagement/BillingDetailForm";
import useFetchAccountRelationships from "@app/hooks/selector/useFetchAccountRelationships";

export default function AccountRelationshipList(props: any) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sendRequest, loading } = useApi({
    title: "Account Relationship List",
  });
  const homeData = useAppSelector(selectHome);
  const accountNo = props.accountNo;

  const { isOpen, onOpen, onClose } = useDisclosure();

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] = useFetchAccountRelationships();
  //pass tableData to table

  const [search, setSearch] = useState();
  const [recordId, setRecordId] = useState("");

  const columns: any[] = [
    {
      title: "Name",
      dataIndex: "psrlsnam",
      key: "psrlsnam",
    },
    {
      title: "Relationship",
      dataIndex: "pscusrlsdesc",
      key: "pscusrlsdesc",
    },
    {
      title: "Contact No.",
      dataIndex: "psrlscon",
      key: "psrlscon",
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
            {/* {homeData?.access &&
              checkAccessMatrix(homeData?.access, accessType.GEN_EDIT) && (
                <Tooltip label="Edit" fontSize="sm">
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="blue"
                    sx={{
                      _hover: {
                        backgroundColor: Colors.PRIMARY,
                        color: Colors.BACKGROUND,
                      },
                    }}
                    icon={<BsPencil />}
                    aria-label={"edit"}
                    onClick={() => goEdit(record?.pscifuid)}
                  />
                </Tooltip>
              )}
            {homeData?.access &&
              checkAccessMatrix(homeData?.access, accessType.PRODCODE_DEL) && (
                <Tooltip label="Delete" fontSize="sm">
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="red"
                    sx={{
                      _hover: {
                        backgroundColor: Colors.DANGER,
                        color: Colors.BACKGROUND,
                      },
                    }}
                    icon={<IoTrash />}
                    aria-label={"delete"}
                    onClick={() => alertRemove(record?.id, record?.psprddsc)}
                  />
                </Tooltip>
              )} */}
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

  function goEdit(id: string) {
    setRecordId(id);
    onOpen();
  }

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

  function searchOnChange(event: any) {
    setSearch(event.target.value);
  }

  return (
    <>
      <Card>
        <Text fontSize={"19pt"} fontWeight={"medium"} pb={2}>
          Account Relationship
        </Text>
        <Table
          columns={columns}
          data={tableData}
          refreshFn={fetchAccountRelationships}
          totalRecords={totalRecords}
          extraParams={{
            accNo: accountNo,
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
              Account Relationship Details - Edit
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <BillingDetailForm onClose={onClose} id={recordId} mode="EDIT" />
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
      <Text>
        {item} - {itemDesc}
      </Text>
    </Box>
  );
};
