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

export default function NotificationTemplateTable(
  props: NotificationTemplateTableProps
) {
  const { formik, onClose, channel, msgType, onChangeTemplate } = props;

  const { sendRequest, loading } = useApi({
    title: "Notification Template Table",
  });

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] =
    useFetchNotificationTemplates();
  const [ddlData] = useFetchDDL({ code: ["NOTCATG", "YESORNO"] });
  //pass tableData to table
  // const [pageSize, setPageSize] = useState(10);
  // const [page, setPage] = useState(1);

  const [search, setSearch] = useState();
  const [notStatus, setNotStatus] = useState();
  const [notCat, setNotCat] = useState();

  const [selectedRecord, setSelectedRecord] = useState();

  const columns: any[] = [
    {
      title: "Notification Code",
      dataIndex: "psnotcde",
      key: "psnotcde",
    },
    {
      title: "Description",
      dataIndex: "psnotdsc",
      key: "psnotdsc",
    },
    {
      title: "Status",
      dataIndex: "psnotistdsc",
      key: "psnotistdsc",
      render: (_: string, record: any) =>
        record?.psnotist === "Y" ? (
          <Text
            fontWeight={"normal"}
            color={"white"}
            textAlign="center"
            style={{
              width: 40,
              height: 20,
              backgroundColor: Colors.SUCCESS,
              borderRadius: 10,
            }}
          >
            Yes
          </Text>
        ) : (
          <Text
            fontWeight={"normal"}
            color={"white"}
            textAlign="center"
            style={{
              width: 40,
              height: 20,
              backgroundColor: Colors.DANGER,
              borderRadius: 10,
            }}
          >
            No
          </Text>
        ),
    },
    {
      title: "Type",
      dataIndex: "psnotchndsc",
      key: "psnotchndsc",
    },
    {
      title: "Category",
      dataIndex: "psnotcatdsc",
      key: "psnotcatdsc",
    },
    {
      title: "Actions",
      key: "action",
      align: "center",
      //width: "10rem",
      render: (_: any, record: any) => (
        <Flex justifyContent="center">
          <Space size="small">
            <Tooltip label="Select" fontSize="sm">
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
                icon={<AiOutlineCheck />}
                aria-label={"select"}
                onClick={() => assignContent(record?.psnotcde, record?.psnotchn)}
              />
            </Tooltip>
          </Space>
        </Flex>
      ),
    },
  ];

  useEffect(() => {
    if(onChangeTemplate){
      onChangeTemplate(selectedRecord);
    }
  }, [selectedRecord]);

  function searchOnChange(event: any) {
    setSearch(event.target.value);
  }

  // function notificationStatusOnchange(event: any) {
  //   setNotStatus(event.target.value);
  // }

  function notificationCategoryOnchange(event: any) {
    setNotCat(event.target.value);
  }

  async function assignContent(notCode: string, notChannel: string) {
    let response = await sendRequest({
      fn: fetchNotificationTemplateDetail({
        psnotcde: notCode,
        psnotchn: notChannel,
        psmsglng: "1",
      }),
    });

    setSelectedRecord(response?.message);
    onClose();
  }

  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
              Notification Template Listing
            </Text>
            <Breadcrumbs
              breadcrumbItems={[
                {
                  title: "Notification Template Listing",
                },
              ]}
            />
          </Flex>
        </Flex>
        <Card p={4} mt={5}>
          <Flex bgColor="#fff" justifyContent={"space-between"} pb={3}>
            <Box
              pr={{
                base: 0,
                md: Spacing.containerPx,
              }}
              display="flex"
            >
              <Space size="middle">
                <Input
                  type="text"
                  name="search"
                  onChange={searchOnChange}
                  placeholder="Search"
                  value={search}
                />
                {/* <Select
                  name="notStatus"
                  onChange={notificationStatusOnchange}
                  placeholder="Please Select Notification Status"
                  value={notStatus}
                >
                  {ddlData?.YESORNO?.map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select> */}
                <Select
                  name="notCat"
                  onChange={notificationCategoryOnchange}
                  placeholder="Please Select Notification Category"
                  value={notCat}
                >
                  {ddlData?.NOTCATG?.filter((item: DDL_TYPES) => item.prgecode !== "INS").map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
              </Space>
            </Box>
          </Flex>
          <Table
            rowKey="psnotcde"
            columns={columns}
            data={tableData}
            refreshFn={fetchNotificationTemplates}
            totalRecords={totalRecords}
            extraParams={{
              search: search,
              psnotchn: channel,
              psnotist: "Y",
              psnotcat: notCat,
              psmsptyp: msgType,
            }}
          />
        </Card>
      </Box>
    </>
  );
}

type NotificationTemplateTableProps = {
  channel: "EML" | "EMLE" | "PSH" | "WAP";
  msgType?: string;
  formik?: any;
  onClose?: any;
  onChangeTemplate?: (template: any) => void;
};
