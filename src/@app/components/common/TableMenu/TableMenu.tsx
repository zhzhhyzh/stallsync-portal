import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  TableContainer,
} from "@chakra-ui/react";
import React, { useRef, useState, useEffect } from "react";

import { useRouter } from "next/router";
import { MENU_TYPES } from "@app/interfaces/tableMenu.types";

import { Button, MenuProps, Tooltip } from "antd";
import { Dropdown, Space } from "antd";
import { useAppDispatch } from "@app/hooks/useRedux";
import { setBreadcrumbsInfo } from "@app/redux/app/slice";
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { FiMoreVertical } from "react-icons/fi";

export default function TableMenu(props: TableMenuDefaultProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleClick = (url: string, query: {}, breadcrumb: BreadcrumbItemType[]) => {
    if(breadcrumb && breadcrumb.length > 0){
      dispatch(setBreadcrumbsInfo(breadcrumb));
    }

    router.push({
      pathname: url,
      query: query,
    });
  };

  useEffect(() => {
  if (!props.menus || !Array.isArray(props.menus)) {
    console.warn("TableMenu: 'menus' prop is missing or invalid.");
  }
}, [props.menus]);

const generateMenuList = (data: MENU_TYPES[] = []) => {
  return data
    .filter((item) => item && typeof item === 'object') // prevent undefined/null
    .map((item, index) => {
      if (typeof item.onclick === 'function') {
        return {
          label: item.label,
          key: `${index}`,
          onClick: item.onclick,
        };
      } else {
        return {
          label: item.label,
          key: `${index}`,
          onClick: () =>
            handleClick(item.url || "", item.query || {}, item.breadcrumbRoute || []),
        };
      }
    });
};

  let items: MenuProps["items"] = generateMenuList(props.menus);

  return (
    <Tooltip title="More" arrow={false} placement="bottom">
      <Dropdown menu={{ items }} trigger={["click"]}>
        <Space>
          <Button size="small" type="link" icon={<FiMoreVertical size={18} style={{ display: "flex", marginTop: "5px"}} />} />
        </Space>
      </Dropdown>
    </Tooltip>
    
  );
}

type TableMenuDefaultProps = {
  menus: MENU_TYPES[];
};