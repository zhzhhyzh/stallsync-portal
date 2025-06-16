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
} from "@chakra-ui/react";
import Link from "next/link";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { RiHome5Fill } from "react-icons/ri";

export default function HeaderNavbar(props) {
  const [scrolled, setScrolled] = useState(false);
  const { variant, children, fixed, breadcrumbs, brandText, onOpen, ...rest } =
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
  
  return (
    <Flex
      pb="8px"
      pt="8px"
    >
      <Flex
        w="100%"
        flexDirection={{
          sm: "row",
        }}
        alignItems="center"
        justifyContent="space-between"
      >
        <Box mb={{ sm: "8px", md: "0px" }}>
          <Text fontSize={"xl"} fontWeight="medium" mb={1}>
            {brandText}
          </Text>
          <Breadcrumb>
            <BreadcrumbItem color={mainText}>
              <Link href="/dashboard">
                <RiHome5Fill className=" text-gray-400" fontSize={14} />
              </Link>
            </BreadcrumbItem>

            <BreadcrumbItem color={mainText}>
              <Text fontSize={"xs"}>{brandText}</Text>
            </BreadcrumbItem>
          </Breadcrumb>
        </Box>
      </Flex>
    </Flex>
  );
}

HeaderNavbar.propTypes = {
  brandText: PropTypes.string,
  variant: PropTypes.string,
  secondary: PropTypes.bool,
  fixed: PropTypes.bool,
  onOpen: PropTypes.func,
};
