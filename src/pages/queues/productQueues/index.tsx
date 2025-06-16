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

import { DatePicker, Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";
import { TfiUnlink } from "react-icons/tfi";

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


import useFetchProductQueueList from "@app/hooks/selector/useFetchProductQueueList";
import {
    fetchProductList,
    unlinkProductQueue,
} from "@app/redux/product/slice";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { BsPencil } from "react-icons/bs";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { MdLockReset } from "react-icons/md";

export default function ProductCodeQueuePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sendRequest, loading } = useApi({ title: "Queue Product Parameter" });
  const homeData = useAppSelector(selectHome);  
  const prquecod = String(router.query?.prquecod);

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] = useFetchProductQueueList({prquecod: prquecod});
  const [ddlData] = useFetchDDL({ code: ["ASGMTD"] });
  // const id = String(router.query?.QueueID);
  const prquedesc = String(router.query?.prquedesc);

  const prprodcd = String(router.query?.prprodcd);
  //pass tableData to table

  const customHeaderCellStyle: CSSProperties = {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    marginRight: 13
  };
  
  const customDataCellStyle: CSSProperties = {
      flex: 1,
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      marginLeft: 0,
  };

  const [search, setSearch] = useState();
  const [category, setCategory] = useState();

  const columns: any[] = [
    // {
    //   title: "Queue Code",
    //   dataIndex: "prquecod",
    //   key: "prquecod",
    // },
    {
      title: "Product Code",
      dataIndex: "prprodcd",
      key: "prprodcd",
    },
    {
      title: "Description",
      dataIndex: "prprodcddsc",
      key: "prprodcddsc",
    },
    // {
    //     title: "Status",
    //     dataIndex: "prprddsc",
    //     key: "prprddsc",
    //     render: (_: any, record: any) => (
    //       <Text>{`${record.prprddsc} - ${record.psprddscdsc}`}</Text>
    //     )
    //   },
    // {
    //   title: "Status",
    //   dataIndex: "psprdsts",
    //   key: "psprdsts",
    //   // render: (_: any, record: any) => (
    //   //   <Text>{`${record.psprdsts} - ${record.psprdstsdsc}`}</Text>
    //   // )
    // },
    // {
    //   title: "Status Date",
    //   dataIndex: "psprdstd",
    //   key: "psprdstd",
    //   render: (_: any, record: any) => (
    //     <Text>{formatDate(_,"DD/MM/YYYY")}</Text>
    //   )
    // },
    {
      title: <div style={customHeaderCellStyle}>ACTIONS</div>,
      key: "action",
      align: "center",
      width: "10rem",
      render: (_: any, record: any) => (
        <div style={customDataCellStyle}>
          <Space size="small">
            {/* {
              // todo
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.PRODUCTQ_UNLINK)) && (
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
            } */}
            {
              // todo
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.PRODUCTQ_UNLINK)) && (
                <Tooltip label='Unlink' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="red"
                    sx={{ _hover: { backgroundColor: Colors.DANGER, color: Colors.BACKGROUND } }}
                    icon={<TfiUnlink />}
                    aria-label={"unlink"}
                    onClick={() => alertRemove(record?.id, record?.prquecod, record?.prprodcd)}
                  />
                </Tooltip>
              )
            }
            
            <TableMenu menus={[              
              {
                  url: `/maintLogs`,
                  query: {
                    // id: record?.id,
                    prquecod: prquecod,
                    prprodcd: prprodcd,
                    file: extra.file
                  },
                  label: "Maint Log",
                  breadcrumbRoute: [
                    {
                      title: "Queue Product",
                      href: `/queues/productQueues?prquecod=${prquecod}&prprodcd=${prprodcd}`,// Add parameter if needed eg. /generalParameter/?id=123
                    },
                    {
                      title: "Maintenance Log",
                    },
                  ]
              }
            ]} />
              
          </Space>
        </div>
      ),
    },
  ];

  function alertRemove(id: string, quecode:string,desc: string) {
    dispatch(
      openGlobalModal({
        title: "Unlink Record",
        message: RemoveDetail(quecode, desc),
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
      fn: unlinkProductQueue({ id }),
    });
    if (success) {

      setTimeout(() => {
        dispatch(refreshTable())
        showModal(dispatch, {
          title: "Unlink Record",
          message: "Record Unlinked",
        });
        // router.push("/prodCode");
      }, 200);
    }
  }

  function goAdd() {
    router.push({
      pathname: "/queues/productQueues/Detail",
      query: {
        id: "",
        prquecod: prquecod,
        prquedesc: prquedesc,
        // prprodcd: prprodcd,
        mode: "LINK"
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
              Queue Product
            </Text>
            <Breadcrumbs breadcrumbItems={[
              {
                title: "Queue Code Parameter",
                href: "/queues"
              },
              // {
              //   title: "Product Code",
              //   href: `/queues/productCodes?prquecod=${prquecod}`
              // },
              {
                title: "Queue Product"
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
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.PRODUCTQ_LINK)) && (
                <Buttons 
                  buttonDefaultType={"LINK"} onclick={() => goAdd()}
                />
              )
            }
          </Box>
        </Flex>
        <Card p={1} mt={4}>
          <Flex bgColor="#fff" justifyContent={"space-between"} p={3} direction={"column"}>
          <Box>
            <Text fontSize={"sm"} fontWeight={"600"} paddingBottom={5}>Queue Code : {prquecod} - {prquedesc}</Text>
          </Box>
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
                  {ddlData?.ASGMTD?.map((option: DDL_TYPES) => (
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
            refreshFn={fetchProductList}
            totalRecords={totalRecords}
            extraParams={{
              prprodcd: search,
              // prprodcd: prprodcd,
              prquecod: prquecod,
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
      <Text p={3}>Are you sure to unlink this record?</Text>
      <Text>{item} - {itemDesc}</Text>
    </Box>
  )
};
