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

import useFetchCheckerMakers from "@app/hooks/selector/useFetchCheckerMakers";

import {
    getCheckerMakerList,
    getRemoveCheckerMaker
} from "@app/redux/checkerMaker/slice";


import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { BsPencil } from "react-icons/bs";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { MdLockReset } from "react-icons/md";
import dayjs from "dayjs";
import { table } from "console";

export default function CheckerMakerPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sendRequest, loading } = useApi({ title: "Checker Maker Parameter" });
  const homeData = useAppSelector(selectHome);  

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] = useFetchCheckerMakers();
  // const [ddlData] = useFetchDDL({ code: ["PRMTYPE", "RWDAUD", "YESORNO"] });
  //pass tableData to table

  const [search, setSearch] = useState();
  const [category, setCategory] = useState();
  const [status, setStatus] = useState();

  const columns: any[] = [
    {
      title: "Checker Maker Code",
      dataIndex: "pscmkcde",
      key: "pscmkcde",
    },
    {
      title: "Checker Maker Description",
      dataIndex: "pscmkdsc",
      key: "pscmkdsc",
    },
    {
      title: "User Group",
      dataIndex: "pscmkgrp",
      key: "pscmkgrp",
    },
    // {
    //   title: "CREDIT RATE",
    //   dataIndex: "psstpcrr",
    //   key: "psstpcrr",
    //   render: (data: any) => {
    //     return <span>{data}%</span>;

    //   },
      
    // },
    // {
    //   title: "DRIVER BADGE DESCRIPTION",
    //   dataIndex: "psstpdsc",
    //   key: "psstpdsc",
    // },

    {
      title: "Actions",
      key: "action",
      align: "center",
      width: "10rem",
      render: (_: any, record: any) => (
        <Flex justifyContent="center">
          <Space size="small">
          
          
            {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.CHKMKRPAR_EDIT)) && (
                <Tooltip label='Edit' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="blue"
                    sx={{ _hover: { backgroundColor: Colors.PRIMARY, color: Colors.BACKGROUND } }}
                    icon={<BsPencil />}
                    aria-label={"edit"}
                    onClick={() => goEdit(record?.id, record?.pscmkcde)}
                  />
                </Tooltip>
                
              )
              
            }
            
            {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.CHKMKRPAR_DEL)) && (
                <Tooltip label='Delete' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="red"
                    sx={{ _hover: { backgroundColor: Colors.DANGER, color: Colors.BACKGROUND } }}
                    icon={<IoTrash />}
                    aria-label={"delete"}
                    onClick={() => alertRemove(record?.id, record?.pscmkcde, record?.pscmkdsc)}
                  />
                </Tooltip>
              )
            }
            
            <TableMenu menus={[
              {
                  url: `/maintLogs`,
                  query: {
                    id: record?.pscmkcde,
                    file: extra.file
                  },
                  label: "Maint Log",
                  breadcrumbRoute: [
                    {
                      title: "Checker Maker",
                      href: `/checkerMaker`,// Add parameter if needed eg. /generalParameter/?id=123
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

  function alertRemove(id: string, itemDesc: string, desc: string) {
    
    dispatch(
      openGlobalModal({
        title: "Delete Record",
        message: RemoveDetail(itemDesc, desc),
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
      fn: getRemoveCheckerMaker({ id }),
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
      pathname: "/checkerMaker/Detail",
      query: {
        // id: "",
        mode: "ADD"
      },
    });
  }

  function goEdit(id: string, pscmkcde:string) {
    router.push({
      pathname: "/checkerMaker/Detail",
      query: {
        id: id,
        pscmkcde: pscmkcde,
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

  function statusOnchange(event: any) {
    setStatus(event.target.value);
  }

  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
              Checker Maker Control Parameter
            </Text>
            <Breadcrumbs breadcrumbItems={[
              {
                title: "Checker Maker Control Parameter Listing",
                // href: '/memberProfile'
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
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.CHKMKRPAR_ADD)) && (
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
                  placeholder="Please Select Notification Group"
                  value={category}
                >
                  {ddlData?.NOTCATG?.map((option: DDL_TYPES) => (
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
                  {ddlData?.YESORNO?.map((option: DDL_TYPES) => (
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
            refreshFn={getCheckerMakerList}
            totalRecords={totalRecords}
            extraParams={{
              search: search,
            //   psnotgrp: category,
            //   psngpsts: status,
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
