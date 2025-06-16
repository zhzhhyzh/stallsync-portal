// Chakra imports
import Colors from "@app/constants/Colors";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Input,
  Tooltip,
  Select,
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";
import { Space } from "antd";
import Spacing from "@app/constants/Spacing";
import Card from "@app/components/common/Card/Card";
import Table from "@app/components/common/Table/Table";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { selectHome } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import useFetchNotificationTemplates from "@app/hooks/selector/useFetchNotificationTemplates";
import { AiOutlineCheck } from "react-icons/ai";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import {
  fetchNotificationTemplateDetail,
  fetchNotificationTemplates,
} from "@app/redux/notificationtemplate/slice";
import useApi from "@app/hooks/useApi";
import useFetchPreviewSegments from "@app/hooks/selector/useFetchPreviewSegments";
import { fetchPreviewSegments } from "@app/redux/segment/slice";

export default function PreviewSegmentTable(
  props: PreviewSegmentTableProps
) {
  const { formik } = props;

  const { sendRequest, loading } = useApi({
    title: "Preview Segment Table",
  });

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] =
    useFetchPreviewSegments();
  //pass tableData to table
  // const [pageSize, setPageSize] = useState(10);
  // const [page, setPage] = useState(1);

  const columns: any[] = [
    {
      title: "Name",
      dataIndex: "igcfname",
      key: "igcfname",
    },
    {
      title: "Email",
      dataIndex: "igcfemal",
      key: "igcfemal",
    },
  ];

  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
              Preview Segment List
            </Text>
            <Breadcrumbs
              breadcrumbItems={[
                {
                  title: "Preview Segment List",
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
            refreshFn={fetchPreviewSegments}
            totalRecords={totalRecords}
            extraParams={{
              id: formik.values.segment,
            }}
          />
        </Card>
      </Box>
    </>
  );
}

type PreviewSegmentTableProps = {
  formik?: any;
};
