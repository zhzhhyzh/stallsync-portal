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
import { Rate } from "antd";

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
import useFetchProducts from "@app/hooks/selector/useFetchProducts";
import {
  fetchProducts,
  getremoveProduct,
} from "@app/redux/product/slice";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { BsPencil } from "react-icons/bs";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { MdLockReset } from "react-icons/md";

export default function ProductPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sendRequest, loading } = useApi({ title: "Product" });
  const homeData = useAppSelector(selectHome);

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra, headerInfo] = useFetchProducts({});
  // const [ddlData] = useFetchDDL({ code: ["GTCAT"] });
  //pass tableData to table
  const [ddlData] = useFetchDDL({ code: ["YESORNO", "PRODTYP", "PRODCAT"] });
  const [search, setSearch] = useState();
  const [category, setCategory] = useState();
  const [type, setType] = useState();
  const [status, setStatus] = useState();

  const columns: any[] = [
    {
      title: "Product Code",
      dataIndex: "psprduid",
      key: "psprduid",
    },
    {
      title: "Name",
      dataIndex: "psprdnme",
      key: "psprdnme",
    },
    {
      title: "Description",
      dataIndex: "psprddsc",
      key: "psprddsc",
      render: (text: string) => (
        <Tooltip label={text} placement="top" hasArrow>
          <Text noOfLines={1} maxW="200px">
            {text}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Type",
      dataIndex: "psprdtyp",
      key: "psprdtyp",
      render: (_: any, record: any) => (
        <Text>{`${record.psprdtypdsc}`}</Text>
      )
    },
    // {
    //   title: "Merchant",
    //   dataIndex: "psmrcuid",
    //   key: "psmrcuid",
    //   render: (_: any, record: any) => (
    //     <Text>{`${record.psmrcuid} - ${record.psmrcuiddsc}`}</Text>
    //   )
    // },

    {
      title: "Category",
      dataIndex: "psprdcat",
      key: "psprdcat",
      render: (_: any, record: any) => (
        // <Text>{`${record.psprdcat} - ${record.psprdcatdsc}`}</Text>
        <Text>{`${record.psprdcatdsc}`}</Text>

      )
    },
     {
          title: "Rating",
          dataIndex: "psprdrtg",
          key: "psprdrtg",
          render: (rating: any) => {
            const numericRating = parseFloat(rating) || 0;
    
            return (
              <Flex alignItems="center" gap={2}>
                <Rate allowHalf disabled defaultValue={numericRating} />
                {/* <Text fontSize="sm">{numericRating.toFixed(1)}</Text> */}
              </Flex>
            );
          },
    
        },
    {
      title: "Product Status",
      dataIndex: "psprdsts",
      key: "psprdsts",
      render: (_: any, record: any) => (
        _ === "A" ? <Text fontWeight={"normal"} color={"white"} textAlign="center" style={{
          width: 90,
          height: 20,
          backgroundColor: Colors.SUCCESS,
          borderRadius: 10
        }}>Available</Text> : _ === "L" ? <Text fontWeight={"normal"} color={"white"} textAlign="center" style={{
          width: 90,
          height: 20,
          backgroundColor: Colors.WARNING,
          borderRadius: 10
        }}>Low Stock</Text> : <Text fontWeight={"normal"} color={"white"} textAlign="center" style={{
          width: 100,
          height: 20,
          backgroundColor: Colors.DANGER,
          borderRadius: 10,
        }}>Out of Stock</Text>
      )
    },
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
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.PROD_EDIT)) && (
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
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.PROD_DEL)) && (
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
                url: `/maintLogs`,
                query: {
                  id: record?.id,
                  file: extra.file
                },
                label: "Maint Log",
                breadcrumbRoute: [
                  {
                    title: "Product",
                    href: `/product`,// Add parameter if needed eg. /generalParameter/?id=123
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
      fn: getremoveProduct({ id }),
    });
    if (success) {

      setTimeout(() => {
        dispatch(refreshTable())
        showModal(dispatch, {
          title: "Remove item",
          message: "Removed",
        });
        router.push("/product");
      }, 200);
    }
  }

  function goAdd() {
    router.push({
      pathname: "/product/Detail",
      query: {
        id: "",
        mode: "ADD",
        mrcId: headerInfo
      },
    });
  }

  function goEdit(id: string) {
    router.push({
      pathname: "/product/Detail",
      query: {
        id: id,
        mode: "EDIT",
        mrcId: headerInfo

      },
    });
  }

  function goView(id: string) {
    router.push({
      pathname: "/product/Detail",
      query: {
        id: id,
        mode: "VIEW",
        mrcId: headerInfo


      },
    });
  }

  function searchOnChange(event: any) {
    setSearch(event.target.value);
  }

  function typeOnChange(event: any) {
    setType(event.target.value);
  }

  function statusOnChange(event: any) {
    setStatus(event.target.value);
  }

  function categoryOnChange(event: any) {
    setCategory(event.target.value);
  }


  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
              Product
            </Text>
            <Breadcrumbs breadcrumbItems={[
              {
                title: "Product"
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
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.PROD_ADD)) && (
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
                  name="type"
                  onChange={typeOnChange}
                  placeholder="Please Select Product Type"
                  value={type}
                >
                  {ddlData?.PRODTYP?.map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>

                <Select
                  name="category"
                  onChange={categoryOnChange}
                  placeholder="Please Select Product Category"
                  value={category}
                >
                  {ddlData?.PRODCAT?.map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                <Select
                  name="status"
                  onChange={statusOnChange}
                  placeholder="Please Select Product Status"
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
            columns={columns}
            data={tableData}
            refreshFn={fetchProducts}
            totalRecords={totalRecords}
            extraParams={{
              search: search,
              psprdsts: status,
              psprdtyp: type,
              psprdcat: category


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
