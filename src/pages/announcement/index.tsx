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
import Buttons from "@app/components/common/Buttons/Buttons";

// assets
import React, { ChangeEventHandler, useEffect, useState } from "react";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";

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
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { BsPencil } from "react-icons/bs";
import useFetchAnnouncements from "@app/hooks/selector/useFetchAnnouncements";
import { getremoveAnnouncement, list } from "@app/redux/announcement/slice";
import { formatDate } from "@app/utils/DateUtils";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import { AiFillEye } from "react-icons/ai";

export default function PaymentMethodsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sendRequest } = useApi({ title: "Announcement" });
  const homeData = useAppSelector(selectHome);

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] = useFetchAnnouncements();
  //pass tableData to table
  // const [pageSize, setPageSize] = useState(10);
  // const [page, setPage] = useState(1);

  const [search, setSearch] = useState();

  const columns: any[] = [
    {
      title: "Announcement Code",
      dataIndex: "psannuid",
      key: "psannuid",
    },
    {
      title: "Announcement Titles",
      dataIndex: "psannttl",
      key: "psannttl",
    },
    {
      title: "Announcement Type",
      dataIndex: "psanntyp",
      key: "psanntyp",
      render: (_: any, record: any) => (
        // <Text>{`${record.psanntyp} - ${record.psanntypdsc}`}</Text>
        <Text>{`${record.psanntyp} - ${record.psanntypdsc}`}</Text>

      )
    },
    {
      title: "Announcement Date",
      dataIndex: "psanndat",
      key: "psanndat"
    },
   
    
    {
      title: "Status",
      dataIndex: "psannsts",
      key: "psannsts",
      render: (_: any) => (
        _ === "Y" ? <Text fontWeight={"normal"} color={"white"} textAlign="center" style={{
          width: 40,
          height: 20,
          backgroundColor: Colors.SUCCESS,
          borderRadius: 10
        }}>Yes</Text> : <Text fontWeight={"normal"} color={"white"} textAlign="center" style={{
          width: 40,
          height: 20,
          backgroundColor: Colors.DANGER,
          borderRadius: 10,
        }}>No</Text>
      )
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
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.ANNOUNCE_VIEW)) && (

                <Tooltip label='View' fontSize='sm'>

                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="teal"
                    sx={{ _hover: { backgroundColor: Colors.SUCCESS2, color: Colors.BACKGROUND } }}

                    icon={<AiFillEye />}
                    aria-label={"view"}
                    onClick={() => goView(record?.id)}
                  />
                </Tooltip>
              )
            }
            {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.ANNOUNCE_EDIT)) && (
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
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.ANNOUNCE_DEL)) && (
                <Tooltip label='Delete' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="red"
                    sx={{ _hover: { backgroundColor: Colors.DANGER, color: Colors.BACKGROUND } }}
                    icon={<IoTrash />}
                    aria-label={"delete"}
                    onClick={() => alertRemove(record?.id, record?.psannttl)}
                  />
                </Tooltip>
              )
            }

            <TableMenu menus={[
              {
                url: `/maintLogs`,
                query: {
                  id: record?.id,
                  file: extra.file
                },
                label: "Maint Log",
                breadcrumbRoute: [
                  {
                    title: "Announcement",
                    href: `/announcement`,// Add parameter if needed eg. /generalParameter/?id=123
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
      fn: getremoveAnnouncement({ id }),
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
      pathname: "/announcement/Detail",
      query: {
        id: "",
        mode: "ADD"
      },
    });
  }

  function goEdit(id: string) {
    router.push({
      pathname: "/announcement/Detail",
      query: {
        id: id,
        mode: "EDIT"
      },
    });
  }

  function goView(id: string) {
    router.push({
      pathname: "/announcement/Detail",
      query: {
        id: id,
        mode: "VIEW"
      },
    });
  }

  function searchOnChange(event: any) {
    setSearch(event.target.value);
  }

  return (
    <Box>
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>

        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Announcement
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Announcement"
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
            (homeData?.access && checkAccessMatrix(homeData?.access, accessType.ANNOUNCE_ADD)) && (
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

            </Space>
          </Box>
        </Flex>
        <Table
          columns={columns}
          data={tableData}
          refreshFn={list}
          totalRecords={totalRecords}
          extraParams={{
            psanntyp: search,
          }}
        />
      </Card>
    </Box>
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
