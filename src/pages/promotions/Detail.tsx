import FeeCodeForm from "@app/components/forms/Promotion/PromotionTabs";
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
import PromotionTabs from "@app/components/forms/Promotion/PromotionTabs";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id); //id for Detail, dont pass in params
  const mode = String(router.query?.mode);
  const [submit, setSubmit] = useState(null)
  return (
    <>
      {
        id && id !== "undefined" ? (

          <PromotionTabs  id={id}  mode={mode} />

        ) : (
          <PromotionTabs id={null}  mode={mode} />
        )}
    </>

  );
}
