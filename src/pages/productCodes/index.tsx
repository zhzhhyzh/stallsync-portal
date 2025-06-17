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
import useFetchProdCodes from "@app/hooks/selector/useFetchProdCodes";
import {
  fetchProdCodes,
  getRemoveProdCode,
} from "@app/redux/prodCode/slice";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { BsPencil } from "react-icons/bs";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { MdLockReset } from "react-icons/md";

export default function ProdCodePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sendRequest, loading } = useApi({ title: "Product Code" });
  const homeData = useAppSelector(selectHome);  

  const prquecod = String(router.query?.prquecod);

    // console.log("prquecod", prquecod);

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] = useFetchProdCodes({});
  // const [ddlData] = useFetchDDL({ code: ["GTCAT"] });
  //pass tableData to table

  const [search, setSearch] = useState();
  const [category, setCategory] = useState();

  const customHeaderCellStyle: CSSProperties = {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    marginRight: 35
  };
  
  const customDataCellStyle: CSSProperties = {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginLeft: 12,
  };

  const columns: any[] = [
    {
      title: "Product Code",
      dataIndex: "psprdcde",
      key: "psprdcde",
    },
    {
      title: "Description",
      dataIndex: "psprddsc",
      key: "psprddsc",
    },
    {
      title: "Active",
      dataIndex: "psprdsts",
      key: "psprdsts",
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
      title: <div style={customHeaderCellStyle}>ACTIONS</div>,
      key: "action",
      align: "center",
      width: "10rem",
      render: (_: any, record: any) => (
        <div style={customDataCellStyle}>
          <Space size="small">
            {/* <IconButton
              // colorScheme={"blue"}
              icon={<AiFillEye />}
              aria-label={"view"}
              onClick={() => showInfo(record)}
            /> */}
            {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.PRODCODE_EDIT)) && (
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
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.PRODCODE_DEL)) && (
                <Tooltip label='Delete' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="red"
                    sx={{ _hover: { backgroundColor: Colors.DANGER, color: Colors.BACKGROUND } }}
                    icon={<IoTrash />}
                    aria-label={"delete"}
                    onClick={() => alertRemove(record?.id, record?.psprddsc)}
                  />
                </Tooltip>
              )
            }
            
            <TableMenu menus={[
                 {
                  url: `/productCodes/productFees`,
                  query: {
                    id: record?.id,
                    desc: record?.psprddsc,
                  },
                  label: "Product Fee Charges",
                 
              },
              {
                  url: `/maintLogs`,
                  query: {
                    id: record?.id,
                    file: extra.file
                  },
                  label: "Maint Log",
                  breadcrumbRoute: [
                    {
                      title: "Product Parameter",
                      href: `/productCodes`,// Add parameter if needed eg. /generalParameter/?id=123
                    },
                    {
                      title: "Maintenance Log",
                    },
                  ]
              },
           
              // {
              //   url: `/productCodes/productQueues`,
              //   query: {
              //     // id: record?.id,
              //     prquecod: prquecod,
              //     prprodcd: record?.psprdcde,
              //     // file: extra.file
              //   },
              //   label: "Product Queue"
              // },
              // {
              //   url: `/productCodes/productFees`, //new subfolder place inside productCodes
              //   query: {
              //     // id: record?.id,
              //     prquecod: prquecod,
              //     prprodcd: record?.psprdcde,
              //     // file: extra.file
              //   },
              //   label: "Product Fee"
              // },
            ]} />
              
          </Space>
        </div>
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
      fn: getRemoveProdCode({id}),
    });
    if (success) {

      setTimeout(() => {
        dispatch(refreshTable())
        showModal(dispatch, {
          title: "Delete Record",
          message: "Record Deleted",
        });
        router.push("/productCodes");
      }, 200);
    }
  }

  function goAdd() {
    router.push({
      pathname: "/productCodes/Detail",
      query: {
        id: "",
        // prquecod: prquecod,
        mode: "ADD"
      },
    });
  }

  function goEdit(id: string) {
    router.push({
      pathname: "/productCodes/Detail",
      query: {
        id: id,
        // prquecod: prquecod,
        mode: "EDIT"
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
              Product Code
            </Text>
            <Breadcrumbs breadcrumbItems={[
              // {
              //   title: "Queue",
              //   href: "/queues"
              // },
              {
                title: "Product Code"
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
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.PRODCODE_ADD)) && (
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
            refreshFn={fetchProdCodes}
            totalRecords={totalRecords}
            extraParams={{
              search: search,
              prquecod: prquecod,
            //type: category,
            }}
            //onDoubleClick={showInfo}
            //length={pageSize}
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
