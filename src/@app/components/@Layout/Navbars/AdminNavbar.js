// Chakra Imports
import Colors from "@app/constants/Colors";
import Spacing from "@app/constants/Spacing";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Text,
  useColorModeValue,
  IconButton
} from "@chakra-ui/react";
import { RxHamburgerMenu } from "react-icons/rx";
import { AiOutlineArrowLeft, AiOutlineMenu } from "react-icons/ai";

import Link from "next/link";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { RiHome5Fill } from "react-icons/ri";
import AdminNavbarLinks from "./AdminNavbarLinks";
import { useBoolean } from '@chakra-ui/react'
import { setSideBarShowHide, selectShowHide } from "@app/redux/app/slice";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";

export default function AdminNavbar(props) {
  const dispatch = useAppDispatch()
  const [scrolled, setScrolled] = useState(false);
  const { variant, children, fixed, breadcrumbs, brandText, onOpen, userName, ...rest } =
    props;
  // Here are all the props that may change depending on navbar's type or state.(secondary, variant, scrolled)
  let mainText = useColorModeValue("gray.700", "gray.200");
  let secondaryText = useColorModeValue("gray.200", "gray.200");
  let navbarPosition = "absolute";
  let navbarFilter = "none";
  let navbarBackdrop = "blur(21px)";
  let navbarShadow = "none";
  let navbarBg = "#fff";
  let navbarBorder = "transparent";
  let secondaryMargin = "0px";
  let paddingX = "30px";

  const sideBarShowHide = useAppSelector(selectShowHide);
  let sideBarWidth = Spacing.sidebar + "px";

  if (sideBarShowHide) {
    sideBarWidth = Spacing.sidebarHide + "px";
  }

  if (props.fixed === true)
    if (scrolled === true) {
      navbarPosition = "fixed";
      navbarShadow = useColorModeValue(
        "0px 7px 23px rgba(0, 0, 0, 0.05)",
        "none"
      );
      navbarBg = useColorModeValue(
        "linear-gradient(112.83deg, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0.8) 110.84%)",
        "linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)"
      );
      navbarBorder = useColorModeValue("#FFFFFF", "rgba(255, 255, 255, 0.31)");
      navbarFilter = useColorModeValue(
        "none",
        "drop-shadow(0px 7px 23px rgba(0, 0, 0, 0.05))"
      );
    }
  if (props.secondary) {
    navbarBackdrop = "none";
    navbarPosition = "absolute";
    mainText = "white";
    secondaryText = "white";
    secondaryMargin = "22px";
    paddingX = "30px";
  }
  const changeNavbar = () => {
    if (window.scrollY > 1) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };
  window.addEventListener("scroll", changeNavbar);
  return (
    <Flex
      position={navbarPosition}
      boxShadow={navbarShadow}
      bg={navbarBg}
      borderColor={navbarBorder}
      filter={navbarFilter}
      backdropFilter={navbarBackdrop}
      borderWidth="1.5px"
      borderStyle="solid"
      transitionDelay="0s, 0s, 0s, 0s"
      transitionDuration=" 0.25s, 0.25s, 0.25s, 0s"
      transition-property="box-shadow, background-color, filter, border"
      transitionTimingFunction="linear, linear, linear, linear"
      alignItems={{ xl: "center" }}
      // borderRadius="16px"
      display="flex"
      minH="90px"
      justifyContent={{ xl: "center" }}
      lineHeight="25.6px"
      mx="auto"
      mt={secondaryMargin}
      pb="8px"
      left={document.documentElement.dir === "rtl" ? "30px" : ""}
      right={document.documentElement.dir === "rtl" ? "" : "0px"}
      px={{
        sm: paddingX,
        md: `${Spacing.container}px`,
      }}
      ps={{
        xl: `${Spacing.container}px`,
      }}
      pt="8px"
      // top="18px"
      w={{ sm: "calc(100% - 0px)", xl: "calc(100% - " + sideBarWidth + ")" }}
      borderBottom={`1px solid rgba(0,0,0,.06)`}
    >
      <Flex
        w="100%"
        flexDirection={{
          // sm: "column",
          // md: "row",
          sm: "row",
        }}
        // alignItems={{ xl: "center" }}
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex
          display={{ sm: "none", xl: "flex" }}
          pr={3}
        >
          <IconButton
            variant='ghost'
            aria-label='Side Bar Show Hide'
            size='md'
            onClick={() => dispatch(setSideBarShowHide(sideBarShowHide ? false : true))}
            //icon={sideBarShowHide ? <AiOutlineMenu /> : <AiOutlineArrowLeft />}
            icon={<AiOutlineMenu />}
          />
        </Flex>
        <Box mb={{ sm: "8px", md: "0px" }}>
          <Text>Good {daySession()}, {userName}</Text>
          {/* <Text fontSize={"xl"} fontWeight="medium" mb={1}>
            {brandText}
          </Text>
          <Breadcrumb>
            <BreadcrumbItem color={mainText}>
              <Link href="/">
                <RiHome5Fill className=" text-gray-400" fontSize={14} />
              </Link>
            </BreadcrumbItem>

            <BreadcrumbItem color={mainText}>
              <Text fontSize={"xs"}>{brandText}</Text>
            </BreadcrumbItem>
          </Breadcrumb> */}
        </Box>
        <Box ms="auto">
          <AdminNavbarLinks
            onOpen={props.onOpen}
            logoText={props.logoText}
            secondary={props.secondary}
            fixed={props.fixed}
          />
        </Box>
      </Flex>
    </Flex>
  );
}

function daySession() {
  var today = new Date();
  var curHr = today.getHours();

  if (curHr < 12) {
    return "Morning";
  } else if (curHr < 18) {
    return "Afternoon";
  } else {
    return "Evening";
  }
}

AdminNavbar.propTypes = {
  brandText: PropTypes.string,
  variant: PropTypes.string,
  secondary: PropTypes.bool,
  fixed: PropTypes.bool,
  onOpen: PropTypes.func,
};
