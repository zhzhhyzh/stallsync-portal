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
} from "@chakra-ui/react";
// assets
import React, { ChangeEventHandler, useEffect, useState } from "react";

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
import { BsPencil } from "react-icons/bs";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Buttons from "@app/components/common/Buttons/Buttons";
import { fetchSegments, getRemoveSegment } from "@app/redux/segment/slice";
import useFetchSegments from "@app/hooks/selector/useFetchSegments";

export default function SegmentPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const homeData = useAppSelector(selectHome);  
  const { sendRequest, loading } = useApi({ title: "Segment Listing" });

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] = useFetchSegments();
  const [ddlData] = useFetchDDL({ code: ["YESORNO"] });
  //pass tableData to table
  // const [pageSize, setPageSize] = useState(10);
  // const [page, setPage] = useState(1);

  const [search, setSearch] = useState();
  const [status, setStatus] = useState();

  const columns: any[] = [
    {
      title: "Segment Code",
      dataIndex: "pssegcde",
      key: "pssegcde",
    },
    {
      title: "Description",
      dataIndex: "pssegdsc",
      key: "pssegdsc",
    },
    {
      title: "Local Description",
      dataIndex: "psseglds",
      key: "psseglds",
    },
    {
      title: "Active",
      dataIndex: "pssegsts",
      key: "pssegsts",
      render: (_: string, record: any) => (
        record?.pssegsts
        === "Y" ? <Text fontWeight={"normal"} color={"white"} textAlign="center" style={{
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
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.SEG_EDIT)) && (
                <Tooltip label='Edit' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="blue"
                    sx={{ _hover: { backgroundColor: Colors.PRIMARY, color: Colors.BACKGROUND } }}
                    icon={<BsPencil />}
                    aria-label={"edit"}
                    onClick={() => goEdit(record?.pssegcde)}
                  />
                </Tooltip>
              )
            }
            {/* {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.SEG_DEL)) && (
                <Tooltip label='Delete' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="red"
                    sx={{ _hover: { backgroundColor: Colors.DANGER, color: Colors.BACKGROUND } }}
                    icon={<IoTrash />}
                    aria-label={"delete"}
                    onClick={() => alertRemove(record?.pssegcde, record?.pssegdsc)}
                  />
                </Tooltip>
              )
            } */}
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
                      title: "Segments Listing",
                      href: `/segment`,
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

  async function onRemove(id: string) {
    const { success } = await sendRequest({
      fn: getRemoveSegment({ id }),
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
      pathname: "/segment/Detail",
      query: {
        id: "",
        mode: "ADD"
      },
    });
  }

  function goEdit(id: string) {
    router.push({
      pathname: "/segment/Detail",
      query: {
        id: id,
        mode: "EDIT"
      },
    });
  }

  function searchOnChange(event: any) {
    setSearch(event.target.value);
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
              Segments Listing
            </Text>
            <Breadcrumbs breadcrumbItems={[
              {
                title: "Segments Listing"
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
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.SEG_ADD)) && (
                <Buttons 
                  buttonDefaultType={"ADD"} onclick={() => goAdd()}
                />
              )
            }
          </Box>
        </Flex>
        <Card p={4} mt={5}>
          <Flex bgColor="#fff" justifyContent={"space-between"} pb={3}>
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
                </Select>
              </Space>
            </Box>
          </Flex>
          <Table
            rowKey="pssegcde"
            columns={columns}
            data={tableData}
            refreshFn={fetchSegments}
            totalRecords={totalRecords}
            extraParams={{
              search: search,
              pssegsts: status,
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