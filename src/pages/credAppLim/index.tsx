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
import useFetchCredAppLims from "@app/hooks/selector/useFetchCredAppLims";
import {
  fetchCredAppLims,
  getRemoveCredAppLim,
} from "@app/redux/credAppLim/slice";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { BsPencil } from "react-icons/bs";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { MdLockReset } from "react-icons/md";
import {numberWithCommas, parseThousandsToNumber, numberPattern} from "@app/utils/StringUtils";

export default function CredAppLimPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sendRequest, loading } = useApi({ title: "Credi Approval Limit" });
  const homeData = useAppSelector(selectHome);

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] = useFetchCredAppLims({});
  // const [ddlData] = useFetchDDL({ code: ["GTCAT"] });
  //pass tableData to table

  const [search, setSearch] = useState();
  const [category, setCategory] = useState();



  const columns: any[] = [
    {
      title: "APPROVED LIMIT",
      dataIndex: "pscalamt",
      key: "pscalamt",
      render: (pscalamt: number) => (
        <Text>{numberWithCommas(pscalamt)}</Text>

      ),
    },
    {
      title: "APPROVAL TYPE",
      dataIndex: "pscaltyp",
      key: "pscaltyp",
      render: (_: any, record: any) => (
        <Text>{`${record.pscaltyp}`} - {`${record.pscaltypdsc}`}</Text>
      )
    },
    {
      title: "CREDIT APPROVAL ROLE 1",
      dataIndex: "pscalar1",
      key: "pscalar1",
      render: (_: any, record: any) => (
        <Text>{`${record.pscalar1dsc}`}</Text>
      )
    },

    {
      title: "CREDIT APPROVAL ROLE 2",
      dataIndex: "pscalar2",
      key: "pscalar2",
      render: (_: any, record: any) => (
        // <Text>{`${record.pscalar2dsc}`}</Text>
        <Text>{`${record.pscalar2dsc ?? ""}`}</Text>

      )
    },
    // {
    //   title: "Affect Code",
    //   dataIndex: "pstrnaf1",
    //   key: "pstrnaf1",
    //   render: (_: any, record: any) => (
    //     // <Text>{`${record.pstrnaf1} - ${record.pstrnaf1dsc}`}</Text>
    //     <Text>{`${record.pstrnaf1} - ${record.pstrnaf1dsc}`}</Text>

    //   )
    // },
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
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.CREDAPP_EDIT)) && (
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
              // todo
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.CREDAPP_DEL)) && (
                <Tooltip label='Delete' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="red"
                    sx={{ _hover: { backgroundColor: Colors.DANGER, color: Colors.BACKGROUND } }}
                    icon={<IoTrash />}
                    aria-label={"delete"}
                    onClick={() => alertRemove(record?.id, record?.pscalamt)}
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
                    title: "Credit Approval Limit",
                    href: `/credAppLim`,// Add parameter if needed eg. /generalParameter/?id=123
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
        title: "Delete record",
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
      fn: getRemoveCredAppLim({ id }),
    });
    if (success) {

      setTimeout(() => {
        dispatch(refreshTable())
        showModal(dispatch, {
          title: "Delete Record",
          message: "Record Deleted",
        });
        router.push("/credAppLim");
      }, 200);
    }
  }

  function goAdd() {
    router.push({
      pathname: "/credAppLim/Detail",
      query: {
        id: "",
        mode: "ADD"
      },
    });
  }

  function goEdit(id: string) {
    router.push({
      pathname: "/credAppLim/Detail",
      query: {
        id: id,
        mode: "EDIT"
      },
    });
  }

  function goView(id: string) {
    router.push({
      pathname: "/credAppLim/Detail",
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

  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4} py={Spacing.gap}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
              Credit Approval Limit
            </Text>
            <Breadcrumbs breadcrumbItems={[
              {
                title: "Credit Approval Limit"
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
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.CREDAPP_ADD)) && (
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
            refreshFn={fetchCredAppLims}
            totalRecords={totalRecords}
            extraParams={{
              search: search,
              type: category,

            }}
          //onDoubleClick={showInfo}
          //length={pageSize}
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
      {/* <Text>{item} - {itemDesc}</Text> */}
      <Text>{item}</Text>

    </Box>
  )
};
