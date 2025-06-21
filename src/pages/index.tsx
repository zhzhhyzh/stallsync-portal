import { PlusSquareIcon } from "@chakra-ui/icons";
import { Box, Flex, Text, useBoolean } from "@chakra-ui/react";
import { IoAddOutline, IoRemoveOutline } from "react-icons/io5";

import { useState } from "react";
import Colors from "@app/constants/Colors";
import SignInForm from "@app/components/forms/SignInForm";
import Card from "@app/components/common/Card/Card";
import SignUpForm from "@app/components/forms/SignUpForm";
import Image from "next/image";
import LogoImage from "@app/assets/img/logo-rmbg.png";
import BackgroundImage from "@app/assets/img/background_image.png";
export default function Root() {
  const [isSignUp, setIsSignUp] = useBoolean()

  return (
    <Box
      minHeight="100%"
      minWidth="100%"
      display="flex"
      // justifyContent={"center"}
      // alignItems={"center"}
      mt={-91}
      w={"100vw"}
      h={"100vh"}
      ml={"-20px"}
      bg="#fff"
    // pt={4}
    >
      {/* <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={0}> */}
      {/* <Text textAlign='center' fontSize='4xl' my={8}>Limau</Text> */}
      <Flex
        flexDir={{
          base: "column",
          lg: "row",
        }}
        h="100vh"
        w="100vw"
      >
        {/* <Flex
        //flexDir={"column"}
        w={"100%"}
        //alignSelf={"center"}
      >
        <img
          src={BackgroundImage.src}
          alt="background-img"
          //width={500}
          //style={{ objectFit: "contain" }}
          className="w-auto h-screen"
        />
      </Flex> */}

        <Card
          p={8}
          justifyContent={"center"}
          style={{
            borderRadius: 0,
          }}
          shadow="none"
          backgroundImage={BackgroundImage.src}
          backgroundRepeat="no-repeat"
          backgroundSize="cover"
          filter='grayscale(30%)'
        >
          <Flex bgColor={"white"} flexDir={"column"} alignItems={"center"} w={"400px"} alignSelf={"center"} pb={10} px={5} borderRadius={30}>
            <Image
              src={LogoImage}
              width={240}
              style={{
                objectFit: "contain",
                alignSelf: "center",
                paddingBottom: "8px",
                paddingTop: "2px",
              }}
              alt={"StallSync"}
            />
            <Text fontSize="md" pb={"12px"} fontWeight={"normal"}>StallSync: Intelligent Managment</Text>
            <Text fontSize="4xl" pb={"30px"} fontWeight={"semibold"}>StallSync Portal</Text>
            {!isSignUp && <SignInForm toggleForm={setIsSignUp.toggle} />}
            {isSignUp && <SignUpForm toggleForm={setIsSignUp.toggle} />}
            <Text
              textAlign={"center"}
              fontSize={"xs"}
              px={3}
              pt={10}
              fontWeight={"semiBold"}
            >
              Powered by ZheHeng Y. & WaiKit L.
            </Text>
          </Flex>
        </Card>
      </Flex>
    </Box>
  );
}
