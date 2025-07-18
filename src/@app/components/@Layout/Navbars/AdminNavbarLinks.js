// Chakra Icons
import { BellIcon, SearchIcon } from "@chakra-ui/icons";
// Chakra Imports
import {
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import SidebarResponsive from "@app/components/@Layout/Sidebar/SidebarResponsive";
import PropTypes from "prop-types";
import React from "react";
import { menus } from "@app/routes/menus";
import { CiBellOn } from "react-icons/ci";
import { HiOutlineUserCircle } from "react-icons/hi";

import Link from "next/link";
import { logout, setSideBarRoot } from "@app/redux/app/slice";
import { useAppDispatch } from "@app/hooks/useRedux";
import { useRouter } from "next/router";
import useFetchAnnouncements2 from "@app/hooks/selector/useFetchAnnouncements2";
import { list2 } from "@app/redux/announcement/slice";


export default function HeaderLinks(props) {
  const { variant, children, fixed, secondary, onOpen, ...rest } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [notifications, setNotifications] = React.useState([]);

  // Chakra Color Mode
  let mainText = useColorModeValue("gray.700", "gray.200");
  let navbarIcon = useColorModeValue("gray.500", "gray.200");

  if (secondary) {
    navbarIcon = "white";
    mainText = "white";
  }

  function onLogout() {
    dispatch(logout());
    router.replace("/");
  }

  return (
    <Flex
      pe={{ sm: "0px", md: "16px" }}
      w={{ sm: "100%", md: "auto" }}
      alignItems="center"
      flexDirection="row"
      gap={2}
    >
      {/* Sidebar */}
      <SidebarResponsive
        logoText={"StallSync Portal"}
        secondary={props.secondary}
        routes={menus}
        {...rest}
      />

      {/* 🔔 Notification Bell */}
      <Menu
     onOpen={async () => {
  const res = await dispatch(list2({ status: "Y" }));
  const records = res?.payload?.message?.data ?? [];
  setNotifications(records);
}}

      >
        <MenuButton>
          <CiBellOn strokeWidth={0} color={navbarIcon} size={32} />
        </MenuButton>
        <MenuList p="16px 8px" maxH="180px" overflowY="auto">
          {notifications.length === 0 ? (
            <MenuItem borderRadius="8px">
              <Text>No notifications found.</Text>
            </MenuItem>
          ) : (
            notifications.map((notif, index) => (
              <MenuItem key={notif.id} borderRadius="8px" mb="10px">
                <Text>{`${index + 1}. ${notif.psannttl}`}</Text>
              </MenuItem>
            ))
          )}
        </MenuList>
      </Menu>

      {/* 👤 User Profile */}
      <Menu>
        <MenuButton>
          <HiOutlineUserCircle strokeWidth={1} color={navbarIcon} size={32} />
        </MenuButton>
        <MenuList p="16px 8px">
          <Flex flexDirection="column">
            <MenuItem
              borderRadius="8px"
              mb="10px"
              onClick={() => {
                dispatch(setSideBarRoot("Settings"));
                router.push("/profile/myProfile/");
              }}
            >
              <Text>Profile</Text>
            </MenuItem>
            <MenuItem borderRadius="8px" onClick={onLogout}>
              <Text>Logout</Text>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
};
