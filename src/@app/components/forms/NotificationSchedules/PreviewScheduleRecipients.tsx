// Chakra imports
import Colors from "@app/constants/Colors";
import {
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";
import { Space } from "antd";
import Spacing from "@app/constants/Spacing";
import Card from "@app/components/common/Card/Card";
import Table from "@app/components/common/Table/Table";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import useApi from "@app/hooks/useApi";
import useFetchPreviewScheduleRecipients from "@app/hooks/selector/useFetchPreviewScheduleRecipients";
import { fetchScheduleRecipients } from "@app/redux/notificationsheduledetail/slice";

export default function PreviewScheduleRecipients(
  props: PreviewScheduleRecipientsProps
) {
  const { id } = props;

  const { sendRequest, loading } = useApi({
    title: "Preview Recipients Table",
  });

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] =
    useFetchPreviewScheduleRecipients();
  //pass tableData to table
  // const [pageSize, setPageSize] = useState(10);
  // const [page, setPage] = useState(1);

  const columns: any[] = [
    {
      title: "Recipients",
      dataIndex: "email",
      key: "email",
    },
  ];

  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
              Recipients List
            </Text>
            <Breadcrumbs
              breadcrumbItems={[
                {
                  title: "Recipients List",
                },
              ]}
            />
          </Flex>
        </Flex>
        <Card p={4} mt={5}>
          <Flex bgColor="#fff" justifyContent={"space-between"} pb={3}>
            {/* <Box
              pr={{
                base: 0,
                md: Spacing.containerPx,
              }}
              display="flex"
            >
              <Space size="middle">
              </Space>
            </Box> */}
          </Flex>
          <Table
            rowKey="id"
            columns={columns}
            data={tableData}
            refreshFn={fetchScheduleRecipients}
            totalRecords={totalRecords}
            extraParams={{
              id: id,
            }}
          />
        </Card>
      </Box>
    </>
  );
}

type PreviewScheduleRecipientsProps = {
  id: string;
};
