import ProdCodeForm from "@app/components/forms/Product/ProdCodeForm";
import ProdFeeForm from "@app/components/forms/Product/ProdFeeForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Card,
  Flex,
  Text,
  Box,
} from '@chakra-ui/react'
import Spacing from "@app/constants/Spacing";
import ProdFeeTable from "@app/components/forms/Product/ProdFeeTable";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import Buttons from "@app/components/common/Buttons/Buttons";
import { Space } from "antd";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id); //id for Detail, dont pass in params
  const prquecod = String(router.query?.prquecod); //queue code 
  const mode = String(router.query?.mode);
  const [feeMode, setFeeMode] = useState("LISTING")
  const [feeId, setFeeId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submit, setSubmit] = useState(null)
  return (
    <>
      {
        id && id !== "undefined" ? (

          <ProdCodeForm setSubmit={setSubmit} setLoading={setLoading} id={id} prquecod={prquecod} mode={mode} />

        ) : (
          <ProdCodeForm id={null} prquecod={prquecod} mode={mode} />
        )}
    </>

  );
}
