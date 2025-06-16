// Chakra imports
import Colors from "@app/constants/Colors";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Input,
  Heading,
  Button,
  Select,
  Link,
  Icon,
  Tooltip,
} from "@chakra-ui/react";

// assets
import React, { ChangeEventHandler, useEffect, useState } from "react";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";

import { DatePicker, Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";
import { ThemeProvider } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { formatDate } from "@app/utils/DateUtils";
import Table from "@app/components/common/Table/Table";
import { IoAdd, IoTrash, IoWarningOutline } from "react-icons/io5";
import { FiMoreVertical } from "react-icons/fi";
import { AiFillEye } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import {
  closeGlobalModal,
  openGlobalModal,
  refreshTable,
  selectHome,
} from "@app/redux/app/slice";
import { createTheme } from "@mui/material/styles";

import { showModal } from "@app/helpers/modalHelper";
import { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import useFetchGeneralType from "@app/hooks/selector/useFetchGeneralType";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { BsPencil } from "react-icons/bs";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { MdLockReset } from "react-icons/md";
import useFetchEntities from "@app/hooks/selector/useFetchEntitites";
import { fetchEntity, getRemoveEntity } from "@app/redux/entity/slice";
import useFetchEntityTreeView from "@app/hooks/selector/useFetchEntityTreeView";
import { Divider } from "@chakra-ui/react";

export default function EntityPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sendRequest, loading } = useApi({ title: "Entity" });
  const homeData = useAppSelector(selectHome);

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] = useFetchEntities();
  const [data, onInit, loading2, reset] = useFetchEntityTreeView();
  // const [ddlData] = useFetchDDL({ code: /["GTCAT"] });
  //pass tableData to table

  const [search, setSearch] = useState();
  const [clicked, setClicked] = useState<any>(null);
  const [category, setCategory] = useState();

  const columns: any[] = [
    {
      title: "Entity Code",
      dataIndex: "psentuid",
      key: "psentuid",
      render: (_: any, record: any) => <>{`${_} - ${record.psentnme}`}</>,
    },
    {
      title: "Group Code",
      dataIndex: "psentpid",
      key: "psentpid",
      render: (_: any, record: any) =>
        _ && <>{`${_} - ${record.psentpiddsc}`}</>,
    },
    {
      title: "Person In Charge",
      dataIndex: "psentpic",
      key: "psentpic",
    },
    {
      title: "HP No.",
      dataIndex: "psentphn",
      key: "psentphn",
    },

    {
      title: "Actions",
      key: "action",
      align: "center",
      width: "10rem",
      render: (_: any, record: any) => (
        <Flex justifyContent="flex-end">
          <Space size="small">
            <Tooltip label="View" fontSize="sm">
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
                icon={<AiFillEye />}
                aria-label={"view"}
                onClick={() => goView(record?.id)}
              />
            </Tooltip>

            {homeData?.access &&
              checkAccessMatrix(homeData?.access, accessType.ENTITY_EDIT) && (
                <Tooltip label="Edit" fontSize="sm">
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
                    icon={<BsPencil />}
                    aria-label={"edit"}
                    onClick={() => goEdit(record?.id)}
                  />
                </Tooltip>
              )}
            {/* {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.ENTITY_DEL)) && (
                <Tooltip label='Delete' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="red"
                    sx={{ _hover: { backgroundColor: Colors.DANGER, color: Colors.BACKGROUND } }}
                    icon={<IoTrash />}
                    aria-label={"delete"}
                    onClick={() => alertRemove(record?.id, record?.psentnme )}
                  />
                </Tooltip>
              )
            } */}

            <TableMenu
              menus={[
                {
                  url: `/maintLogs`,
                  query: {
                    id: record?.id,
                    file: extra.file,
                  },
                  label: "Maint Log",
                  breadcrumbRoute: [
                    {
                      title: "Entity Group Organization",
                      href: `/entity`, // Add parameter if needed eg. /generalParameter/?id=123
                    },
                    {
                      title: "Maintenance Log",
                    },
                  ],
                },
              ]}
            />
          </Space>
        </Flex>
      ),
    },
  ];

  // function showInfo(record: any, index: number) {
  //   dispatch(
  //     openGlobalModal({
  //       title: "Function Account Detail",
  //       status: "custom",
  //       message: <ShowDetail data={record} />,
  //     })
  //   );
  // }

  function alertRemove(id: string, desc: string) {
    dispatch(
      openGlobalModal({
        title: "Delete Record",
        message: RemoveDetail(id, desc),
        status: "warning",
        actions: [
          {
            title: "Confirm",
            onClick: () => {
              onRemove(id);
            },
          },
          {
            title: "Cancel",
            isClose: true,
          },
        ],
      })
    );
  }

  async function onRemove(id: string) {
    const { success } = await sendRequest({
      fn: getRemoveEntity({ id }),
    });
    if (success) {
      setTimeout(() => {
        dispatch(refreshTable());
        showModal(dispatch, {
          title: "Delete Record",
          message: "Record Deleted",
        });
        router.push("/entity");
      }, 200);
    }
  }

  function goAdd() {
    router.push({
      pathname: "/entity/Detail",
      query: {
        id: "",
        mode: "ADD",
      },
    });
  }

  function goEdit(id: string) {
    router.push({
      pathname: "/entity/Detail",
      query: {
        id: id,
        mode: "EDIT",
      },
    });
  }

  function goView(id: string) {
    router.push({
      pathname: "/entity/Detail",
      query: {
        id: id,
        mode: "VIEW",
      },
    });
  }

  function searchOnChange(event: any) {
    setSearch(event.target.value);
  }

  function categoryOnchange(event: any) {
    setCategory(event.target.value);
  }
  const theme = createTheme({
    spacing: 4,
    palette: {
      primary: {
        main: "#007bff",
      },
    },
  });

  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="500" mb={1}>
              Entity Group Organization
            </Text>
            <Breadcrumbs
              breadcrumbItems={[
                {
                  title: "Entity Group Organization",
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
            {/* {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.GEN_ADD)) && ( */}
            <Buttons buttonDefaultType={"ADD"} onclick={() => goAdd()} />
            {/* )
            } */}
          </Box>
        </Flex>

        <Card p={1} mt={4} flexDir="row">
          <Box
            sx={{ margin: 3, flex: 1, borderWidth: 1, borderColor: "#ececec" }}
          >
            <Text fontSize="16pt" fontWeight="300" p={3}>
              Entity Group TreeView
            </Text>
            <Divider mb={3} />
            <ThemeProvider theme={theme}>
              {data && Array.isArray(data) && data.length > 0 && (
                <SimpleTreeView
                  onClick={(e) => setClicked(e.target)}
                  style={{ margin: 3 }}
                >
                  <TreeItem
                    sx={{
                      "& .MuiTreeItem-label": {
                        fontWeight: 900,
                      },
                    }}
                    itemId={data[0].psentuid}
                    label={data[0].psentuid + " (Headquarter)"}
                  >
                    <TreeViewContent branches={data[0].branches} />
                  </TreeItem>
                </SimpleTreeView>
              )}
            </ThemeProvider>
          </Box>
          <Flex
            flex={3}
            flexDir="column"
            bgColor="#fff"
            justifyContent={"space-between"}
            p={3}
          >
            <Flex bgColor="#fff" justifyContent={"space-between"} p={3}>
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
                </Space>
              </Box>
            </Flex>
            <Table
              columns={columns}
              data={tableData}
              refreshFn={fetchEntity}
              totalRecords={totalRecords}
              rowClassName={(record: any, index: number) =>
                clicked &&
                record.psentuid === clicked?.innerHTML.split(" ")[0] &&
                "bg-gray-50"
              }
              extraParams={{
                search: search,
                // type: category,
              }}
              //onDoubleClick={showInfo}
              //length={pageSize}
            />
          </Flex>
        </Card>
      </Box>
    </>
  );
}

const RemoveDetail = (item: string, itemDesc: string) => {
  return (
    <Box w={"100%"} display="flex" flexDirection="column" alignItems="center">
      {/* <Icon as={IoWarningOutline} w={150} h={150} color={Colors.DANGER}/> */}
      <Text p={3}>Are you sure to delete this record?</Text>
      <Text>
        {item} - {itemDesc}
      </Text>
    </Box>
  );
};
const TreeViewContent = ({ branches }: any) => {
  return (
    <>
      {branches.map((branch: any) => (
        <TreeItem itemId={branch.psentuid} label={branch.psentuid}>
          {branch.branches.length > 0 && (
            <TreeViewContent branches={branch.branches} />
          )}
        </TreeItem>
      ))}
    </>
  );
};
