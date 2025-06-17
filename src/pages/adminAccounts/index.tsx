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
  InputGroup,
  InputRightElement,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
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
import useFetchAdminAccounts from "@app/hooks/selector/useFetchAdminAccounts";
import {
  changeAdminPassword,
  fetchAdminAccounts,
  getRemoveAdmin,
} from "@app/redux/adminAccounts/slice";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { BsPencil } from "react-icons/bs";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Buttons from "@app/components/common/Buttons/Buttons";
import { MdLockReset } from "react-icons/md";
import { useFormik } from "formik";
import { PopUpPasswordSchema } from "@app/components/forms/@schemas/profileSchema";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";

export default function AdminAccountsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const homeData = useAppSelector(selectHome);  
  const { sendRequest, loading } = useApi({ title: "Admin Accounts" });

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] = useFetchAdminAccounts();
  const [ddlData] = useFetchDDL({ code: ["USRSTS", "USRROLE"] });
  //pass tableData to table
  // const [pageSize, setPageSize] = useState(10);
  // const [page, setPage] = useState(1);

  const [search, setSearch] = useState();
  const [status, setStatus] = useState();
  const [role, setRole] = useState();

  //Reset Password
  const [selectedId, setSelectedId] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const columns: any[] = [
    {
      title: "User ID",
      dataIndex: "psusrunm",
      key: "psusrunm",
      // render: (_: any, record: any) => (
      //   <Link color={Colors.PRIMARY} textDecoration={"underline"} onClick={() => goView(record?.id)}>{record?.psusrunm}</Link>
      // )
    },
    {
      title: "Name",
      dataIndex: "psusrnam",
      key: "psusrnam",
    },
    {
      title: "Role",
      dataIndex: "psusrroldsc",
      key: "psusrroldsc",
    },
    {
      title: "Status",
      dataIndex: "psusrstsdsc",
      key: "psusrstsdsc",
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
            {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.ADMA_EDIT)) && (
                <Tooltip label='Reset Password' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="blackAlpha"
                    sx={{ _hover: { backgroundColor: Colors.GRAY, color: Colors.BACKGROUND } }}
                    icon={<MdLockReset />}
                    aria-label={"edit"}
                    onClick={() => goReset(record?.id)}
                  />
                </Tooltip>  
              )
            }
            {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.ADMA_EDIT)) && (
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
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.ADMA_DEL)) && (
                <Tooltip label='Delete' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="red"
                    sx={{ _hover: { backgroundColor: Colors.DANGER, color: Colors.BACKGROUND } }}
                    icon={<IoTrash />}
                    aria-label={"delete"}
                    onClick={() => alertRemove(record?.id, record?.psusrnam)}
                  />
                </Tooltip>
              )
            }
            <TableMenu
              menus={[
                {
                  url: `/maintLogs`,
                  query: {
                    id: record?.id,
                    file: extra.file,
                  },
                  label: "Maint Log",
                  breadcrumbRoute: [
                    {
                      title: "User Accounts",
                      href: `/adminAccounts`,
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

  // function showInfo(record: any, index: number) {
  //   dispatch(
  //     openGlobalModal({
  //       title: "Admin Account Detail",
  //       status: "custom",
  //       message: <ShowDetail data={record} />,
  //     })
  //   );
  // }

  function alertRemove(id: string, desc: string) {
    dispatch(
      openGlobalModal({
        title: "Delete Record",
        message: RemoveDetail(id, desc),
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

  function goReset(id: string) {
    setSelectedId(id);
    onOpen();
  }

  async function onRemove(id: string) {
    const { success } = await sendRequest({
      fn: getRemoveAdmin({ id }),
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
      pathname: "/adminAccounts/Detail",
      query: {
        id: "",
        mode: "ADD"
      },
    });
  }

  function goEdit(id: string) {
    router.push({
      pathname: "/adminAccounts/Detail",
      query: {
        id: id,
        mode: "EDIT"
      },
    });
  }

  function goView(id: string) {
    router.push({
      pathname: "/adminAccounts/Detail",
      query: {
        id: id,
        mode: "VIEW"
      },
    });
  }

  function searchOnChange(event: any) {
    setSearch(event.target.value);
  }

  function statusOnchange(event: any) {
    setStatus(event.target.value);
  }

  function roleOnchange(event: any) {
    setRole(event.target.value);
  }

  function resetForm(){
    formik.resetForm();
    setShowNewPassword(false);
    setShowConPassword(false);
  }

  async function onSubmit(data: any) {
    const { success } = await sendRequest({
      fn: changeAdminPassword(data),
      formik,
    })

    if (success) {
        setTimeout(() => {
          onClose();
          showModal(dispatch, {
            title: "Reset Password",
            message: "Password Reset Successfully.",
          });
      }, 200);
    }
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      username: "",
      newpassword: "",
      conpassword: ""
    },
    validationSchema: PopUpPasswordSchema,
    onSubmit: (values) => {
      values.username = selectedId;
      onSubmit(values);
    },
  });

  const handleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleShowConPassword = () => {
    setShowConPassword(!showConPassword);
  };

  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="500" mb={1}>
              User Accounts
            </Text>
            <Breadcrumbs breadcrumbItems={[
              {
                title: "User Accounts"
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
            {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.ADMA_ADD)) && (
                <Buttons 
                  buttonDefaultType={"ADD"} onclick={() => goAdd()}
                />
              )
            }
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
                <Input
                  type="text"
                  name="search"
                  onChange={searchOnChange}
                  placeholder="Search"
                  value={search}
                />
                <Select
                  name="role"
                  onChange={roleOnchange}
                  placeholder="Please Select Role"
                  value={role}
                >
                  {ddlData?.USRROLE?.map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                <Select
                  name="status"
                  onChange={statusOnchange}
                  placeholder="Please Select Status"
                  value={status}
                >
                  {ddlData?.USRSTS?.map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
              </Space>
            </Box>
          </Flex>
          <Table
            columns={columns}
            data={tableData}
            refreshFn={fetchAdminAccounts}
            totalRecords={totalRecords}
            extraParams={{
              search: search,
              psusrsts: status,
              psusrrol: role,
            }}
          //onDoubleClick={showInfo}
          //length={pageSize}
          />
        </Card>
      </Box>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        onCloseComplete={() => resetForm()}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reset Password</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={formik.handleSubmit}>
            <ModalBody pb={6}>
              <Card
                  p={4}
                  mt={`${Spacing.containerPx}`}
                  className="grid grid-cols-1 gap-6"
                  width={"100%"}
              >
                <Box>
                  <Box display="flex" flexDir="column" gap={6} >
                    <FormControl
                        id="newpassword"
                        isInvalid={Boolean(formik.errors.newpassword) && Boolean(formik.touched.newpassword)}
                    >
                        {/* <FormLabel>New Password*</FormLabel> */}
                        <CustomFormLabel labelText="New Password"/>
                        <InputGroup>
                          <Input
                            pr="4.5rem"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter New Password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.newpassword}
                          />
                          <InputRightElement width="4.5rem">
                            <IconButton
                            h="1.75rem"
                            size="sm"
                            variant="ghost"
                            onClick={handleShowNewPassword}
                            icon={showNewPassword ? <ViewIcon /> : <ViewOffIcon />} aria-label={""}                      />
                          </InputRightElement>
                        </InputGroup>
                        {formik.errors.newpassword && (
                            <FormErrorMessage>{formik.errors.newpassword}</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl
                        id="conpassword"
                        isInvalid={Boolean(formik.errors.conpassword) && Boolean(formik.touched.conpassword)}
                    >
                        {/* <FormLabel>Confirm Password*</FormLabel> */}
                        <CustomFormLabel labelText="Confirm Password"/>
                        <InputGroup>
                          <Input
                            pr="4.5rem"
                            type={showConPassword ? "text" : "password"}
                            placeholder="Enter Confirm Password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.conpassword}
                          />
                          <InputRightElement width="4.5rem">
                            <IconButton
                            h="1.75rem"
                            size="sm"
                            variant="ghost"
                            onClick={handleShowConPassword}
                            icon={showConPassword ? <ViewIcon /> : <ViewOffIcon />} aria-label={""}                      />
                          </InputRightElement>
                        </InputGroup>
                        {formik.errors.conpassword && (
                            <FormErrorMessage>{formik.errors.conpassword}</FormErrorMessage>
                        )}
                    </FormControl>
                  </Box>
                </Box>
              </Card>
            </ModalBody>

            <ModalFooter>
              <Space size={"middle"}>
                <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
                <Buttons buttonDefaultType={"CLOSE"} onclick={onClose}/>
              </Space>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

// const ShowDetail = ({ data }: { data: any }) => (
//   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
//     <div className="">
//       <Text fontSize="sm" color={Colors.GRAY}>
//         User ID
//       </Text>
//       <Text>{data?.id}</Text>
//     </div>
//     <div className="">
//       <Text fontSize="sm" color={Colors.GRAY}>
//         Name
//       </Text>
//       <Text>{data?.psusrnam}</Text>
//     </div>
//     <div className="">
//       <Text fontSize="sm" color={Colors.GRAY}>
//         Role
//       </Text>
//       <Text>{data?.psusrtypdsc}</Text>
//     </div>
//     <div className="">
//       <Text fontSize="sm" color={Colors.GRAY}>
//         Status
//       </Text>
//       <Text>{data?.psusrstsdsc}</Text>
//     </div>
//     <div className="">
//       <Text fontSize="sm" color={Colors.GRAY}>
//         Email
//       </Text>
//       <Text>{data?.psusreml}</Text>
//     </div>
//     <div className="">
//       <Text fontSize="sm" color={Colors.GRAY}>
//         Phone no.
//       </Text>
//       <Text>{data?.psusrphn}</Text>
//     </div>
//   </div>
// );

const RemoveDetail = (item: string, itemDesc: string ) => {
  return (
    <Box w={"100%"} display="flex" flexDirection="column" alignItems="center">
      {/* <Icon as={IoWarningOutline} w={150} h={150} color={Colors.DANGER}/> */}
      <Text p={3}>Are you sure to delete this record?</Text>
      <Text>{item} - {itemDesc}</Text>
    </Box>
  )
};
