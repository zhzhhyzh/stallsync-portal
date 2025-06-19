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
import useFetchAnnouncements from "@app/hooks/selector/useFetchAnnouncements";

export default function HeaderLinks(props) {
  const { variant, children, fixed, secondary, onOpen, ...rest } = props;
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [notifications, refreshFn, totalRecords, extra] = useFetchAnnouncements();
  // const notifications = [
  //   { id: 1, psannttl: "System maintenance on 20 June" },
  //   { id: 2, psannttl: "New feature: POS Summary Report" },
  //   { id: 3, psannttl: "Reminder: Update your profile info" },
  //   { id: 4, psannttl: "System maintenance on 20 June" },
  //   { id: 5, psannttl: "New feature: POS Summary Report" },
  //   { id: 6, psannttl: "Reminder: Update your profile info" },
  //   { id: 7, psannttl: "System maintenance on 20 June" },
  //   { id: 8, psannttl: "New feature: POS Summary Report" },
  //   { id: 9, psannttl: "Reminder: Update your profile info" },
  // ];

  // Chakra Color Mode
  let mainTeal = useColorModeValue("teal.300", "teal.300");
  let inputBg = useColorModeValue("white", "gray.800");
  let mainText = useColorModeValue("gray.700", "gray.200");
  let navbarIcon = useColorModeValue("gray.500", "gray.200");
  let searchIcon = useColorModeValue("gray.700", "gray.200");

  if (secondary) {
    navbarIcon = "white";
    mainText = "white";
  }

  function onLogout() {
    dispatch(logout());
    router.replace("/");
  }

  const settingsRef = React.useRef();
  return (
    <Flex
      pe={{ sm: "0px", md: "16px" }}
      w={{ sm: "100%", md: "auto" }}
      alignItems="center"
      flexDirection="row"
      gap={2}
    >
      <SidebarResponsive

        logoText={"StallSync Portal"}
        secondary={props.secondary}
        routes={menus}
        // logo={logo}
        {...rest}
      />
      <Menu>
        <MenuButton>
          <CiBellOn strokeWidth={0} color={navbarIcon} size={32} />
        </MenuButton>
        <MenuList
          p="16px 8px"
          maxH="180px"
          overflowY="auto"
        >
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
      <Menu>
        <MenuButton>
          <HiOutlineUserCircle strokeWidth={1} color={navbarIcon} size={32} />
        </MenuButton>
        <MenuList p="16px 8px">
          <Flex flexDirection="column">
            <MenuItem borderRadius="8px" mb="10px" onClick={() => {
              dispatch(setSideBarRoot("Settings"));
              router.push("/profile/myProfile/");
            }}>
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
