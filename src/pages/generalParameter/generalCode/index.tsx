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
import { AiOutlineLeft } from "react-icons/ai";

import { FiMoreVertical } from "react-icons/fi";
import { AiFillEye } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal, refreshTable } from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import useFetchGeneralCode from "@app/hooks/selector/useFetchGeneralCode";
import {
  fetchGenCode,
  getRemoveGenCode,
} from "@app/redux/generalParam/slice";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { BsPencil } from "react-icons/bs";
import { ImSad2 } from "react-icons/im";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";

export default function GeneralCodePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sendRequest, loading } = useApi({ title: "General Parameter - General Code" });

  //sample code how to use this hook
  const id = String(router.query?.id);

  const [tableData, refreshFn, totalRecords, extra] = useFetchGeneralCode({ id: id });
  //pass tableData to table

  const desc = String(router.query?.desc);

  const [search, setSearch] = useState();

  const columns: any[] = [
    {
      title: "General Code",
      dataIndex: "prgecode",
      key: "prgecode",
    },
    {
      title: "Description",
      dataIndex: "prgedesc",
      key: "prgedesc",
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
            <Tooltip label='Edit' fontSize='sm'>
              <IconButton
                variant="outline"
                size={"sm"}
                borderRadius={2}
                colorScheme="blue"
                sx={{ _hover: { backgroundColor: Colors.PRIMARY, color: Colors.BACKGROUND } }}
                icon={<BsPencil />}
                aria-label={"edit"}
                onClick={() => goEdit(record.prgtycde, record.prgecode)}
              />
            </Tooltip>
            <Tooltip label='Delete' fontSize='sm'>
              <IconButton
                variant="outline"
                size={"sm"}
                borderRadius={2}
                colorScheme="red"
                sx={{ _hover: { backgroundColor: Colors.DANGER, color: Colors.BACKGROUND } }}
                icon={<IoTrash />}
                aria-label={"delete"}
                onClick={() => alertRemove(record?.prgtycde, record?.prgecode, record?.prgedesc)}
              />
            </Tooltip>
            <TableMenu
              menus={[
                {
                  url: `/maintLogs`,
                  query: {
                    id: record.prgtycde + "-" + record?.prgecode,
                    file: extra.file,
                  },
                  label: "Maint Log",
                  breadcrumbRoute: [
                    {
                      title: "General Type",
                      href: "/generalParameter"
                    },
                    {
                      title: "General Code",
                      href: `/generalParameter/generalCode/?id=${id}`,
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
  //       title: "Function Account Detail",
  //       status: "custom",
  //       message: <ShowDetail data={record} />,
  //     })
  //   );
  // }

  function alertRemove(typeCode: string, genCode: string, desc: string) {
    dispatch(
      openGlobalModal({
        title: "Delete record",
        message: RemoveDetail(genCode, desc),
        status: "warning",
        actions: [
          {
            title: "Confirm",
            onClick: () => onRemove(typeCode, genCode),
          },
          {
            title: "Cancel",
            isClose: true,
          },

        ],
      })
    );
  }

  // async function onRemove(id: any) {
  //   console.log("id =============>>>>>>>>>>", id)
  //   const { success } = await sendRequest({
  //     fn: getRemoveGenCode({prgecode: id}),

  //   });

  //   if (success) {

  //     setTimeout(() => {
  //       showModal(dispatch, {
  //         title: "Remove item",
  //         message: "Removed",
  //       });
  //       router.push("/generalParameter/generalCode");
  //     }, 200);
  //   }

  // }

  async function onRemove(typeCode: string, genCode: string) {
    const { success } = await sendRequest({
      fn: getRemoveGenCode({ prgtycde: typeCode, prgecode: genCode }),
    });
    if (success) {

      setTimeout(() => {
        dispatch(refreshTable());
        showModal(dispatch, {
          title: "Delete Record",
          message: "Record Deleted",
        });
        router.push({
          pathname: "/generalParameter/generalCode",
          query: {
            id: id,
            desc: desc,
          },
        });
      }, 200);
    }
  }

  function goAdd(id: string) {
    router.push({
      pathname: "/generalParameter/generalCode/Detail",
      query: {
        id: "",
        prgtycde: id,
        desc: desc,

        mode: "ADD"
      },
    });
  }

  function goEdit(typeCode: string, genCode: string) {
    router.push({
      pathname: "/generalParameter/generalCode/Detail",
      query: {
        id: typeCode,
        genCode: genCode,
        desc: desc,

        mode: "EDIT"
      },
    });
  }

  function goView(id: string) {
    router.push({
      pathname: "/generalParameter/generalCode/Detail",
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
    <>
      <Box>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="500" mb={1}>
              General Code
            </Text>
            <Breadcrumbs breadcrumbItems={[
              {
                title: "General Type",
                href: "/generalParameter"
              },
              {
                title: "General Code",
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
            <Space size="small">
              <Buttons
                buttonDefaultType={"BACK"} onclick={() => router.back()}
              />
              <Buttons
                buttonDefaultType={"ADD"} onclick={() => goAdd(id)}
              />
            </Space>
          </Box>
        </Flex>
        <Card p={1} mt={4}>
          <Flex direction={"column"}>

            <Text fontSize={"sm"} fontWeight={600} paddingTop={"20px"} paddingLeft={"20px"} paddingBottom={"10px"}>General Type : {id} - {desc}</Text>
            <Space size="middle" >
              <Input
                marginLeft={"20px"} marginBottom={"20px"}
                type="text"
                name="search"
                onChange={searchOnChange}
                placeholder="Search"
                value={search}
              />
            </Space>
          </Flex>
          <Table
            columns={columns}
            data={tableData}
            refreshFn={fetchGenCode}
            totalRecords={totalRecords}
            extraParams={{
              search: search,
              prgtycde: id
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
