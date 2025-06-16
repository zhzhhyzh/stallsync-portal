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
import useFetchFileManagements from "@app/hooks/selector/useFetchFileManagements";


import {
  fetchFileManagementList,
  getRemoveFileManagement,
} from "@app/redux/fileManage/slice";

import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { BsPencil } from "react-icons/bs";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { MdLockReset } from "react-icons/md";

export default function FileManagementPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sendRequest, loading } = useApi({ title: "File Management" });
  const homeData = useAppSelector(selectHome);  

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] = useFetchFileManagements();
//   const [ddlData] = useFetchDDL({ code: ["GTCAT"] });
  //pass tableData to table


  const [search, setSearch] = useState();
  const [category, setCategory] = useState();

  const columns: any[] = [
    {
      title: "File Name",
      dataIndex: "pstblnme",
      key: "pstblnme",
    },
    {
      title: "File Description",
      dataIndex: "pstbldsc",
      key: "pstbldsc",
    },
    {
      title: "File Type",
      dataIndex: "pstbltyp",
      key: "pstbltyp",
      render: (data: any, record: any) => (  
          <Space>
            {data}-{record.pstbltypdsc}
          </Space>
      ),
    },
    {
      title: "Parent File",
      dataIndex: "pstblpnt",
      key: "pstblpnt",
      width: "1rem",
      render: (data: any, record: any) => (
        data === "" ? <Text fontWeight={"normal"} color={"white"} textAlign="center"></Text> 
        : <Space>{data}-{record.pstblpntdsc}</Space>
    ),
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
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.FILEMANAGE_EDIT)) && (
                <Tooltip label='Edit' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="blue"
                    sx={{ _hover: { backgroundColor: Colors.PRIMARY, color: Colors.BACKGROUND } }}
                    icon={<BsPencil />}
                    aria-label={"edit"}
                    onClick={() => goEdit(record?.id)}
                  />
                </Tooltip>
                
              )
            }
            {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.FILEMANAGE_DEL)) && (
                <Tooltip label='Delete' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="red"
                    sx={{ _hover: { backgroundColor: Colors.DANGER, color: Colors.BACKGROUND } }}
                    icon={<IoTrash />}
                    aria-label={"delete"}
                    onClick={() => alertRemove(record?.id, record?.pstbldsc)}
                  />
                </Tooltip>
              )
            }
            
            <TableMenu menus={[
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.FILEMANAGE_EDIT)) && {
                url: `/fileManagements/tableKeys`,
                query: {
                  pstblnme: record?.pstblnme,
                  pstbldsc: record?.pstbldsc,
                },
                label: "File Key",
              },
              {
                  url: `/maintLogs`,
                  query: {
                    id: record?.pstblnme,
                    file: extra.file
                  },
                  label: "Maint Log",
                  breadcrumbRoute: [
                    {
                      title: "File Management",
                      href: `/fileManagements`,// Add parameter if needed eg. /generalParameter/?id=123
                    },
                    {
                      title: "Maintenance Log",
                    },
                  ]
              }
            ]} />
              
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
    const { success } = await sendRequest({
      fn: getRemoveFileManagement({ id }),
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
      pathname: "/fileManagements/Detail",
      query: {
        id: "",
        mode: "ADD"
      },
    });
  }

  function goEdit(id: string) {
    router.push({
      pathname: "/fileManagements/Detail",
      query: {
        id: id,
        mode: "EDIT"
      },
    });
  }

  function searchOnChange(event: any) {
    setSearch(event.target.value);
  }

//   function categoryOnchange(event: any) {
//     setCategory(event.target.value);
//   }

  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="500" mb={1}>
             File Management
            </Text>
            <Breadcrumbs breadcrumbItems={[
              {
                title: "File Management"
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
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.FILEMANAGE_ADD)) && (
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
              </Space>
            </Box>
          </Flex>
          <Table
            columns={columns}
            data={tableData}
            refreshFn={fetchFileManagementList}
            totalRecords={totalRecords}
            extraParams={{
              search: search,
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