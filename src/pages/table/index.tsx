// Chakra imports
import Colors from "@app/constants/Colors";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Box,
  Flex,
  Text,
  IconButton,
} from "@chakra-ui/react";
// assets
import React, { useState } from "react";

import { DatePicker, Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { formatDate } from "@app/utils/DateUtils";
import Table from "@app/components/common/Table/Table";
import { IoArrowForward, IoTrash } from "react-icons/io5";
import { useAppDispatch } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal } from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";

const { RangePicker } = DatePicker;

//dummy data, simulate from api
const ts = new Date().getTime();

export default function Dashboard() {
  const dispatch = useAppDispatch();

  const columns: any[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_: any, { tags }: any) => (
        <>
          {tags.map((tag: string) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      render: (_: any, record: any) => (
        <Space size="middle">
          <IconButton variant="danger" icon={<IoTrash />} aria-label={"delete"} onClick={() => alertRemove(record?.id)} />
          <IconButton variant="primary" icon={<IoArrowForward />} aria-label={"delete"} />
        </Space>
      ),
    },
  ];

  const data: any[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];

  function alertRemove(id: string) {
    dispatch(
      openGlobalModal({
        title: "Remove item",
        message: "Are you sure to remove this item?",
        status: "custom",
        actions: [
          {
            title: "Cancel",
            isClose: true,
          },
          {
            title: "Remove",
            onClick: onRemove,
            props: {
              variant: "danger",
            },
          },
        ],
      })
    );
  }

  function onRemove() {
    dispatch(closeGlobalModal());
    //set delay because both using same modal component, delay to have some fadeout fadein animation
    setTimeout(() => {
      showModal(dispatch, {
        title: "Remove item",
        message: "Removed",
      });
    }, 200);
  }

  return (
    <>
      <Tabs>
        <Flex
          mx={"-20px"}
          bgColor="#fff"
          justifyContent={"space-between"}
          alignItems={"center"}
          flexDir={{ base: "column", md: "row" }}
          gap={5}
        >
          <TabList border={0}>
            <Tab
              ml={{
                base: 0,
                md: Spacing.containerPx,
              }}
              py={4}
            >
              Table 1
            </Tab>
            <Tab py={3}>Table 2</Tab>
          </TabList>
          <Box
            pr={{
              base: 0,
              md: Spacing.containerPx,
            }}
            // pl={{
            //   base: Spacing.containerPx,
            //   md: 0,
            // }}
            // pb={{
            //   base: Spacing.containerPx,
            //   md: 0,
            // }}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <RangePicker className=" bg-gray-50 h-auto" />
          </Box>
        </Flex>
        <TabPanels>
          <TabPanel p={0} pt={`${Spacing.container}px`}>
            <Box>
              <Card p={0}>
                {/* <Table columns={columns} data={data} /> */}
              </Card>
            </Box>
          </TabPanel>
          <TabPanel p={0} pt={`${Spacing.container}px`}>
            <Card p={0}>
              {/* <Table columns={columns} data={data} /> */}
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
