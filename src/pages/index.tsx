import { PlusSquareIcon } from "@chakra-ui/icons";
import { Box, Flex, Text, useBoolean } from "@chakra-ui/react";
import { IoAddOutline, IoRemoveOutline } from "react-icons/io5";
import { keyframes } from "@emotion/react";
import { useState, useEffect } from "react";
import Colors from "@app/constants/Colors";
import SignInForm from "@app/components/forms/SignInForm";
import Card from "@app/components/common/Card/Card";
import SignUpForm from "@app/components/forms/SignUpForm";
import Image from "next/image";
import LogoImage from "@app/assets/img/logo-rmbg.png";
import BackgroundImage from "@app/assets/img/background_image.png";

export default function Root() {
  const [isSignUp, setIsSignUp] = useBoolean()
  const fullText = "Powered by ZheHeng Y. & WaiKit L.";
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) {
        clearInterval(interval);
        setTimeout(() => setShowCursor(false), 1500); // cursor hides after delay
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

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

        <Box position="relative" w="100vw" h="100vh" overflow="hidden">
          {/* Render spiral background below everything */}
          <SpiralBackground />

          <Flex
            flexDir={{ base: "column", lg: "row" }}
            h="100%"
            w="100%"
            zIndex={2}
            position="relative"
          >

            <Card
              p={8}
              justifyContent={"center"}
              style={{
                borderRadius: 0,
              }}
              shadow="none"
              // backgroundImage={BackgroundImage.src}
              // backgroundRepeat="no-repeat"
              // backgroundSize="cover"
              bg='transparent'
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
                {/* <Text
                  textAlign={"center"}
                  fontSize={"xs"}
                  px={3}
                  pt={10}
                  fontWeight={"semiBold"}
                >
                  Powered by ZheHeng Y. & WaiKit L.
                </Text> */}
                <Text
                  textAlign={"center"}
                  fontSize={"xs"}
                  px={3}
                  pt={10}
                  fontWeight={"semiBold"}
                  fontFamily="monospace"
                >
                  {typedText}
                  <Box as="span" display="inline-block" w="1ch" animation="blink 1s step-end infinite">|</Box>
                </Text>

              </Flex>
            </Card>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}

const fadeAnimation = keyframes`
  0%, 100% { opacity: 0.15; }
  50% { opacity: 0.5; }
`;


function SpiralBackground() {
  const rows = 20;
  const cols = 20;
  const text = "StallSync";

  return (
    <Box
      position="absolute"
      top="0"
      left="0"
      width="100%"
      height="100%"
      overflow="hidden"
      zIndex={0}
      bg={Colors.SIDEBAR}
    >
      {[...Array(rows)].map((_, row) =>
        [...Array(cols)].map((_, col) => {
          const leftPercent = (col / cols * 1.5) * 100;
          const topPercent = (row / rows * 1.5) * 100;
          const delay = (row + col) * 0.2;

          return (
            <Text
              key={`${row}-${col}`}
              position="absolute"
              left={`${leftPercent}%`}
              top={`${topPercent}%`}
              fontSize="md"
              fontWeight="bold"
              color={Colors.PRIMARY}
              whiteSpace="nowrap"
              pointerEvents="none"
              sx={{
                textShadow: `
                  1px 1px 0px rgba(0, 0, 0, 0.1),
                  2px 2px 0px rgba(0, 0, 0, 0.1),
                  3px 3px 0px rgba(0, 0, 0, 0.05)
                `,
                transform: "translate(-50%, -50%) rotate(-20deg)",
                animation: `${fadeAnimation} 3s ease-in-out ${delay}s infinite`,
                opacity: 0.15,
              }}
            >
              {text}
            </Text>
          );
        })
      )}
    </Box>
  );
}


const blinkAnimation = keyframes`
  50% { opacity: 0; }
`;
