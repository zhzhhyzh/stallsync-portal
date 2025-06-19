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
import useFetchRewards from "@app/hooks/selector/useFetchRewards";
import {
  fetchrewards,
  getremoveReward,
} from "@app/redux/reward/slice";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { BsPencil } from "react-icons/bs";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { MdLockReset } from "react-icons/md";

export default function TranCodePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sendRequest, loading } = useApi({ title: "Reward" });
  const homeData = useAppSelector(selectHome);

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] = useFetchRewards({});
  // const [ddlData] = useFetchDDL({ code: ["GTCAT"] });
  //pass tableData to table
  const [ddlData] = useFetchDDL({ code: ["DISTYPE", "RWDSTS"] });
  const [search, setSearch] = useState();
  const [category, setCategory] = useState();
  const [aff, setAff] = useState();

  const columns: any[] = [
    {
      title: "Reward Code",
      dataIndex: "psrwduid",
      key: "psrwduid",
    },
    {
      title: "Name",
      dataIndex: "psrwdnme",
      key: "psrwdnme",
    },
    {
      title: "Description",
      dataIndex: "psrwddsc",
      key: "psrwddsc",
      render: (text: string) => (
        <Tooltip label={text} placement="top" hasArrow>
          <Text noOfLines={1} maxW="200px">
            {text}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Reward Type",
      dataIndex: "psrwdtyp",
      key: "psrwdtyp",
      render: (_: any, record: any) => (
        <Text>{`${record.psrwdtypdsc}`}</Text>
        // <Text>{`${record.psrwdtyp} - ${record.psrwdtypdsc}`}</Text>

      )
    },
    {
      title: "Quantity",
      dataIndex: "psrwdqty",
      key: "psrwdqty",
    },
    {
      title: "Active",
      dataIndex: "psrwdsts",
      key: "psrwdsts",
      render: (_: any, record: any) => {
        let text = "";
        let bgColor = "";

        switch (_) {
          case "A":
            text = "Available";
            bgColor = Colors.WARNING || "#f0ad4e";
            break;
          case "I":
            text = "Incoming";
            bgColor = Colors.SUCCESS || "#5cb85c";
            break;
          case "P":
            text = "Past";
            bgColor = Colors.DANGER || "#d9534f";
            break;
          case "O":
            text = "Out Of Stock";
            bgColor = Colors.DANGER || "#d9534f";
            break;
          default:
            return null;
        }

        return (
          <Text
            fontWeight="normal"
            color="white"
            textAlign="center"
            style={{
              width: 90,
              height: 20,
              backgroundColor: bgColor,
              borderRadius: 10,
              display: "inline-block",
              lineHeight: "20px"
            }}
          >
            {text}
          </Text>
        );
      }
    }
    ,

    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_: any, record: any) => (
        <Flex justifyContent="flex-end">
          <Space size="small">
            {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.MCH_VIEW)) && (

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
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.TRANCODE_EDIT)) && (
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
              // todo
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.TRANCODE_DEL)) && (
                <Tooltip label='Delete' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="red"
                    sx={{ _hover: { backgroundColor: Colors.DANGER, color: Colors.BACKGROUND } }}
                    icon={<IoTrash />}
                    aria-label={"delete"}
                    onClick={() => alertRemove(record?.id, record?.psrwdnme)}
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
                    title: "TranCode",
                    href: `/reward`,// Add parameter if needed eg. /generalParameter/?id=123
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
        title: "",
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
      fn: getremoveReward({ id }),
    });
    if (success) {

      setTimeout(() => {
        dispatch(refreshTable())
        showModal(dispatch, {
          title: "Remove item",
          message: "Removed",
        });
        router.push("/reward");
      }, 200);
    }
  }

  function goAdd() {
    router.push({
      pathname: "/reward/Detail",
      query: {
        id: "",
        mode: "ADD"
      },
    });
  }

  function goEdit(id: string) {
    router.push({
      pathname: "/reward/Detail",
      query: {
        id: id,
        mode: "EDIT"
      },
    });
  }

  function goView(id: string) {
    router.push({
      pathname: "/reward/Detail",
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

  function affOnchange(event: any) {
    setAff(event.target.value);
  }

  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
              Reward
            </Text>
            <Breadcrumbs breadcrumbItems={[
              {
                title: "Reward"
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
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.TRANCODE_ADD)) && (
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
                  name="DebitOrCredit"
                  onChange={categoryOnchange}
                  placeholder="Please Select Reward Status"
                  value={category}
                >
                  {ddlData?.RWDSTS?.map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>

                <Select
                  name="aff"
                  onChange={affOnchange}
                  placeholder="Please Select Discount Type"
                  value={aff}
                >
                  {ddlData?.DISTYPE?.map((option: DDL_TYPES) => (
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
            refreshFn={fetchrewards}
            totalRecords={totalRecords}
            extraParams={{
              search: search,
              psrwdsts: category,
              psrwdtyp: aff

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
      <Text>{item} - {itemDesc}</Text>
    </Box>
  )
};
