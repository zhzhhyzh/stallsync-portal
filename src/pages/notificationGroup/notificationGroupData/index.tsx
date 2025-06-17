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

import useFetchNotificationGroupDataList from "@app/hooks/selector/useFetchNotificationGroupDataList";
import {
    getNotificationGroupDataList,
    getRemoveNotificationGroupData
} from "@app/redux/notificationGroupData/slice";

import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { BsPencil } from "react-icons/bs";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { MdLockReset } from "react-icons/md";

export default function NotificationGroupPage(props: any) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sendRequest, loading } = useApi({ title: "Notification Group Data" });
  const homeData = useAppSelector(selectHome);  

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] = useFetchNotificationGroupDataList();
  const [ddlData] = useFetchDDL({ code: ["GTCAT"] });
  //pass tableData to table

  const [search, setSearch] = useState();
  const [category, setCategory] = useState();

  // const psngpcde = props.psngpcde;
  const psngpcde = String(router.query?.psngpcde);
  const psngpdsc = String(router.query?.psngpdsc);
  
  const columns: any[] = [
    {
      title: "Data Code",
      dataIndex: "psnotcde",
      key: "psnotcde",
    },
    {
      title: "Data Description",
      dataIndex: "psngddsc",
      key: "psngddsc",
    //   width: "1rem"
    },
    {
      title: "Notification Channel",
      dataIndex: "psnotchn",
      key: "psnotchn",
      render: (data: any, record: any) => {
        return <span>{data} - {record.psnotchndsc}</span>
      },
    },
    {
        title: "Active",
        dataIndex: "psgrdsts",
        key: "psgrdsts",
        render: (_: any, record: any) => (
          _ === "Y" ? <Text fontWeight={"normal"} color={"white"} textAlign="center" style={{
            width: 60,
            height: 20,
            backgroundColor: Colors.SUCCESS,
            borderRadius: 10
          }}>{record?.psgrdstsdsc}</Text> : <Text fontWeight={"normal"} color={"white"} textAlign="center" style={{
            width: 60,
            height: 20,
            backgroundColor: Colors.DANGER,
            borderRadius: 10,
          }}>{record?.psgrdstsdsc}</Text>
        )
    },
    {
      title: "Actions",
      key: "action",
      align: "center",
      width: "10rem",
      render: (_: any, record: any) => (
        <Flex justifyContent="center">
          <Space size="small">
            {/* <IconButton
              // colorScheme={"blue"}
              icon={<AiFillEye />}
              aria-label={"view"}
              onClick={() => showInfo(record)}
            /> */}
            {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.NOTGRP_EDIT)) && (
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
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.NOTGRP_DEL)) && (
                <Tooltip label='Delete' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="red"
                    sx={{ _hover: { backgroundColor: Colors.DANGER, color: Colors.BACKGROUND } }}
                    icon={<IoTrash />}
                    aria-label={"delete"}
                    onClick={() => alertRemove( record?.psnotgrp,record?.psnotcde,record?.id)}
                  />
                </Tooltip>
              )
            }
            
            <TableMenu menus={[
            //   {
            //     url: `/memberProfile/memberNotification`,
            //     query: {
            //       id: record?.id,
            //       // file: extra.file
            //     },
            //     label: "Member Notification"
            //   },
              {
                  url: `/maintLogs`,
                  query: {
                    id: record?.psnotgrp+"-"+record?.psnotcde,
                    file: extra.file
                  },
                  label: "Maint Log",
                  breadcrumbRoute: [
                    {
                      title: "Notification Group",
                      href: `/notificationGroup`,// Add parameter if needed eg. /generalParameter/?id=123
                    },
                    {
                      title: "Notification Group Data",
                      href: `/notificationGroup/notificationGroupData`,// Add parameter if needed eg. /generalParameter/?id=123
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

  function alertRemove(id: string, desc: string, actualId:string) {
    
    dispatch(
      openGlobalModal({
        title: "Delete Record",
        message: RemoveDetail(id, desc),
        status: "warning",
        actions: [
          {
            title: "Confirm",
            onClick: () => {
              onRemove(actualId);
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
      fn: getRemoveNotificationGroupData({ id }),
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
      pathname: "/notificationGroup/notificationGroupData/Detail",
      query: {
        id: "",
        psngpcde: psngpcde,
        psngpdsc: psngpdsc,
        mode: "ADD"
      },
    });
  }

  function goEdit(id: string) {
    router.push({
      pathname: "/notificationGroup/notificationGroupData/Detail",
      query: {
        id: id,
        psngpcde: psngpcde,
        psngpdsc: psngpdsc,
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

  function searchOnChange(event: any) {
    setSearch(event.target.value);
  }

  function categoryOnchange(event: any) {
    setCategory(event.target.value);
  }

  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="500" mb={1}>
              Notification Group Data
            </Text>
            <Breadcrumbs breadcrumbItems={[
              {
                title: "Notification Group",
                href: '/notificationGroup'
              },
              {
                title: "Notification Group Data",
                // href: '/notificationGroup'
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
            <Space size={"small"}>

              <Buttons 
                buttonDefaultType={"BACK"} onclick={() => router.back()}
              />
              {
                (homeData?.access && checkAccessMatrix(homeData?.access, accessType.NOTGRP_ADD)) && (
                  <Buttons 
                    buttonDefaultType={"ADD"} onclick={() => goAdd()}
                  />
                )
              }

            </Space>
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
            rowKey="id"
            columns={columns}
            data={tableData}
            refreshFn={getNotificationGroupDataList}
            totalRecords={totalRecords}
            extraParams={{
              search: search,
              psnotgrp: psngpcde,
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