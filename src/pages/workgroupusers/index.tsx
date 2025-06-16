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
import React, { ChangeEventHandler, useEffect, useState, CSSProperties } from "react";
// import TfiUnlink
import { TfiUnlink } from "react-icons/tfi";

import { DatePicker, Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import Table from "@app/components/common/Table/Table";
import { IoAdd, IoTrash, IoWarningOutline } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal, refreshTable, selectHome } from "@app/redux/app/slice";
// import { LinkIcon } from '@fortawesome/react-fontawesome'

import { LinkIcon } from "@chakra-ui/icons"

import { showModal } from "@app/helpers/modalHelper";
import { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { BsPencil } from "react-icons/bs";
import { fetchWorkgroupUserList, getUnlinkWorkgroupUser } from "@app/redux/workgroupuser/slice";
import useFetchWorkgroupUsers from "@app/hooks/selector/useFetchWorkgroupUsers";

import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";

export default function WorkgroupsUserPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sendRequest, loading } = useApi({ title: "Workgroup User" });
  const homeData = useAppSelector(selectHome);  

  const id = String(router.query?.id); //workgroup code
  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] = useFetchWorkgroupUsers();
  //pass tableData to table
  // const [pageSize, setPageSize] = useState(10);
  // const [page, setPage] = useState(1);

  const customHeaderCellStyle: CSSProperties = {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    marginRight: 12
  };
  
  const customDataCellStyle: CSSProperties = {
      flex: 1,
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      marginLeft: 0,
  };

  const [search, setSearch] = useState();

  const columns: any[] = [
    {
      title: "Workgroup Code",
      dataIndex: "prwrkcde",
      key: "prwrkcde",
    },
    {
      title: "Workgroup User",
      dataIndex: "prwrkusr",
      key: "prwrkusr",
    },
    {
      title: <div style={customHeaderCellStyle}>ACTIONS</div>,
      key: "action",
      align: "center",
      width: "10rem",
      render: (_: any, record: any) => (
        <div style={customDataCellStyle}>
          <Space size="small">
            {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.WRKGRPUSR_UNLINK)) && (
                <Tooltip label='Unlink' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="red"
                    sx={{ _hover: { backgroundColor: Colors.DANGER, color: Colors.BACKGROUND } }}
                    icon={<TfiUnlink  />}
                    aria-label={"unlink"}
                    onClick={() => alertRemove(record?.id, record?.prwrkcde, record?.prwrkusr)}
                  />
                </Tooltip>
              )
            }
            
            <TableMenu
              menus={[
                {
                  url: `/maintLogs`,
                  query: {
                    prwrkcde: record?.prwrkcde,
                    prwrkusr: record?.prwrkusr,
                    file: extra.file,
                  },
                  label: "Maint Log",
                  breadcrumbRoute: [
                    {
                      title: "Workgroup",
                      href: `/workgroups`,// Add parameter if needed eg. /generalParameter/?id=123
                    },
                    {
                      title: "Workgroup User",
                      href: `/workgroupusers?prwrkcde=${record?.prwrkcde}&prwrkusr=${record?.prwrkusr}`,// Add parameter if needed eg. /generalParameter/?id=123
                    },
                    {
                      title: "Maintenance Log",
                    },
                  ]
                },
              ]}
            />
          </Space>
        </div>
      ),
    },
  ];

  function alertRemove(id: string, itemCode: string, desc: string) {
    dispatch(
      openGlobalModal({
        title: "Unlink Record",
        message: RemoveDetail(itemCode, desc),
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
      fn: getUnlinkWorkgroupUser({ id }),
    });
    
    if (success) {
      dispatch(refreshTable())
      setTimeout(() => {
        showModal(dispatch, {
          title: "Unlink Record",
          message: "Record Unlinked",
        });
      }, 200);
    }
  }

  function goAdd() {
    router.push({
      pathname: "/workgroupusers/Detail",
      query: {
        id: id,
        mode: "LINK"
      },
    });
  }

//   function goEdit(id: string) {
//     router.push({
//       pathname: "/workgroupusers/Detail",
//       query: {
//         id: id,
//         mode: "EDIT"
//       },
//     });
//   }

  function searchOnChange(event: any) {
    setSearch(event.target.value);
  }

  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4} py={Spacing.gap}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="500" mb={1}>
              Workgroup User
            </Text>
            <Breadcrumbs breadcrumbItems={[
              {
                title: "Workgroup",
                href: "/workgroups"
                // href: 
              },
              {
                title: "Workgroup User"
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
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.WRKGRPUSR_LINK)) && (
                <Buttons 
                  buttonDefaultType={"LINK"} onClick={() => goAdd()}
                />
                // <LinkIcon onClick={() => goAdd()}/>
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
              </Space>
            </Box>
          </Flex>
          <Table
            columns={columns}
            data={tableData}
            refreshFn={fetchWorkgroupUserList}
            totalRecords={totalRecords}
            extraParams={{
            //   prfuncde: search,
              prwrkusr: search,
              prwrkcde: id,
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
      <Text p={3}>Are you sure to unlink this record?</Text>
      <Text>{item} - {itemDesc}</Text>
    </Box>
  )
};
