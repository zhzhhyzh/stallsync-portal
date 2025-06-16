// Chakra imports
import Colors from "@app/constants/Colors";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tab,
  TabList,
  Tabs,
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
import { fetchLoanDetailsAccounts, updateAccount } from "@app/redux/accountManagement/slice";
import useFetchAccountDetail from "@app/hooks/selector/useFetchAccountDetail";
import AccountDetail from "./AccountDetail";
import { ChevronDownIcon } from "@chakra-ui/icons";
import BillingList from "@app/components/pages/billing/BillingList";
import AccountTransactionList from "@app/components/pages/accountTransaction/AccountTransactionList";
import CustomerRelationshipList from "@app/components/pages/customerRelationship/CustomerRelationshipList";
import AccountRelationshipList from "@app/components/pages/accountRelationship/AccountRelationshipList";
import AccountMessageList from "@app/components/pages/accountMessage/AccountMessageList";
import SentHistoryByAccountPage from "@app/components/pages/notificationsenthistory/SentHistoryByAccount";

export default function AccountDetailForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Loan Account Inquiry" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const cifId = props.cifId;
  const mode = props.mode;
  const [detailData] = useFetchAccountDetail(id);
  const [tabIndex, setTabIndex] = useState(0);

  const [displayTab, setDisplayTab] = useState<any[]>([]);
  const [hiddenTab, setHiddenTab] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState("AD");

  const tabArray = [
    { tab_name: "Account Detail", tab_key: "AD" },
    { tab_name: "Billing", tab_key: "BI" },
    { tab_name: "Transaction History", tab_key: "TH" },
    { tab_name: "Relationship", tab_key: "RL" },
    { tab_name: "Notes", tab_key: "NO" },
    // { tab_name: "Customer Profile", tab_key: "CP" },
    // { tab_name: "Application", tab_key: "AP" },
    { tab_name: "Collaterals", tab_key: "CL" },
    { tab_name: "Notifications", tab_key: "NT" },
  ];

  const initialValues = {
    //Non Display Field
    psaccinb: "",
    psaccrty: "",
    psaccnam: "",
    pscifuid: "",
    psaplcrf: "",
    psaplref: "",

    //Current Outstanding
    psacccbl: "",
    outstandig_interest: "",
    psacclch: "",
    psaccfec: "",
    psaccavp: "",
    total_outstanding: "",

    //Pricing Rate
    psacorgm: "",
    psaccrat: "",
    psacceir: "",
    psaccttc: "",
    psaccuni: "",
    psaccaci: "",
    psaccppa: "",
    psaccsmd: "",
    psaccpfe: "",

    //Tenure & Payment Due Date
    psaccdbd: "",
    psaccodt: "",
    psaccfpd: "",
    psacctmv: "",
    psacctmt: "",
    psaccmtd: "",
    remaining_tenure: "",
    remaining_tenure_code: "",
    psaccnsp: "",
    psaccpfq: "",
    psaccpfc: "",
    psaccnpd: "",
    psaccddy: "",
    psaccpmc: "",
    psaccina: "",
    psaccfia: "",

    //Delinquency
    psaccnsd: "",
    psaccnpl: "",
    installment_overdue_amt: "",
    installment_overdue_mth: "",
    installment_overdue_day: "",
    principal_overdue_amt: "",
    principal_overdue_mth: "",
    principal_overdue_day: "",
    interest_overdue_amt: "",
    interest_overdue_mth: "",
    interest_overdue_day: "",
    fee_overdue_amt: "",
    fee_overdue_mth: "",
    fee_overdue_day: "",
    total_overdue_amt: "",
    total_overdue_mth: "",
    total_overdue_day: "",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    //validationSchema: LoanCalculatorSchema,
    onSubmit: (values) => {
      //onSubmit(values);
    },
  });

  async function onSubmit() {
    let postData = {
      psaccnam: formik.values.psaccnam,
      psaccfpd: formik.values.psaccfpd,
      psaccina: formik.values.psaccina,
      psaccfia: formik.values.psaccfia,
      psaccsmd: formik.values.psaccsmd,
      psaccppa: formik.values.psaccppa,
      psaccpfe: formik.values.psaccpfe,
    }
    const { success } = await sendRequest({
      fn: updateAccount(postData),
      formik,
    });
    if (success) {
      setTimeout(() => {
        showModal(dispatch, {
          title: mode !== "ADD" ? "Update Record" : "Add Record",
          message: mode !== "ADD" ? "Record Updated" : "Record Added",
        });
      }, 200);
    }
  }

  useEffect(() => {
    if (tabArray.length > 0) {
      let displayTabArray = [];
      let hideTabArray = [];
      for (var i = 0; i < tabArray.length; i++) {
        let obj = tabArray[i];
        if (i < 5) {
          displayTabArray.push({
            tab_name: obj.tab_name,
            tab_key: obj.tab_key,
          });
        } else {
          hideTabArray.push({
            tab_name: obj.tab_name,
            tab_key: obj.tab_key,
          });
        }
      }
      setDisplayTab(displayTabArray);
      setHiddenTab(hideTabArray);
    }
  }, []);

  useEffect(() => {
    if (mode !== "ADD" && id) {
      //Reset Form if detailData is empty object
      if (Object.keys(detailData).length === 0) formik.resetForm();

      if (Object.keys(detailData).length > 0) {
        formik.setValues({
          ...detailData,
          id,
        });
      }
    }
  }, [detailData]);

  function handleHiddenTabOnClick(tabName: string, tabKey: string) {
    let displayTabArray = [...displayTab];
    let hideTabArray = [...hiddenTab];

    if (displayTabArray.length == 6) {
      let getLastDsiplayTab = displayTabArray.pop();
      displayTabArray.push({
        tab_name: tabName,
        tab_key: tabKey,
      });
      let filteredHideTabArr = hideTabArray.filter(
        (item) => item.tab_name != tabName
      );
      filteredHideTabArr.push(getLastDsiplayTab);
      setDisplayTab(displayTabArray);
      setHiddenTab(filteredHideTabArr);
    } else {
      let filteredHideTabArr = hideTabArray.filter(
        (item) => item.tab_name != tabName
      );
      displayTabArray.push({
        tab_name: tabName,
        tab_key: tabKey,
      });
      setDisplayTab(displayTabArray);
      setHiddenTab(filteredHideTabArr);
    }
    setTabIndex(5);
    setSelectedTab(tabKey);
  }

  function goManualTransaction() {
    router.push({
      pathname: "/accountManagement/manualTransaction/Detail",
      query: {
        id: id,
        cifId,
        mode: mode,
      },
    });
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Loans Account Details Inquiry
          </Text>
          <Breadcrumbs
            breadcrumbItems={[
              {
                title: "Loans Account Listing Inquiry",
                href: `/accountManagement`, // Add parameter if needed eg. /generalParameter/?id=123
              },
              {
                title: "Loans Accounts",
                href: `/accountManagement/Detail?id=${cifId}&mode=${mode}`, // Add parameter if needed eg. /generalParameter/?id=123
              },
              {
                title: "Loans Account Detail (" + mode + ")",
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
          <Space size="small">
            <Buttons buttonDefaultType={"BACK"} onclick={() => router.back()} />
            {mode && mode !== "VIEW" && (
              <>
                {selectedTab == "AD" && (
                  <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} onclick={() => onSubmit()}/>
                )}
                {selectedTab == "TH" && (
                  <Buttons
                    buttonDefaultType={"ADD"}
                    onclick={() => goManualTransaction()}
                  />
                )}
              </>
            )}
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
          <AccountListHeader data={detailData.header} headerType={"detail"} />
          <Flex mt={4} bgColor="#fff" py={2}>
            <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)}>
              <Flex
                bgColor="#fff"
                justifyContent={"space-between"}
                alignItems={"flex-end"}
                gap={5}
              >
                <TabList border={0}>
                  {displayTab.map((item, index) => {
                    return (
                      <Tab
                        key={`account_display_tab-${index}`}
                        py={3}
                        whiteSpace={"nowrap"}
                        ml={{
                          base: 0,
                          md: Spacing.containerPx,
                        }}
                        fontWeight={"semibold"}
                        onClick={() => setSelectedTab(item.tab_key)}
                      >
                        {item.tab_name}
                      </Tab>
                    );
                  })}
                </TabList>
              </Flex>
            </Tabs>
            <Menu>
              <MenuButton
                as={Link}
                textColor="blue"
                alignSelf={"center"}
                pl={10}
              >
                more...
              </MenuButton>
              <MenuList>
                {hiddenTab.map((item, index) => {
                  return (
                    <MenuItem
                      key={`account_hidden_tab-${index}`}
                      pl={5}
                      pr={5}
                      whiteSpace={"nowrap"}
                      fontWeight={"semibold"}
                      onClick={() =>
                        handleHiddenTabOnClick(item.tab_name, item.tab_key)
                      }
                    >
                      {item.tab_name}
                    </MenuItem>
                  );
                })}
              </MenuList>
            </Menu>
          </Flex>
          <Box display={"flex"} flexDir={"row"} pt={5}>
            {selectedTab == "AD" && (
              <AccountDetail formik={formik} mode={mode} />
            )}
            {selectedTab == "BI" && (
              <BillingList accountNo={formik.values.psaccnam} mode={mode} />
            )}
            {selectedTab == "TH" && (
              <AccountTransactionList
                accountNo={formik.values.psaccnam}
                mode={mode}
              />
            )}
            {selectedTab == "RL" && (
              <Flex flexDir={"row"} w={"100%"} justifyContent={"space-between"}>
                <Flex w={"49%"}>
                  <CustomerRelationshipList
                    cifNo={formik.values.pscifuid}
                    mode={mode}
                  />
                </Flex>
                <Flex w={"49%"}>
                  <AccountRelationshipList
                    accountNo={formik.values.psaccnam}
                    mode={mode}
                  />
                </Flex>
              </Flex>
            )}
            {selectedTab == "NO" && (
              <AccountMessageList
                accountNo={formik.values.psaccnam}
                mode={mode}
              />
            )}
            {selectedTab == "NT" && (
              <SentHistoryByAccountPage
                accountNo={formik.values.psaccnam}
                cifId={cifId}
                mode={mode}
              />
            )}
          </Box>
        </Box>
      </Flex>
      <Flex justifyContent="flex-end" pl={10} pr={10} pt={10}>
        <Box>
          <Space size="small">
            <Buttons buttonDefaultType={"BACK"} onclick={() => router.back()} />
            {mode && mode !== "VIEW" && (
              <>
                {selectedTab == "AD" && (
                  <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} onclick={() => onSubmit()}/>
                )}
                {selectedTab == "TH" && (
                  <Buttons
                    buttonDefaultType={"ADD"}
                    onclick={() => goManualTransaction()}
                  />
                )}
              </>
            )}
          </Space>
        </Box>
      </Flex>
    </form>
  );
}
