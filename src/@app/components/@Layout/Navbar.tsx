import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Link,
  Container,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { menus } from "@app/routes/menus";
//import UserSession from "../header/UserSession";
import { IoLogOutOutline } from "react-icons/io5";
import { logout, selectIsLogined } from "@app/redux/app/slice";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { default as NextLink } from "next/link";
import { useRouter } from "next/router";

const NAV_ITEMS = menus;
export default function Navbar() {
  const dispatch = useAppDispatch();
  const { isOpen, onToggle } = useDisclosure();
  const router = useRouter();

  function onLogout() {
    dispatch(logout());
    router.replace("/");
  }

  const isLanding = ["", "/"].includes(router.pathname);

  return (
    <Flex
      bg={useColorModeValue("white", "gray.800")}
      color={useColorModeValue("gray.600", "white")}
      minH={"60px"}
      py={{ base: 4 }}
      px={{ base: 4 }}
      borderBottom={1}
      borderStyle={"solid"}
      borderColor={useColorModeValue("gray.200", "gray.900")}
    >
      <Container maxW="6xl">
        <Box>
          <Flex align={"center"} justifyContent={"space-between"}>
            <Flex flex={{}} justify={{ base: "center", md: "center" }}>
              <NextLink href={isLanding ? "/" : "/app"}>
                <Text
                  textAlign={useBreakpointValue({ base: "center", md: "left" })}
                  fontFamily={"heading"}
                  color={useColorModeValue("gray.800", "white")}
                >
                  <img
                    src="/images/logo-rmbg.png"
                    className="object-contain"
                    style={{ height: 40 }}
                  />
                  {/* <img
                    src="/images/logo_square.png"
                    className="object-contain block sm:hidden"
                    style={{ height: 45 }}
                  /> */}
                </Text>
              </NextLink>
            </Flex>
            <Flex justifyContent={"flex-end"} >
              {isLanding && (
                <Button
                  fontWeight={600}
                  onClick={() => router.push("/app")}
                  className="primary"
                  sx={{
                    minHeight: 30,
                    minWidth: 100,
                  }}
                  _hover={{
                    bg: "gray.100",
                  }}
                >
                  App
                </Button>
              )}
              
              {!isLanding && (
                <IconButton
                  onClick={onToggle}
                  icon={
                    isOpen ? (
                      <CloseIcon w={4} h={4} />
                    ) : (
                      <HamburgerIcon w={7} h={7} />
                    )
                  }
                  variant={"ghost"}
                  aria-label={"Toggle Navigation"}
                  color="#0E1766"
                  ml={{ base: 2, md: 3 }}
                />
              )}
            </Flex>
          </Flex>

          <Collapse in={isOpen} animateOpacity>
            <MobileNav onLogout={onLogout} onToggle={onToggle} />
          </Collapse>
        </Box>
      </Container>
    </Flex>
  );
}

// const DesktopNav = ({ onToggle }: { onToggle: () => void }) => {
//   const linkColor = useColorModeValue("gray.600", "gray.200");
//   const linkHoverColor = useColorModeValue("gray.800", "white");
//   const popoverContentBgColor = useColorModeValue("white", "gray.800");

//   return (
//     <Stack direction={"row"} spacing={4}>
//       {NAV_ITEMS.map((navItem) => (
//         <Box key={navItem.label}>
//           <Popover trigger={"hover"} placement={"bottom-start"}>
//             <PopoverTrigger>
//               <NextLink href={navItem.href ?? "#"}>
//                 <Link
//                   p={2}
//                   fontSize={"sm"}
//                   fontWeight={500}
//                   color={linkColor}
//                   _hover={{
//                     textDecoration: "none",
//                     color: linkHoverColor,
//                   }}
//                 >
//                   {navItem.label}
//                 </Link>
//               </NextLink>
//             </PopoverTrigger>

//             {navItem.children && (
//               <PopoverContent
//                 border={0}
//                 boxShadow={"xl"}
//                 bg={popoverContentBgColor}
//                 p={4}
//                 rounded={"xl"}
//                 minW={"sm"}
//               >
//                 <Stack>
//                   {navItem.children.map((child) => (
//                     <DesktopSubNav key={child.label} {...child} />
//                   ))}
//                 </Stack>
//               </PopoverContent>
//             )}
//           </Popover>
//         </Box>
//       ))}
//     </Stack>
//   );
// };

// const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
//   return (
//     <Link
//       href={href}
//       role={"group"}
//       display={"block"}
//       p={2}
//       rounded={"md"}
//       _hover={{ bg: useColorModeValue("pink.50", "gray.900") }}
//       as={NextLink}
//     >
//       <Stack direction={"row"} align={"center"}>
//         <Box>
//           <Text
//             transition={"all .3s ease"}
//             _groupHover={{ color: "pink.400" }}
//             fontWeight={500}
//           >
//             {label}
//           </Text>
//           <Text fontSize={"sm"}>{subLabel}</Text>
//         </Box>
//         <Flex
//           transition={"all .3s ease"}
//           transform={"translateX(-10px)"}
//           opacity={0}
//           _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
//           justify={"flex-end"}
//           align={"center"}
//           flex={1}
//         >
//           <Icon color={"pink.400"} w={5} h={5} as={ChevronRightIcon} />
//         </Flex>
//       </Stack>
//     </Link>
//   );
// };

const MobileNav = ({
  onLogout,
  onToggle,
}: {
  onLogout: () => void;
  onToggle: () => void;
}) => {
  const isLogined = useAppSelector(selectIsLogined);
  const grayColor = useColorModeValue("gray.600", "gray.200");

  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      // display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem:any) => (
        <MobileNavItem key={navItem.label} {...navItem} onToggle={onToggle} />
      ))}
      {isLogined && (
        <Stack
          flexDir={"row"}
          alignItems="center"
          gap={2}
          justifyContent="start"
          className="cursor-pointer"
        >
          <IoLogOutOutline
            className="text-red-500"
            onClick={() => {
              onToggle();
              onLogout();
            }}
          />
          <Text
            style={{ marginTop: 0 }}
            fontWeight={600}
            color={grayColor}
            onClick={() => {
              onToggle();
              onLogout();
            }}
          >
            Logout
          </Text>
        </Stack>
      )}
    </Stack>
  );
};

const MobileNavItem = ({
  label,
  children,
  href,
  onToggle: onToggleParent,
}: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <NextLink href={href ?? "#"} onClick={onToggleParent}>
        <Flex
          py={2}
          justify={"space-between"}
          align={"center"}
          _hover={{
            textDecoration: "none",
          }}
        >
          <Text
            fontWeight={600}
            color={useColorModeValue("gray.600", "gray.200")}
          >
            {label}
          </Text>
          {children && (
            <Icon
              as={ChevronDownIcon}
              transition={"all .25s ease-in-out"}
              transform={isOpen ? "rotate(180deg)" : ""}
              w={6}
              h={6}
            />
          )}
        </Flex>
      </NextLink>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <NextLink
                key={child.label}
                href={child.href || "#"}
                onClick={onToggleParent}
              >
                <Link>{child.label}</Link>
              </NextLink>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
  onToggle?: () => void;
}
