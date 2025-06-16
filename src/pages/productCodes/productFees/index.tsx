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
import useFetchProdFees from "@app/hooks/selector/useFetchProdFees";
import {
  getRemoveProdFee,
  fetchProdFees,
} from "@app/redux/prodFee/slice";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { BsPencil } from "react-icons/bs";
import { ImSad2 } from "react-icons/im";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";

export default function ProductFeesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sendRequest, loading } = useApi({ title: "Product Code - Product Fee Charges" });

  //sample code how to use this hook
  const id = String(router.query?.id);
  const desc = String(router.query?.desc);

  const [tableData, refreshFn, totalRecords, extra] = useFetchProdFees({ id: id });
  //pass tableData to table
  const [ddlData] = useFetchDDL({ code: ["FEEEVENT"] });

  const [search, setSearch] = useState();
  const [category, setCategory] = useState();

  const columns: any[] = [
    {
      title: "Fee Code",
      dataIndex: "psfeecde",
      key: "psfeecde",
      render: (_: any, record: any) => (
        <>{record.psfeecde} - {record.psfeedscdsc}</>


      )
    },
    {
      title: "Frequency",
      dataIndex: "psfeefqv-psfeefqt",
      key: "psfeefqv-psfeefqt",
      render: (_: any, record: any) => (
        record.psfeefqv ?
          <>{record.psfeefqv} - {record.psfeefqtdsc}</>
          :
          <>-</>

      )
    },
    {
      title: "Event Code",
      dataIndex: "psfeeevt",
      key: "psfeeevt",
      render: (_: any, record: any) => (
        <>{record.psfeeevt} - {record.psfeeevtdsc}</>


      )
    },

    {
      title: "Fee Balance Indicator",
      dataIndex: "psfeebin",
      key: "psfeebin",
      render: (_: any, record: any) => (
        <>{record.psfeebindsc}</>
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
                onClick={() => goEdit(record.id, id, desc)}
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
                onClick={() => alertRemove(record?.id, record?.psfeecde)}
              />
            </Tooltip>
            <TableMenu
              menus={[
                {
                  url: `/maintLogs`,
                  query: {
                    id: record.id,
                    file: extra.file,
                  },
                  label: "Maint Log",
                  breadcrumbRoute: [
                    {
                      title: "Product Code",
                      href: "/productCodes"
                    },
                    {
                      title: "Fee Charges",
                      href: `/productCodes/productFees/?id=${id}`,
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

  function alertRemove(id: string, code: string) {
    dispatch(
      openGlobalModal({
        title: "Delete record",
        message: RemoveDetail(code),
        status: "warning",
        actions: [
          {
            title: "Confirm",
            onClick: () => onRemove(id),
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

  async function onRemove(id: string) {
    const { success } = await sendRequest({
      fn: getRemoveProdFee({ id }),
    });
    if (success) {

      setTimeout(() => {
        dispatch(refreshTable());
        showModal(dispatch, {
          title: "Delete Record",
          message: "Record Deleted",
        });
        router.push({
          pathname: "/productCodes/productFees",
          query: {
            id: id,
          },
        });
      }, 200);
    }
  }

  function goAdd(id: string, desc: string) {
    router.push({
      pathname: "/productCodes/productFees/Detail",
      query: {
        id: "",
        psprdcod: id,
        psprddsc: desc,
        mode: "ADD"
      },
    });
  }

  function goEdit(id: string, psprdcod: string, desc: string) {
    router.push({
      pathname: "/productCodes/productFees/Detail",
      query: {
        id,
        psprdcod,
        psprddsc: desc,

        mode: "EDIT"
      },
    });
  }

  function goView(id: string, psprdcod: string, desc: string) {
    router.push({
      pathname: "/productCodes/productFees/Detail",
      query: {
        id: id,
        mode: "VIEW",
        psprddsc: desc,
        psprdcod,

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
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
              Product Fee Charges
            </Text>
            <Breadcrumbs breadcrumbItems={[
              {
                title: "Product Code",
                href: "/productCodes"
              },
              {
                title: "Product Fee Charges",
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
                buttonDefaultType={"ADD"} onclick={() => goAdd(id, desc)}
              />
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
                <Select
                  name="feeEvent"
                  onChange={categoryOnchange}
                  placeholder="Please Select Fee Event"
                  value={category}
                >
                  {ddlData?.FEEEVENT?.map((option: DDL_TYPES) => (
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
            refreshFn={fetchProdFees}
            totalRecords={totalRecords}
            extraParams={{
              search: search,
              psfeeevt: category,
              id: id
            }}
          //onDoubleClick={showInfo}
          //length={pageSize}
          />
        </Card>
      </Box>
    </>
  );
}


const RemoveDetail = (item: string) => {
  return (
    <Box w={"100%"} display="flex" flexDirection="column" alignItems="center">
      {/* <Icon as={IoWarningOutline} w={150} h={150} color={Colors.DANGER}/> */}
      <Text p={3}>Are you sure to delete this record?</Text>
      <Text>{item}</Text>
    </Box>
  )
};
