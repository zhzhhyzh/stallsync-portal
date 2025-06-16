// Chakra imports
import Colors from "@app/constants/Colors";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Text,
  Tooltip,
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";

import { Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";
import Table from "@app/components/common/Table/Table";
import { IoChevronBack, IoSave } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal } from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import Buttons from "@app/components/common/Buttons/Buttons";
import AccountListHeader from "./AccountListHeader";
import useFetchLoanAccountsDetails from "@app/hooks/selector/useFetchLoanAccountsDetails";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import { BsPencil } from "react-icons/bs";
import { AiFillEye } from "react-icons/ai";
import { fetchLoanDetailsAccounts } from "@app/redux/accountManagement/slice";

export default function AccountManagementForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Loan Account Inquiry" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;
  const [tableData, refreshFn, totalRecords, extra] =
    useFetchLoanAccountsDetails();

  const [accountNo, setAccountNo] = useState();

  const columns: any[] = [
    {
      title: "Acc No.",
      dataIndex: "psaccnam",
      key: "psaccnam",
      render: (_: any) => (
        <Flex onClick={() => setAccountNo(_)}>
          <Text as="u" color={"Highlight"} cursor={"pointer"}>
            {_}
          </Text>
        </Flex>
      ),
    },
    {
      title: "Product Type",
      dataIndex: "psaccprddsc",
      key: "psaccprddsc",
    },
    {
      title: "Entity Code",
      dataIndex: "psentuid",
      key: "psentuid",
    },
    {
      title: "Status",
      dataIndex: "psaccsts",
      key: "psaccsts",
      render: (_: any) =>
        _ === "A" ? (
          <Text
            fontWeight={"normal"}
            color={"white"}
            textAlign="center"
            style={{
              width: 60,
              height: 23,
              backgroundColor: Colors.SUCCESS,
              borderRadius: 10,
            }}
          >
            Active
          </Text>
        ) : (
          <Text
            fontWeight={"normal"}
            color={"white"}
            textAlign="center"
            style={{
              width: 75,
              height: 23,
              backgroundColor: Colors.DANGER,
              borderRadius: 10,
            }}
          >
            In Active
          </Text>
        ),
    },
    {
      title: "Start Date",
      dataIndex: "psaccfpd",
      key: "psaccfpd",
    },
    {
      title: "Maturity Date",
      dataIndex: "psaccmtd",
      key: "psaccmtd",
    },
    {
      title: "Actions",
      key: "action",
      align: "center",
      width: "10rem",
      render: (_: any, record: any) => (
        <Flex justifyContent="flex-end">
          <Space size="small">
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
                onClick={() => goView(record?.pscifuid, record?.psaccnam)}
              />
            </Tooltip>
            {mode == "EDIT" && (
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
                  onClick={() => goEdit(record?.pscifuid, record?.psaccnam)}
                />
              </Tooltip>
            )}

            <TableMenu
              menus={[
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
                      title: `Loan Accounts (${mode})`,
                      href: `/accountManagement/Detail/?id=${id}&mode=${mode}`, // Add parameter if needed eg. /generalParameter/?id=123
                    },
                    {
                      title: "Maintenance Log",
                    },
                  ],
                },
              ]}
            />
          </Space>
        </Flex>
      ),
    },
  ];

  function goEdit(cifId: string, id: string) {
    router.push({
      pathname: "/accountManagement/accountDetails/Detail",
      query: {
        id: id,
        cifId,
        mode: "EDIT",
      },
    });
  }

  function goView(cifId: string, id: string) {
    router.push({
      pathname: "/accountManagement/accountDetails/Detail",
      query: {
        id: id,
        cifId,
        mode: "VIEW",
      },
    });
  }

  useEffect(() => {
    if (extra.accountBalance) {
      setAccountNo(extra.accountBalance.psaccnam);
    }
  }, [extra]);
  return (
    <>
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Loans Account Listing Inquiry
          </Text>
          <Breadcrumbs
            breadcrumbItems={[
              {
                title: "Loans Account Listing Inquiry",
                href: `/accountManagement`, // Add parameter if needed eg. /generalParameter/?id=123
              },
              {
                title: "Loans Accounts (" + mode + ")",
              },
            ]}
          />
        </Flex>
        <Box
          display={"flex"}
          alignSelf={"center"}
        >
          <Space size="small">
            <Buttons buttonDefaultType={"BACK"} onclick={() => router.back()} />
          </Space>
        </Box>
      </Flex>
      <Flex
        flexDir={{
          base: "column",
          lg: "row",
        }}
        gap={Spacing.gap}
        mt={Spacing.gap}
      >
        <Box display={"flex"} flexDir={"column"} w={"100%"}>
          <AccountListHeader data={extra.header} />
          <Box display={"flex"} flexDir={"row"} pt={5}>
            <Flex w={"70%"} pr={5}>
              <Card className="grid grid-cols-1 gap-6">
                <Box>
                  <Text ml={3} pb={3} fontSize={"19pt"} fontWeight="500">
                    Account Listing
                  </Text>
                  <Table
                    columns={columns}
                    data={tableData}
                    refreshFn={fetchLoanDetailsAccounts}
                    totalRecords={totalRecords}
                    extraParams={{
                      pscifuid: id,
                      psaccnam: accountNo,
                    }}
                    //onDoubleClick={showInfo}
                    //length={pageSize}
                  />
                </Box>
              </Card>
            </Flex>
            <Flex w={"30%"}>
              <Card className="grid grid-cols-1 gap-6">
                <Box>
                  <Flex
                    flexDir={{
                      base: "row",
                      lg: "row",
                      sm: "column",
                      md: "column",
                    }}
                    pb={3}
                  >
                    <Text
                      whiteSpace={"nowrap"}
                      pr={1}
                      fontSize={"19pt"}
                      fontWeight="500"
                    >
                      Account Balances
                    </Text>
                    <Text
                      fontSize={"12pt"}
                      fontWeight={"500"}
                      fontStyle={"italic"}
                      alignContent={"center"}
                    >
                      ({accountNo})
                    </Text>
                  </Flex>
                  <Grid
                    templateRows="repeat(11, 1fr)"
                    templateColumns="1fr 1fr"
                    gap={1}
                  >
                    <GridItem>
                      <Text fontSize={14} fontWeight={"bold"}>
                        Loan Amount
                      </Text>
                    </GridItem>
                    <GridItem textAlign={"right"}>
                      <Text fontSize={16} fontWeight={500}>
                        {extra?.accountBalance?.psacorgm || "0.00"}
                      </Text>{" "}
                    </GridItem>
                    <GridItem>
                      <Text fontSize={14} fontWeight={"bold"}>
                        Current Balance
                      </Text>
                    </GridItem>
                    <GridItem textAlign={"right"}>
                      <Text fontSize={16} fontWeight={500}>
                        {extra?.accountBalance?.psacccbl || "0.00"}
                      </Text>{" "}
                    </GridItem>
                    <GridItem>
                      <Text fontSize={14} fontWeight={"bold"}>
                        Unearned Interest
                      </Text>
                    </GridItem>
                    <GridItem textAlign={"right"}>
                      <Text fontSize={16} fontWeight={500}>
                        {extra?.accountBalance?.psaccuni || "0.00"}
                      </Text>{" "}
                    </GridItem>
                    <GridItem>
                      <Text fontSize={14} fontWeight={"bold"}>
                        Accrued Interest
                      </Text>
                    </GridItem>
                    <GridItem textAlign={"right"}>
                      <Text fontSize={16} fontWeight={500}>
                        {extra?.accountBalance?.psaccaci || "0.00"}
                      </Text>{" "}
                    </GridItem>
                    <GridItem>
                      <Text fontSize={14} fontWeight={"bold"}>
                        Late Charges
                      </Text>
                    </GridItem>
                    <GridItem textAlign={"right"}>
                      <Text fontSize={16} fontWeight={500}>
                        {extra?.accountBalance?.psacclch || "0.00"}
                      </Text>{" "}
                    </GridItem>
                    <GridItem>
                      <Text fontSize={14} fontWeight={"bold"}>
                        Fee Charges
                      </Text>
                    </GridItem>
                    <GridItem textAlign={"right"}>
                      <Text fontSize={16} fontWeight={500}>
                        {extra?.accountBalance?.psaccpfe || "0.00"}
                      </Text>{" "}
                    </GridItem>
                    <GridItem>
                      <Text fontSize={14} fontWeight={"bold"}>
                        Advance Payment
                      </Text>
                    </GridItem>
                    <GridItem textAlign={"right"}>
                      <Text fontSize={16} fontWeight={500}>
                        {extra?.accountBalance?.psaccavp || "0.00"}
                      </Text>{" "}
                    </GridItem>
                    <GridItem>
                      <Text fontSize={14} fontWeight={"bold"}>
                        Outstanding Balance
                      </Text>
                    </GridItem>
                    <GridItem textAlign={"right"}>
                      <Text fontSize={16} fontWeight={500}>
                        {extra?.accountBalance?.outstanding_balance || "0.00"}
                      </Text>{" "}
                    </GridItem>

                    <GridItem />
                    <GridItem />

                    <GridItem>
                      <Text fontSize={14} fontWeight={"bold"}>
                        Overdue Billed Amount
                      </Text>
                    </GridItem>
                    <GridItem textAlign={"right"}>
                      <Text fontSize={16} fontWeight={500}>
                        {extra?.accountBalance?.overdue_amount || "0.00"}
                      </Text>{" "}
                    </GridItem>
                    <GridItem>
                      <Text fontSize={14} fontWeight={"bold"}>
                        Overdue Days
                      </Text>
                    </GridItem>
                    <GridItem textAlign={"right"}>
                      <Text fontSize={16} fontWeight={500}>
                        {extra?.accountBalance?.overdue_day || "0.00"}
                      </Text>{" "}
                    </GridItem>
                  </Grid>
                </Box>
              </Card>
            </Flex>
          </Box>
        </Box>
      </Flex>
      <Flex justifyContent="flex-end" pl={10} pr={4} pt={10}>
        <Box>
          <Space size="small">
            <Buttons buttonDefaultType={"BACK"} onclick={() => router.back()} />
          </Space>
        </Box>
      </Flex>
    </>
  );
}
