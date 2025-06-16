import Form from "@app/components/forms/Application/BackOfficeApplicationForm";
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
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import Buttons from "@app/components/common/Buttons/Buttons";
import { Space } from "antd";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id); //id for Detail, dont pass in params
  const status = String(router.query?.status); //id for Detail, dont pass in params
  const mode = String(router.query?.mode);
  const [submit, setSubmit] = useState(null)
  // useEffect(()=>{
  //   console.log(id,"HEHEHHEHE")
  // },[id])
  return (
    <>
      {
        id && id !== "undefined" ? (

          <Form status={status}  id={id}  mode={mode} />

        ) : (
          <Form status={null} id={null}  mode={mode} />
        )}
    </>

  );
}
