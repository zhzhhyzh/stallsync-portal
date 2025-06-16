// Chakra imports
import Colors from "@app/constants/Colors";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  IconButton,
  Input,
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

export default function BillingDetailForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Loan Account Inquiry" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;
  const [tableData, refreshFn, totalRecords, extra] =
    useFetchLoanAccountsDetails();

  return (
    <>
      <Flex
        flexDir={{
          base: "column",
          lg: "row",
        }}
        gap={Spacing.gap}
        mt={Spacing.gap}
      >
        <Box display={"flex"} flexDir={"column"} w={"100%"}>
          <Card className="grid grid-cols-1 gap-6" borderRadius={0}>
            <div className="flex flex-col sm:flex-column gap-3">
              <Box display="flex" flexDir="column" gap={4} >
                {/* <FormControl
                  id="psacccbl"
                  isInvalid={
                    Boolean(formik.errors.psacccbl) &&
                    Boolean(formik.touched.psacccbl)
                  }
                  isReadOnly={true}
                >
                  <FormLabel>Current Balance</FormLabel>
                  <Input
                    placeholder={"Enter Current Balance"}
                    type="text"
                    name="psacccbl"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.psacccbl}
                    textAlign={"right"}
                    //isDisabled={true}
                  />
                  {formik.errors.psacccbl && (
                    <FormErrorMessage>
                      {formik.errors.psacccbl}
                    </FormErrorMessage>
                  )}
                </FormControl> */}
              </Box>
            </div>
          </Card>
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
