/*eslint-disable*/
import { HamburgerIcon } from "@chakra-ui/icons";
// chakra imports
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  Collapse,
  IconButton,
} from "@chakra-ui/react";
import IconBox from "@app/components/Icons/IconBox";
import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Separator } from "@app/components/common/Separator/Separator";
import Colors from "@app/constants/Colors";
import { AiOutlineMenu } from "react-icons/ai";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { selectHome } from "@app/redux/app/slice";
import { checkMenuAccessMatrix } from "@app/utils/access-matrix";

function SidebarResponsive(props) {
  let router = useRouter();

  // to check for active links and opened collapses
  // this is for the rest of the collapses
  const [state, setState] = React.useState({});
  const [menuCollapse, setMenuCollapse] = React.useState({});

  const homeData = useAppSelector(selectHome);

  const mainPanel = React.useRef();

  // SIDEBAR
  const { isOpen, onOpen, onClose } = useDisclosure();

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return router?.pathname === routeName ? "active" : "";
  };

  const activeBg = Colors.PRIMARY; // useColorModeValue("white", "gray.700");
  const inactiveBg = "transparent"; // useColorModeValue("white", "gray.700");
  const activeColor = "gray.700"; // useColorModeValue("gray.700", "white");
  const inactiveColor = "gray.400"; // useColorModeValue("gray.400",
  const paddingStartEnd = "10px";

  const createLinks = (routes) => {
    return routes.map((props, key) =>
      props?.group ? <SideBarGroup key={`side-bar-group-${key}`} {...props} /> : <SideBarLink key={`side-bar-link-${key}`} {...props} />
    );
  };

  const SideBarGroup = (props) => {
    const canAccess = homeData?.access && checkMenuAccessMatrix(homeData?.access, props.permissions);
    if (!canAccess) return <span />;
    
    return (
      <Box mt={5}>
        <Text
          color="gray.400"
          textTransform={"uppercase"}
          fontSize="sm"
          ps={paddingStartEnd}
          pe={paddingStartEnd}
          mb={2}
        >
          {props?.group}
        </Text>
        {props?.children.map((cProps, index) => (
          <SideBarLink key={`side-bar-link-${index}`} {...cProps} />
        ))}
      </Box>
    );
  };

  const SideBarLink = (props) => {
    const isActive = activeRoute(props.href) === "active";
    const key = props.label.split(" ").join("");
    const DropdownIcon = menuCollapse[key] ? IoChevronUp : IoChevronDown;
    
    const canAccess = homeData?.access && checkMenuAccessMatrix(homeData?.access, props.permissions);
    if (!canAccess) return <span />;

    return (
      <Box
        bgColor={menuCollapse[key] ? "rgba(255,255,255,.03)" : "transparent"}
        ps={paddingStartEnd}
        pe={paddingStartEnd}
      >
        {
          props?.children?.length ? (
            <Box
              href={props.href || ""}
              key={`sidebar-link-${key}`}
              className="cursor-pointer"
              onClick={props?.children?.length > 0 ? null : onClose}
            >
              <Button
                boxSize="initial"
                justifyContent="flex-start"
                alignItems="center"
                bg={"transparent"}
                mb={{
                  xl: "12px",
                }}
                mx={{
                  xl: "auto",
                }}
                // ps={{
                //   sm: "10px",
                //   xl: "16px",
                // }}
                py="12px"
                px={0}
                borderRadius="7px"
                _hover="none"
                w="100%"
                _active={{
                  bg: "inherit",
                  transform: "none",
                  borderColor: "transparent",
                }}
                _focus={{
                  boxShadow: "none",
                }}
                onClick={() => {
                  if ((props?.children || []).length > 0) {
                    setMenuCollapse((prev) => ({
                      ...prev,
                      [key]: !(menuCollapse[key] || false),
                    }));
                  }
                }}
              >
                <Flex
                  gap={4}
                  alignItems="center"
                  justifyContent={"space-between"}
                  w="100%"
                >
                  <Flex gap={4} alignItems="center">
                    <IconButton
                      icon={
                        <props.icon
                          color={isActive ? activeColor : inactiveColor}
                          size={17}
                        >
                          {props.icon}
                        </props.icon>
                      }
                      bg={isActive ? Colors.PRIMARY : "transparent"}
                      color={isActive ? "white" : Colors.PRIMARY}
                      size="sm"
                    />
                    <Text
                      color={isActive ? activeColor : inactiveColor}
                      fontSize="sm"
                      margin={0}
                      lineHeight={1}
                      fontWeight="normal"
                      mt={1}
                    >
                      {props.label}
                    </Text>
                  </Flex>
                  {props?.children?.length > 0 && (
                    <DropdownIcon
                      size={14}
                      color={isActive ? activeColor : inactiveColor}
                    />
                  )}
                </Flex>
              </Button>
            </Box>
          ) : (
            <Link
              href={props.href || ""}
              key={`sidebar-link-${key}`}
              className="cursor-pointer"
              onClick={props?.children?.length > 0 ? null : onClose}
            >
              <Button
                boxSize="initial"
                justifyContent="flex-start"
                alignItems="center"
                bg={"transparent"}
                mb={{
                  xl: "12px",
                }}
                mx={{
                  xl: "auto",
                }}
                // ps={{
                //   sm: "10px",
                //   xl: "16px",
                // }}
                py="12px"
                px={0}
                borderRadius="7px"
                _hover="none"
                w="100%"
                _active={{
                  bg: "inherit",
                  transform: "none",
                  borderColor: "transparent",
                }}
                _focus={{
                  boxShadow: "none",
                }}
                onClick={() => {
                  if ((props?.children || []).length > 0) {
                    setMenuCollapse((prev) => ({
                      ...prev,
                      [key]: !(menuCollapse[key] || false),
                    }));
                  }
                }}
              >
                <Flex
                  gap={4}
                  alignItems="center"
                  justifyContent={"space-between"}
                  w="100%"
                >
                  <Flex gap={4} alignItems="center">
                    <IconButton
                      icon={
                        <props.icon
                          color={isActive ? activeColor : inactiveColor}
                          size={17}
                        >
                          {props.icon}
                        </props.icon>
                      }
                      bg={isActive ? Colors.PRIMARY : "transparent"}
                      color={isActive ? "white" : Colors.PRIMARY}
                      size="sm"
                    />
                    <Text
                      color={isActive ? activeColor : inactiveColor}
                      fontSize="sm"
                      margin={0}
                      lineHeight={1}
                      fontWeight="normal"
                      mt={1}
                    >
                      {props.label}
                    </Text>
                  </Flex>
                </Flex>
              </Button>
            </Link>
          )
        }
        {/* <Link
          href={props.href || ""}
          key={`sidebar-link-${key}`}
          className="cursor-pointer"
          onClick={props?.children?.length > 0 ? null : onClose}
        >
          <Button
            boxSize="initial"
            justifyContent="flex-start"
            alignItems="center"
            bg={"transparent"}
            mb={{
              xl: "12px",
            }}
            mx={{
              xl: "auto",
            }}
            // ps={{
            //   sm: "10px",
            //   xl: "16px",
            // }}
            py="12px"
            px={0}
            borderRadius="7px"
            _hover="none"
            w="100%"
            _active={{
              bg: "inherit",
              transform: "none",
              borderColor: "transparent",
            }}
            _focus={{
              boxShadow: "none",
            }}
            onClick={() => {
              if ((props?.children || []).length > 0) {
                setMenuCollapse((prev) => ({
                  ...prev,
                  [key]: !(menuCollapse[key] || false),
                }));
              }
            }}
          >
            <Flex
              gap={4}
              alignItems="center"
              justifyContent={"space-between"}
              w="100%"
            >
              <Flex gap={4} alignItems="center">
                <IconButton
                  icon={
                    <props.icon
                      color={isActive ? activeColor : inactiveColor}
                      size={17}
                    >
                      {props.icon}
                    </props.icon>
                  }
                  bg={isActive ? Colors.PRIMARY : "transparent"}
                  color={isActive ? "white" : Colors.PRIMARY}
                  size="sm"
                />
                <Text
                  color={isActive ? activeColor : inactiveColor}
                  fontSize="sm"
                  margin={0}
                  lineHeight={1}
                  fontWeight="normal"
                  mt={1}
                >
                  {props.label}
                </Text>
              </Flex>
              {props?.children?.length > 0 && (
                <DropdownIcon
                  size={14}
                  color={isActive ? activeColor : inactiveColor}
                />
              )}
            </Flex>
          </Button>
        </Link> */}
        {props?.children?.length > 0 && <SideBarCollapseContent {...props} />}
      </Box>
    );
  };

  const SideBarCollapseContent = (props) => {
    const key = props.label.split(" ").join("");
    return (
      <Collapse
        animateOpacity
        in={menuCollapse[key]}
        key={`sidebar-link-collapse-${key}`}
      // ps={paddingStartEnd}
      // pe={paddingStartEnd}
      >
        <Box mb={3}>
          <Box
            borderLeft={`1px solid rgba(120,120,120,.1)`}
            display="flex"
            flexDir="column"
            ml={4}
            pl={5}
            gap={5}
          >
            {props.children?.map((item, index) => {
              const isActive = activeRoute(item.href) === "active";
              const canAccess = homeData?.access && checkMenuAccessMatrix(homeData?.access, item.permissions);
              if (!canAccess) return "";
              return (
                <Box py={2} key={`sidebar-collapse-${index}`}>
                  <Link
                    href={item.href || ""}
                    key={item.label.split(" ").join()}
                    onClick={onClose}
                  >
                    <Text
                      color={isActive ? activeColor : inactiveColor}
                      fontSize="xs"
                      margin={0}
                      lineHeight={1}
                      fontWeight="normal"
                    >
                      {item.label}
                    </Text>
                  </Link>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Collapse>
    );
  };

  const { logoText, routes, ...rest } = props;

  var links = <>{createLinks(routes)}</>;
  //  BRAND
  //  Chakra Color Mode
  let hamburgerColor = useColorModeValue("gray.500", "gray.200");
  if (props.secondary === true) {
    hamburgerColor = "white";
  }
  var brand = (
    <Box pt={"35px"} mb="8px">
      <Link
        href={`/dashboard`}
        onClick={onClose}
        target="_blank"
        display="flex"
        // lineHeight="100%"
        mb="30px"
        fontWeight="bold"
        // justifyContent="center"
        // alignItems="center"
        fontSize="11px"
      >
        <Text fontSize="sm" mt="3px">
          {logoText}
        </Text>
      </Link>
      {/* <Separator></Separator> */}
    </Box>
  );

  const btnRef = React.useRef();
  // Color variables
  return (
    <Flex
      display={{ sm: "flex", xl: "none" }}
      ref={mainPanel}
      alignItems="center"
    >
      <AiOutlineMenu
        color={hamburgerColor}
        size={25}
        // ref={btnRef}
        // colorScheme="teal"
        onClick={onOpen}
      />
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement={document.documentElement.dir === "rtl" ? "right" : "left"}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent
          w="250px"
          maxW="250px"
          ms={{
            sm: "16px",
          }}
          my={{
            sm: "16px",
          }}
          borderRadius="16px"
          p=".5rem"
        >
          <DrawerCloseButton
            _focus={{ boxShadow: "none" }}
            _hover={{ boxShadow: "none" }}
          />
          <DrawerBody maxW="250px" px=".5rem">
            <Box maxW="100%" h="100%">
              <Box>{brand}</Box>
              <Stack direction="column" mb="40px">
                <Box>{links}</Box>
              </Stack>
              {/* <SidebarHelp></SidebarHelp> */}
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}

export default SidebarResponsive;
