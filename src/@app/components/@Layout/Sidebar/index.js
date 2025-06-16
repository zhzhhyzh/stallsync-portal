/*eslint-disable*/
// chakra imports
import Colors from "@app/constants/Colors";
import { menus } from "@app/routes/menus";
import {
  Box, useColorModeValue
} from "@chakra-ui/react";
import React from "react";
import SidebarContent from "./SidebarContent";
import Spacing from "@app/constants/Spacing";

// FUNCTIONS

function Sidebar(props) {
  // to check for active links and opened collapses
  const mainPanel = React.useRef();
  let variantChange = "0.2s linear";

  const { logoText, routes, sidebarVariant, sideBarShowHide } = props;

  //  BRAND
  //  Chakra Color Mode
  let sidebarBg = Colors.SIDEBAR;
  let sidebarRadius = "0px";
  let sidebarMargins = "0px";
  // if (sidebarVariant === "opaque") {
  // sidebarBg = Colors.PRIMARY //useColorModeValue("white", "gray.700");
  // sidebarRadius = "16px";
  // sidebarMargins = "16px 0px 16px 16px";
  // }
  let sideBarWidth = Spacing.sidebar + "px";
  if (sideBarShowHide) {
    sideBarWidth = Spacing.sidebarHide + "px";
  }

  // SIDEBAR
  return (
    <Box ref={mainPanel}>
      <Box display={{ sm: "none", xl: "block" }} position="fixed">
        <Box
          bg={sidebarBg}
          transition={variantChange}
          w={sideBarWidth}
          maxW="260px"
          // ms={{
          //   sm: "16px",
          // }}
          // my={{
          //   sm: "16px",
          // }}
          // h="calc(100vh - 32px)"
          h="calc(100vh)"
          // ps="20px"
          // pe="20px"
          m={sidebarMargins}
          borderRadius={sidebarRadius}
        >
          <SidebarContent
            routes={menus}
            logoText={"StallSync Portal"}
            display="none"
            sidebarVariant={sidebarVariant}
            sideBarShowHide={sideBarShowHide}
          />
        </Box>
      </Box>
    </Box>
  );
}




export default Sidebar;
