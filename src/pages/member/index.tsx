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
import {
  closeGlobalModal,
  openGlobalModal,
  refreshTable,
  selectHome,
} from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";

// import useFetchGeneralType from "@app/hooks/selector/useFetchGeneralType";
import useFetchMembers from "@app/hooks/selector/useFetchMembers";

import {
  //   fetchGenType,
  //   getRemoveGenType,
  getMemberList,
} from "@app/redux/member/slice";

import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { BsPencil, BsFillEyeFill } from "react-icons/bs";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { MdLockReset } from "react-icons/md";
import useFetchDDLDsagent from "@app/hooks/selector/useFetchDDLDsAgent";
import useFetchDDLCompany from "@app/hooks/selector/useFetchDDLCompany";

export default function AgentProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sendRequest, loading } = useApi({ title: "Agent Profile" });
  const homeData = useAppSelector(selectHome);

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] =
    useFetchMembers({});
  const [ddlData] = useFetchDDL({ code: [] });
  //pass tableData to table

  const [search, setSearch] = useState();
  const [contact, setContact] = useState();
  const [category, setCategory] = useState();
  const [psmbrcom, setPsmbrcom] = useState();
  const [psmbrtyp, setPsmbrtyp] = useState();

  const [designations] = useFetchDDLDsagent()
  const [companies] = useFetchDDLCompany()

  const columns: any[] = [
    {
      title: "Agent ID",
      dataIndex: "user_tag",
      key: "user_tag",
    },
    {
      title: "Agent Name",
      dataIndex: "psmbrnme",
      key: "psmbrnme",
      width: "50%",
    },
    {
      title: "Contact No",
      dataIndex: "psmbrphn",
      key: "psmbrphn",
    },
    {
      title: "Email Address",
      dataIndex: "psmbreml",
      key: "psmbreml",
    },
    {
      title: "Designation",
      dataIndex: "psmbrtypdsc",
      key: "psmbrtypdsc",
    },
    {
      title: "Status",
      dataIndex: "psmbrsts",
      key: "psmbrsts",
      render: (data: any, record: any) => <span>{record.psmbrstsdsc}</span>,
    },
    {
      title: "Actions",
      key: "action",
      align: "center",
      width: "10rem",
      render: (_: any, record: any) => (
        <Flex justifyContent="center">
          <Space size="small">
            {homeData?.access && checkAccessMatrix(homeData?.access, accessType.MBRPROF_VIEW) && (

              <>
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
                    onClick={() => goView(record?.psmbruid)}
                  />
                </Tooltip>
                <Tooltip label='Edit' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="blue"
                    sx={{ _hover: { backgroundColor: Colors.PRIMARY, color: Colors.BACKGROUND } }}
                    icon={<BsPencil />}
                    aria-label={"edit"}
                    onClick={() => goEdit(record?.psmbruid)}
                  />
                </Tooltip>
              </>

            )}
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

  function goEdit(id: string) {
    router.push({
      pathname: "/member/Detail",
      query: {
        id: id,
        mode: "EDIT", //VIEW
      },
    });
  }

  function goView(id: string) {
    router.push({
      pathname: "/member/Detail",
      query: {
        id: id,
        mode: "VIEW"
      },
    });
  }

  function searchOnChange(event: any) {
    setSearch(event.target.value);
  }

  function categoryOnchange(event: any) {
    setCategory(event.target.value);
  }

  function contactOnchange(event: any) {
    setContact(event.target.value);
  }
  function psmbrtypOnchange(event: any) {
    setPsmbrtyp(event.target.value);
  }
  function psmbrcomOnchange(event: any) {
    setPsmbrcom(event.target.value);
  }

  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
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
                <Input
                  type="text"
                  name="search"
                  onChange={searchOnChange}
                  placeholder="Search"
                  value={search}
                />
                <Input
                  type="text"
                  name="contact"
                  onChange={contactOnchange}
                  placeholder="Contact No"
                  value={contact}
                />
                <Select
                  name="psmbrtyp"
                  onChange={psmbrtypOnchange}
                  placeholder="Please Select Designation"
                  value={psmbrtyp}
                >
                  {Array.isArray(designations) && designations?.map((option: any) => (
                    <option key={option.psdsgcde} value={option.psdsgcde}>
                      {option.psdsgdsc}
                    </option>
                  ))}
                </Select>
                <Select
                  name="psmbrcom"
                  onChange={psmbrcomOnchange}
                  placeholder="Please Select Company"
                  value={psmbrcom}
                >
                  {Array.isArray(companies) && companies?.map((option: any) => (
                    <option key={option.pscomuid} value={option.pscomuid}>
                      {option.pscomnme}
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
            refreshFn={getMemberList}
            totalRecords={totalRecords}
            extraParams={{
              search: search,
              psmbrphn: contact,
              psmbrtyp,
              psmbrcom
              //   type: category,
            }}
          />
        </Card>
      </Box>
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
