// Chakra imports
import Colors from "@app/constants/Colors";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  IconButton,
  Input,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  NumberInput,
  NumberInputField,
  Select,
  Tab,
  TabList,
  Tabs,
  Text,
  Textarea,
  Tooltip,
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";

import { DatePicker, Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";
import Table from "@app/components/common/Table/Table";
import { IoChevronBack, IoSave } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import {
  closeGlobalModal,
  fetchDDLEntityBank,
  openGlobalModal,
} from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import Buttons from "@app/components/common/Buttons/Buttons";
import AccountListHeader from "./AccountListHeader";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import useFetchAccountDetail from "@app/hooks/selector/useFetchAccountDetail";
import { ChevronDownIcon } from "@chakra-ui/icons";
import useFetchDDLProdCode from "@app/hooks/selector/useFetchDDLPrdcde";
import dayjs from "dayjs";
import useFetchDDLTransCode from "@app/hooks/selector/useFetchDDLTransCode";
import useFetchDDLEntityBanks from "@app/hooks/selector/useFetchDDLEntityBanks";
import useFetchDDLGlacpf from "@app/hooks/selector/useFetchDDLGlacpf";
import { raiseManualTransactionRequest } from "@app/redux/accountManagement/slice";

export default function ManualTransactionForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Manual Transaction" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const cifId = props.cifId;
  const mode = props.mode;

  const [entityUID, setEntityUID] = useState("");

  const [detailData] = useFetchAccountDetail(id);
  const [products] = useFetchDDLProdCode({});
  const [entitybanks] = useFetchDDLEntityBanks("");
  const [trxcode] = useFetchDDLTransCode();
  const [glaccounts] = useFetchDDLGlacpf();
  const [ddlData] = useFetchDDL({ code: ["TRXMDE", "DRCRCDE"] });

  const initialValues = {
    psaccnam: "",
    pstrxpcd: "",
    pstrxdat: "",
    pstrxcde: "",
    pstrxamt: "",
    pstrxdcc: "",
    trx_by: "",
    pstrxrmk: "",
    pstrxmod: "",
    bank_code: "",
    pstrxgla: "",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    //validationSchema: LoanCalculatorSchema,
    onSubmit: (values) => {
      let {
        psaccnam,
        pstrxamt,
        pstrxcde,
        pstrxdcc,
        pstrxmod,
        bank_code,
        pstrxgla,
        pstrxdat,
        pstrxpcd,
        pstrxrmk,
        trx_by,
      } = values;

      let splitBankInfo = bank_code.split("-");

      let postData = {
        psaccnam,
        pstrxamt: pstrxamt,
        pstrxcde: pstrxcde,
        pstrxdcc: pstrxdcc,
        pstrxmod: pstrxmod,
        pstrxbnk: splitBankInfo[0] || "",
        pstrxbno: splitBankInfo[1] || "",
        pstrxgla: pstrxgla || "",
        pstrxdat: pstrxdat || dayjs(),
        pstrxpcd: pstrxpcd,
        pstrxrmk: pstrxrmk,
      };

      let newData: any = {};
      newData.pscmkcde = "CTRX";
      newData.psrqtmkr = trx_by;
      newData.psrqtbdy = JSON.stringify(postData);

      onSubmit(newData);
    },
  });

  async function onSubmit(data: any) {
    const { success } = await sendRequest({
      fn: raiseManualTransactionRequest(data),
      formik,
    });
    if (success) {
      setTimeout(() => {
        showModal(dispatch, {
          title: "Manual Transaction Request",
          message: "Request Generated",
        });
      }, 200);
    }
  }

  useEffect(() => {
    //Reset Form if detailData is empty object
    if (Object.keys(detailData).length === 0) formik.resetForm();

    if (Object.keys(detailData).length > 0) {
      formik.setValues({
        ...detailData,
        pstrxamt: "0.00",
        id,
      });
      setEntityUID(detailData?.psentuid);
    }
  }, [detailData]);

  useEffect(() => {
    if (entityUID && entityUID != "") {
      triggerEntityBankDDL(entityUID);
    }
  }, [entityUID]);

  async function triggerEntityBankDDL(entityUID: string) {
    await sendRequest({
      fn: fetchDDLEntityBank({ entityUID }),
    });
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Manual Transaction
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
                title: "Loans Account Detail",
                href: `/accountManagement/accountDetails/Detail/?id=${id}&cifId=${cifId}&mode=${mode}`, // Add parameter if needed eg. /generalParameter/?id=123
              },
              {
                title: "Manual Transaction",
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
            <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
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
          <AccountListHeader
            data={detailData.header}
            headerType={"manual_transaction"}
          />
          <Flex
            flexDir={{
              base: "column",
              lg: "row",
            }}
            gap={Spacing.gap}
            pt={3}
            //mt={Spacing.gap}
          >
            <Card className="grid grid-cols-1 gap-6" borderRadius={0}>
              <div className="flex flex-col sm:flex-column gap-3">
                <Box display="flex" flexDir="row" gap={4}>
                  <Box display="flex" flexDir="column" gap={4} w={"49%"}>
                    <Flex flexDir={"row"}>
                      <FormControl
                        id="psaccnam"
                        isInvalid={
                          Boolean(formik.errors.psaccnam) &&
                          Boolean(formik.touched.psaccnam)
                        }
                        isReadOnly={true}
                        pr={1}
                      >
                        <FormLabel>Account No.</FormLabel>
                        <Input
                          placeholder={"Enter Account No."}
                          type="text"
                          name="psaccnam"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.psaccnam}

                          //isDisabled={true}
                        />
                        {formik.errors.psaccnam && (
                          <FormErrorMessage>
                            {formik.errors.psaccnam}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                      <FormControl
                        id="pstrxpcd"
                        isInvalid={
                          Boolean(formik.errors.pstrxpcd) &&
                          Boolean(formik.touched.pstrxpcd)
                        }
                      >
                        <CustomFormLabel labelText="Products" />
                        <Select
                          placeholder="Please Select Products"
                          value={formik.values.pstrxpcd}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isDisabled={mode === "VIEW" ? true : false}
                        >
                          {Array.isArray(products) &&
                            products.map((option: any) => (
                              <option
                                key={option.psprdcde}
                                value={option.psprdcde}
                              >
                                {option.psprdcde + " - " + option.psprddsc}
                              </option>
                            ))}
                        </Select>
                        {formik.errors.pstrxpcd && (
                          <FormErrorMessage>
                            {formik.errors.pstrxpcd}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </Flex>
                    <FormControl
                      id="pstrxdat"
                      isInvalid={
                        Boolean(formik.errors.pstrxdat) &&
                        Boolean(formik.touched.pstrxdat)
                      }
                    >
                      <CustomFormLabel labelText="Transaction Date" />
                      <DatePicker
                        id="pstrxdat"
                        name="pstrxdat"
                        style={{ width: "100%" }}
                        format={"DD/MM/YYYY"}
                        value={
                          formik.values.pstrxdat
                            ? dayjs(formik.values.pstrxdat)
                            : dayjs()
                        }
                        onChange={(value) =>
                          formik.handleChange({
                            target: { value, name: "pstrxdat" },
                          })
                        }
                        inputReadOnly={mode == "VIEW" ? true : false}
                        open={mode == "VIEW" ? false : undefined}
                        allowClear={mode == "VIEW" ? false : true}
                      />
                      {formik.errors.pstrxdat && (
                        <FormErrorMessage>
                          {formik.errors.pstrxdat}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl
                      id="pstrxcde"
                      isInvalid={
                        Boolean(formik.errors.pstrxcde) &&
                        Boolean(formik.touched.pstrxcde)
                      }
                    >
                      <CustomFormLabel labelText="Transaction Code" />
                      <Select
                        placeholder="Please Select Transaction Code"
                        value={formik.values.pstrxcde}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isDisabled={mode === "VIEW" ? true : false}
                      >
                        {Array.isArray(trxcode) &&
                          trxcode.map((option: any) => (
                            <option
                              key={option.pstrnscd}
                              value={option.pstrnscd}
                            >
                              {option.pstrnscd + " - " + option.pstrndsc}
                            </option>
                          ))}
                      </Select>
                      {formik.errors.pstrxcde && (
                        <FormErrorMessage>
                          {formik.errors.pstrxcde}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl
                      id="pstrxamt"
                      isInvalid={
                        Boolean(formik.errors.pstrxamt) &&
                        Boolean(formik.touched.pstrxamt)
                      }
                      isReadOnly={mode == "VIEW" ? true : false}
                    >
                      <CustomFormLabel labelText="Transaction Amount" />
                      <NumberInput
                        name="pstrxamt"
                        min={0}
                        precision={2}
                        onChange={(value) =>
                          formik.handleChange({
                            target: { value, name: "pstrxamt" },
                          })
                        }
                        onBlur={formik.handleBlur}
                        value={formik.values.pstrxamt}
                      >
                        <NumberInputField textAlign={"right"} pr={4} />
                        {/* <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper> */}
                      </NumberInput>
                      {formik.errors.pstrxamt && (
                        <FormErrorMessage>
                          {formik.errors.pstrxamt}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </Box>
                  <Box display="flex" flexDir="column" gap={4} w={"49%"}>
                    <FormControl
                      id="pstrxdcc"
                      isInvalid={
                        Boolean(formik.errors.pstrxmod) &&
                        Boolean(formik.touched.pstrxmod)
                      }
                      pr={1}
                    >
                      <CustomFormLabel labelText="Debit/Credit Code" />
                      <Select
                        placeholder="Select Debit/Credit Code"
                        value={formik.values.pstrxdcc || ""}
                        onChange={formik.handleChange}
                        style={{
                          fontSize: 14,
                        }}
                      >
                        {ddlData?.DRCRCDE?.map(
                          (
                            option: DDL_TYPES //change code
                          ) => (
                            <option
                              key={option.prgecode}
                              value={option.prgecode}
                            >
                              {option.prgedesc}
                            </option>
                          )
                        )}
                      </Select>
                      {formik.errors.pstrxdcc && (
                        <FormErrorMessage>
                          {formik.errors.pstrxdcc}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl
                      id="pstrxmod"
                      isInvalid={
                        Boolean(formik.errors.pstrxmod) &&
                        Boolean(formik.touched.pstrxmod)
                      }
                    >
                      <CustomFormLabel labelText="Transaction Mode" />
                      <Select
                        placeholder="Select Transaction Mode"
                        value={formik.values.pstrxmod || ""}
                        onChange={formik.handleChange}
                        style={{
                          fontSize: 14,
                        }}
                      >
                        {ddlData?.TRXMDE?.map(
                          (
                            option: DDL_TYPES //change code
                          ) => (
                            <option
                              key={option.prgecode}
                              value={option.prgecode}
                            >
                              {option.prgedesc}
                            </option>
                          )
                        )}
                      </Select>
                      {formik.errors.pstrxmod && (
                        <FormErrorMessage>
                          {formik.errors.pstrxmod}
                        </FormErrorMessage>
                      )}
                    </FormControl>

                    {formik.values.pstrxmod == "B" && (
                      <FormControl
                        id="bank_code"
                        isInvalid={
                          Boolean(formik.errors.bank_code) &&
                          Boolean(formik.touched.bank_code)
                        }
                      >
                        <CustomFormLabel labelText="Bank Code" />
                        <Select
                          placeholder="Please Select Bank Code"
                          value={formik.values.bank_code}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isDisabled={mode === "VIEW" ? true : false}
                        >
                          {Array.isArray(entitybanks) &&
                            entitybanks.map((option: any) => (
                              <option
                                key={option.psbnkcde}
                                value={option.psbnkcde + "-" + option.psbnknum}
                              >
                                {option.psbnkcde + " (" + option.psbnknum + ")"}
                              </option>
                            ))}
                        </Select>
                        {formik.errors.bank_code && (
                          <FormErrorMessage>
                            {formik.errors.bank_code}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    )}
                    {formik.values.pstrxmod == "G" && (
                      <FormControl
                        id="pstrxgla"
                        isInvalid={
                          Boolean(formik.errors.pstrxgla) &&
                          Boolean(formik.touched.pstrxgla)
                        }
                      >
                        <CustomFormLabel labelText="GL Accounts" />
                        <Select
                          placeholder="Please Select GL Accounts"
                          value={formik.values.pstrxgla}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isDisabled={mode === "VIEW" ? true : false}
                        >
                          {Array.isArray(glaccounts) &&
                            glaccounts.map((option: any) => (
                              <option
                                key={option.psglacno}
                                value={option.psglacno}
                              >
                                {option.psglacno + " - " + option.psgladsc}
                              </option>
                            ))}
                        </Select>
                        {formik.errors.pstrxgla && (
                          <FormErrorMessage>
                            {formik.errors.pstrxgla}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    )}

                    <FormControl
                      id="trx_by"
                      isInvalid={
                        Boolean(formik.errors.trx_by) &&
                        Boolean(formik.touched.trx_by)
                      }
                      isReadOnly={true}
                    >
                      <FormLabel>Transacted By</FormLabel>
                      <Input
                        placeholder={"Enter Transacted By"}
                        type="text"
                        name="trx_by"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.trx_by}

                        //isDisabled={true}
                      />
                      {formik.errors.trx_by && (
                        <FormErrorMessage>
                          {formik.errors.trx_by}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl
                      id="pstrxrmk"
                      isInvalid={
                        Boolean(formik.errors.pstrxrmk) &&
                        Boolean(formik.touched.pstrxrmk)
                      }
                      width="100%"
                    >
                      <FormLabel>Remarks</FormLabel>
                      <Textarea
                        placeholder="Enter Remarks"
                        value={formik.values.pstrxrmk || ""}
                        name="pstrxrmk"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.pstrxrmk && (
                        <FormErrorMessage>
                          {formik.errors.pstrxrmk}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </Box>
                </Box>
              </div>
            </Card>
          </Flex>
        </Box>
      </Flex>
      <Flex justifyContent="flex-end" pl={10} pr={10} pt={10}>
        <Box>
          <Space size="small">
            <Buttons buttonDefaultType={"BACK"} onclick={() => router.back()} />
            {mode && mode !== "VIEW" && (
              <>
                <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
              </>
            )}
          </Space>
        </Box>
      </Flex>
    </form>
  );
}
