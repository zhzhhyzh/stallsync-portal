// Chakra imports
import { Box, Flex, Text, Input, Tabs, TabList, Tab } from "@chakra-ui/react";
// assets
import React, { useState } from "react";
import { DatePicker, Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";
import Card from "@app/components/common/Card/Card";
import Table from "@app/components/common/Table/Table";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import useFetchSchedules from "@app/hooks/selector/useFetchSchedules";
import { fetchSchedules } from "@app/redux/notificationsheduledetail/slice";

import SentHistoryByNotificationTemplatePage from "@app/components/pages/notificationsenthistory/SentHistoryByNotificationTemplate";
import SentHistoryByCustomerPage from "@app/components/pages/notificationsenthistory/SentHistoryByCustomer";

export default function NotificationSentHistoryPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sendRequest, loading } = useApi({
    title: "Sent History",
  });

  const [tabIndex, setTabIndex] = useState(0);
  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="500" mb={1}>
              Sent History Listing
            </Text>
            <Breadcrumbs
              breadcrumbItems={[
                {
                  title: "Sent History Listing",
                },
              ]}
            />
          </Flex>
          
        </Flex>
        <SentHistoryByNotificationTemplatePage />
        {/* <Flex mt={4} bgColor="#fff" py={2}>
          <Tabs onChange={(index) => setTabIndex(index)}>
            <Flex
              bgColor="#fff"
              justifyContent={"space-between"}
              alignItems={"flex-end"}
              gap={5}
            >
              <TabList
                border={0}
              >
                <Tab
                  key={`notlang-tab-1`}
                  py={3}
                  whiteSpace={"nowrap"}
                  ml={{
                    base: 0,
                    md: Spacing.containerPx,
                  }}
                >
                  By Notification Code
                </Tab>
                <Tab
                  key={`notlang-tab-2`}
                  py={3}
                  whiteSpace={"nowrap"}
                  ml={{
                    base: 0,
                    md: Spacing.containerPx,
                  }}
                >
                  By Customer
                </Tab>
              </TabList>
            </Flex>
          </Tabs>
        </Flex> */}

        {/* {tabIndex === 1 ? (
          <SentHistoryByCustomerPage />
        ) : (
          <SentHistoryByNotificationTemplatePage />
        )} */}
      </Box>
    </>
  );
}
