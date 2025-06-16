/*eslint-disable*/
// chakra imports
import {
  Box,
  Button,
  Collapse,
  Flex,
  Stack,
  Text,
  useColorModeValue,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import Image from "next/image";
import LogoImage from "@app/assets/img/logo-rmbg.png";
import { CreativeTimLogo } from "@app/components/Icons/Icons";
import { Separator } from "@app/components/common/Separator/Separator";
import { SidebarHelp } from "./SidebarHelp";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Colors from "@app/constants/Colors";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import {
  selectHome,
  selectSideBarRoot,
  setSideBarRoot,
} from "@app/redux/app/slice";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { checkMenuAccessMatrix } from "@app/utils/access-matrix";
import { IoLogoGithub } from "react-icons/io5";
import { setSideBarShowHide, selectShowHide } from "@app/redux/app/slice";
import { Dropdown } from "antd";
import Spacing from "@app/constants/Spacing";
import { BsChevronRight } from "react-icons/bs";
// import { NavLink, useLocation } from "react-router-dom";

// this function creates the links and collapses that appear in the sidebar (left menu)

const SidebarContent = ({ logoText, routes, sideBarShowHide }) => {
  // to check for active links and opened collapses
  let router = useRouter();
  const dispatch = useAppDispatch();
  // this is for the rest of the collapses
  const [state, setState] = React.useState({});
  const [menuCollapse, setMenuCollapse] = React.useState({});

  const homeData = useAppSelector(selectHome);
  const sideBarRoot = useAppSelector(selectSideBarRoot);

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName, root) => {
    let pathName = router?.pathname && router?.pathname != "" && router?.pathname != "/" ? router?.pathname + "/" : "";
    let menuRouteName = routeName && routeName != "" ? routeName + "/" : routeName;

    return pathName === menuRouteName ||
      pathName.indexOf(menuRouteName) !== -1
      ? "active"
      : "";
  };

  const activeRouteRoot = (root) => {
    return root === sideBarRoot ? "active" : "";
  };

  // Chakra Color Mode
  const activeBg = Colors.PRIMARY; // useColorModeValue("white", "gray.700");
  const inactiveBg = "transparent"; // useColorModeValue("white", "gray.700");
  const activeColor = "#fff"; // useColorModeValue("gray.700", "white");
  const inactiveColor = "rgba(255,255,255,.4)"; // useColorModeValue("gray.400", "gray.400");
  const paddingStartEnd = "20px";

  const createLinks = (routes) => {
    return routes.map((props, key) =>
      props?.group ? (
        <SideBarGroup key={`side-bar-group-${key}`} {...props} />
      ) : (
        <SideBarLink key={`side-bar-link-${key}`} {...props} />
      )
    );
  };

  const SideBarGroup = (props) => {
    const canAccess =
      homeData?.access &&
      checkMenuAccessMatrix(homeData?.access, props.permissions);
    if (!canAccess) return <span />;

    return (
      <Box mt={sideBarShowHide ? 0 : 5}>
        {!sideBarShowHide && (
          <Text
            color="rgba(255,255,255,.3)"
            textTransform={"uppercase"}
            fontSize="xs"
            // fontWeight={"bold"}
            ps={paddingStartEnd}
            pe={paddingStartEnd}
            mb={2}
          >
            {props?.group}
          </Text>
        )}
        {props?.children.map((cProps, index) => (
          <SideBarLink key={`side-bar-link-${index}`} {...cProps} />
        ))}
      </Box>
    );
  };

  const SideBarLink = (props) => {
    const isActive = activeRoute(props.href, props.root) === "active";
    const isRootActive = activeRouteRoot(props.root) === "active";
    const key = props.label?.split(" ").join("");
    const DropdownIcon = menuCollapse[key] ? IoChevronUp : IoChevronDown;

    const canAccess =
      homeData?.access &&
      checkMenuAccessMatrix(homeData?.access, props.permissions);
    if (!canAccess) return <span />;

    const SideBarHideTriggerButton = ({ ...rest }) => (
      <Button
        boxSize="initial"
        //justifyContent="flex-start"
        //alignItems="center"
        bg={"transparent"}
        mb={{
          xl: "auto",
        }}
        mx={{
          xl: "auto",
        }}
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
        {...rest}
      >
        <Flex
          gap={4}
          w="100%"
          alignItems="center"
          flexDir={"column"}
          pl={"-3px"}
        >
          <props.icon
            color={isRootActive || isActive ? activeColor : inactiveColor}
            size={25}
          >
            {props.icon}
          </props.icon>
        </Flex>
      </Button>
    );

    const toggleDropdown = (props, id) => {
      if ((props?.children || []).length > 0) {
        const contentElement = document?.getElementById(id);
        if (contentElement) {
          if (contentElement.style.display === "block") {
            contentElement.style.display = "none";
          } else {
            contentElement.style.display = "block";
            // setDropdownOpen((prev) => ({
            //   ...prev,
            //   [key]: true,
            // }));
          }
        }
      }
    };

    return (
      <Box
        bgColor={menuCollapse[key] ? "rgba(255,255,255,.03)" : "transparent"}
        ps={sideBarShowHide ? "13px" : paddingStartEnd}
        pe={paddingStartEnd}
        borderLeft={"3px solid " + (isRootActive ? "#fff" : "transparent")}
        mt={sideBarShowHide ? 3 : 3}
      >
        {sideBarShowHide ? (
          <>
            {!props.children ? (
              <Link
                href={props.href || ""}
                key={`sidebar-link-${key}`}
                className="cursor-pointer"
                onClick={() => dispatch(setSideBarRoot(props?.root))}
              >
                <SideBarHideTriggerButton />
              </Link>
            ) : (
              <Dropdown
                trigger="click"
                placement="bottomRight"
                overlayStyle={{
                  left: Spacing.sidebarHide - 10,
                }}
                menu={{
                  style: {
                    background: Colors.SIDEBAR,
                    marginTop: -40,
                  },
                  items: (props?.children || []).map((cProps, index) => {
                    const isMenuItemActive =
                      activeRoute(cProps.href || "") === "active";
                    const canAccess =
                      homeData?.access &&
                      checkMenuAccessMatrix(
                        homeData?.access,
                        cProps.permissions
                      );
                    if (!canAccess) return "";

                    const key2 = cProps.label.split(" ").join("");
                    const contentId = `sidebar-minimise-${key2}`;

                    return {
                      key: `side-bar-link-${cProps.label
                        .split(" ")
                        .join()}-${index}`,
                      label: (
                        <Box
                          onMouseEnter={(e) => {
                            toggleDropdown(cProps, contentId);
                          }}
                          onMouseLeave={() => toggleDropdown(cProps, contentId)}
                        >
                          <Flex
                            gap={4}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                          >
                            <Link
                              href={cProps.href || ""}
                              key={cProps.label.split(" ").join()}
                            >
                              <Text
                                color={
                                  isMenuItemActive ? activeColor : inactiveColor
                                }
                                fontSize="sm"
                                margin={0}
                                lineHeight={1}
                                fontWeight="normal"
                                className="px-1 py-2"
                              >
                                {cProps.label}
                              </Text>
                            </Link>
                            {cProps?.children?.length > 0 && (
                              <DropdownIcon size={16} color={inactiveColor} />
                            )}
                          </Flex>
                          {sideBarShowHide &&
                            // menuCollapse[key2] &&
                            cProps?.children?.length > 0 && (
                              <Box id={contentId} className="hidden">
                                {cProps?.children?.map((itemChildren) => (
                                  <SideBarText {...itemChildren} />
                                ))}
                              </Box>
                            )}
                        </Box>
                      ),
                    };
                  }),
                }}
              >
                <SideBarHideTriggerButton />
              </Dropdown>
            )}
          </>
        ) : (
          <>
            {props?.children?.length > 0 ? (
              <Box
                href={props.href || ""}
                key={`sidebar-link-${key}`}
                className="cursor-pointer"
                onClick={() => dispatch(setSideBarRoot(props?.root))}
              >
                <Button
                  boxSize="initial"
                  justifyContent="flex-start"
                  alignItems="center"
                  bg={"transparent"}
                  mb={{
                    xl: "5px",
                  }}
                  mx={{
                    xl: "auto",
                  }}
                  // ps={{
                  //   sm: "10px",
                  //   xl: "16px",
                  // }}
                  py="10px"
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
                    <Flex gap={3} alignItems="center">
                      <props.icon
                        color={
                          isActive || isRootActive ? activeColor : inactiveColor
                        }
                        size={20}
                      >
                        {props.icon}
                      </props.icon>
                      <Text
                        color={
                          isActive || isRootActive ? activeColor : inactiveColor
                        }
                        fontSize="sm"
                        margin={0}
                        lineHeight={1}
                        fontWeight="normal"
                        textTransform="uppercase"
                      >
                        {props.label}
                      </Text>
                    </Flex>
                    {props?.children?.length > 0 && (
                      <DropdownIcon
                        size={16}
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
                onClick={() => dispatch(setSideBarRoot(props?.root))}
              >
                <Button
                  boxSize="initial"
                  justifyContent="flex-start"
                  alignItems="center"
                  bg={"transparent"}
                  mb={{
                    xl: "5px",
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
                    <Flex gap={3} alignItems="center">
                      <props.icon
                        color={isActive ? activeColor : inactiveColor}
                        size={20}
                      >
                        {props.icon}
                      </props.icon>
                      <Text
                        color={isActive ? activeColor : inactiveColor}
                        fontSize="sm"
                        margin={0}
                        lineHeight={1}
                        fontWeight="normal"
                        textTransform="uppercase"
                      >
                        {props.label}
                      </Text>
                    </Flex>
                  </Flex>
                </Button>
              </Link>
            )}
          </>
        )}
        {!sideBarShowHide && props?.children?.length > 0 && (
          <SideBarCollapseContent {...props} />
        )}
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
            borderLeft={`1px solid rgba(120,120,120,.4)`}
            display="flex"
            flexDir="column"
            ml={4}
            pl={5}
            gap={5}
          >
            {props.children?.map((item, index) => {
              const isActive = activeRoute(item.href, item.root) === "active";
              const canAccess =
                homeData?.access &&
                checkMenuAccessMatrix(homeData?.access, item.permissions);
              const key2 = item?.label?.split(" ")?.join("");
              const DropdownIcon = menuCollapse[key2]
                ? IoChevronUp
                : IoChevronDown;

              if (!canAccess) return "";
              return (
                <>
                  <Box
                    py={2}
                    key={`sidebar-collapse-${index}`}
                    className={`flex flex-row items-center gap-2 justify-between ${item?.children?.length > 0 ? "cursor-pointer" : ""
                      }`}
                    onClick={() => {
                      if ((item?.children || []).length > 0) {
                        setMenuCollapse((prev) => ({
                          ...prev,
                          [key2]: !(menuCollapse[key2] || false),
                        }));
                      }
                    }}
                  >
                    <Link
                      href={item.href || ""}
                      key={item.label.split(" ").join()}
                      onClick={() => dispatch(setSideBarRoot(props?.root))}
                    >
                      <Text
                        color={isActive ? activeColor : inactiveColor}
                        fontSize="sm"
                        margin={0}
                        lineHeight={1}
                        fontWeight="normal"
                      >
                        {item.label}
                      </Text>
                    </Link>
                    {item?.children?.length > 0 && (
                      <DropdownIcon size={16} color={inactiveColor} />
                    )}
                  </Box>
                  {!sideBarShowHide &&
                    menuCollapse[key2] &&
                    item?.children?.length > 0 &&
                    item?.children?.map((itemChildren) => (
                      <SideBarText {...itemChildren} />
                    ))}
                </>
              );
            })}
          </Box>
        </Box>
      </Collapse>
    );
  };

  const SideBarText = (props) => {
    const canAccess =
      homeData?.access &&
      checkMenuAccessMatrix(homeData?.access, props.permissions);
    if (!canAccess) return <span />;

    const isActive = activeRoute(props.href, props.root) === "active";
    const textColor = isActive ? activeColor : inactiveColor;

    return (
      <Box
        className={`flex flex-row items-center gap-2 ${sideBarShowHide ? "mt-2 pl-2 pb-2" : ""
          }`}
      >
        <BsChevronRight color={textColor} size={10} />
        <Link
          href={props?.href || ""}
          key={props?.label.split(" ").join()}
          onClick={() => dispatch(setSideBarRoot(props?.root))}
        >
          <Text
            color={textColor}
            fontSize="xs"
            margin={0}
            lineHeight={1}
            fontWeight="normal"
          >
            {props?.label}
          </Text>
        </Link>
      </Box>
    );
  };

  const links = <>{createLinks(routes)}</>;

  return (
    <div className="flex flex-col h-full">
      <Box 
        pt={"5px"}
        mb="10px"
        ps={sideBarShowHide ? "0" : paddingStartEnd}
        pe={sideBarShowHide ? "0" : paddingStartEnd}
      >
        {sideBarShowHide ? (
          <Flex h={"74px"} flexDir={"column"} justifyContent={"center"} alignItems="center">
            <Link
              href={"/dashboard"}
              mb="30px"
              fontWeight="bold"
              fontSize="11px"
            >
                <Image
            src={LogoImage}
            width={120}
            style={{
              objectFit: "contain",
              alignSelf: "center",
              paddingLeft:'2px',
              paddingRight:'2px',
              // paddingBottom: "8px",
              paddingTop: "2px",
            }}
            alt={"Convoy (Malaysia) Sdn Bhd"}
          />
              {/* <IoLogoGithub size={45} color="white" /> */}
            </Link>
          </Flex>
        ) : (
          <Flex justifyContent={"center"} w={"100%"}>
            <Link
              href={"/dashboard"}
              // mb="30px"
              fontWeight="bold"
              fontSize="11px"
            >
              <Flex direction={"column"} >
                {/* <IconButton
                  variant="unstyled"
                  aria-label="Company Logo"
                  size="lg"
                  color="white"
                  icon={<IoLogoGithub size={40} />}
                /> */}
                <Image
            src={LogoImage}
            width={120}
            style={{
              objectFit: "contain",
              alignSelf: "center",
              // paddingBottom: "8px",
              paddingTop: "2px",
            }}
            alt={"Convoy (Malaysia) Sdn Bhd"}
          />
                <Text fontSize="lg" color="#fff" alignSelf={"center"}>
                  {logoText}
                </Text>
              </Flex>
            </Link>
          </Flex>
        )}
      </Box>
      <Separator></Separator>
      <Stack direction="column" overflow="auto">
        <Box className="">{links}</Box>
      </Stack>
      {/* <SidebarHelp /> */}
    </div>
  );
};

export default SidebarContent;
