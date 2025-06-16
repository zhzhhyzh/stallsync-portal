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
import { FiMoreVertical } from "react-icons/fi";
import { AiFillEye } from "react-icons/ai";
import { BsPencil } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import {
  closeGlobalModal,
  openGlobalModal,
  refreshTable,
  selectHome,
} from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { fetchLoanAccounts } from "@app/redux/accountManagement/slice";
import useFetchLoanAccounts from "@app/hooks/selector/useFetchLoanAccounts";

export default function AccountList() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sendRequest, loading } = useApi({
    title: "Loan Account Listing Inquiry",
  });
  const homeData = useAppSelector(selectHome);

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] = useFetchLoanAccounts();
  const [ddlData] = useFetchDDL({ code: ["SERCAT"] });
  //pass tableData to table

  const [search, setSearch] = useState();
  const [category, setCategory] = useState("CIFNO");

  const columns: any[] = [
    {
      title: "CIF No.",
      dataIndex: "pscifuid",
      key: "pscifuid",
    },
    {
      title: "ID No.",
      dataIndex: "psidnval",
      key: "psidnval",
    },
    {
      title: "Customer Name",
      dataIndex: "pscifnme",
      key: "pscifnme",
    },
    {
      title: "DOB",
      dataIndex: "pscifdob",
      key: "pscifdob",
    },
    {
      title: "HP No.",
      dataIndex: "psconphn",
      key: "psconphn",
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
            {homeData?.access &&
              checkAccessMatrix(homeData?.access, accessType.GEN_EDIT) && (
                <Tooltip label="View" fontSize="sm">
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="green"
                    sx={{
                      _hover: {
                        backgroundColor: Colors.SUCCESS,
                        color: Colors.BACKGROUND,
                      },
                    }}
                    icon={<AiFillEye />}
                    aria-label={"view"}
                    onClick={() => goView(record?.pscifuid)}
                  />
                </Tooltip>
              )}
            {homeData?.access &&
              checkAccessMatrix(homeData?.access, accessType.GEN_EDIT) && (
                <Tooltip label="Edit" fontSize="sm">
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="blue"
                    sx={{
                      _hover: {
                        backgroundColor: Colors.PRIMARY,
                        color: Colors.BACKGROUND,
                      },
                    }}
                    icon={<BsPencil />}
                    aria-label={"edit"}
                    onClick={() => goEdit(record?.pscifuid)}
                  />
                </Tooltip>
              )}
            {/* <TableMenu
              menus={[
                {
                  url: `generalParameter/generalCode`,
                  query: {
                    id: record?.id,
                    desc: record?.prgtydsc,

                    // file: extra.file
                  },
                  label: "Customer",
                },
                {
                  url: `/maintLogs`,
                  query: {
                    id: record?.psaccnam,
                    file: extra.file,
                  },
                  label: "Maint Log",
                  breadcrumbRoute: [
                    {
                      title: "Loan Account Listing Inquiry",
                      href: `/accountManagement`, // Add parameter if needed eg. /generalParameter/?id=123
                    },
                    {
                      title: "Maintenance Log",
                    },
                  ],
                },
              ]}
            /> */}
          </Space>
        </Flex>
      ),
    },
  ];

  function goEdit(id: string) {
    router.push({
      pathname: "/accountManagement/Detail",
      query: {
        id: id,
        mode: "EDIT",
      },
    });
  }

  function goView(id: string) {
    router.push({
      pathname: "/accountManagement/Detail",
      query: {
        id: id,
        mode: "VIEW",
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
              Loan Account Listing Inquiry
            </Text>
            <Breadcrumbs
              breadcrumbItems={[
                {
                  title: "Loan Account Listing Inquiry",
                },
              ]}
            />
          </Flex>
          <Box
            display={"flex"}
            alignSelf={"center"}
            pr={{
              base: 0,
              md: Spacing.containerPx,
            }}
          >
            {/* {homeData?.access &&
              checkAccessMatrix(homeData?.access, accessType.GEN_ADD) && (
                <Buttons buttonDefaultType={"ADD"} onclick={() => goAdd()} />
              )} */}
          </Box>
        </Flex>
        <Card p={4} mt={4}>
          <Flex bgColor="#fff" justifyContent={"space-between"} p={3}>
            <Box
              pr={{
                base: 0,
                md: Spacing.containerPx,
              }}
              display="flex"
              flexDirection={"column"}
              gap={3}
              w={"50%"}
            >
              <Select
                name="category"
                onChange={categoryOnchange}
                //placeholder="Please Select Category"
                value={category}
              >
                {ddlData?.SERCAT?.map((option: DDL_TYPES) => (
                  <option key={option.prgecode} value={option.prgecode}>
                    {option.prgedesc}
                  </option>
                ))}
              </Select>
              <Input
                type="text"
                name="search"
                onChange={searchOnChange}
                placeholder="Search"
                value={search}
              />
            </Box>
          </Flex>
          <Table
            columns={columns}
            data={tableData}
            refreshFn={fetchLoanAccounts}
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
