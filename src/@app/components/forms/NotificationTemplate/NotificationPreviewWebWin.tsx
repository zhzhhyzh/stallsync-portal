import React from "react";
import webWindowPreview from "@app/assets/svg/web-windows-preview.svg";
import {
  // PreviewImage,
  Container,
  Button,
  Card,
  Flex,
  Avatar,
  Box,
  CardHeader,
  Heading,
  Text,
  ButtonGroup,
  IconButton,
  CardFooter,
  CardBody,
} from "@chakra-ui/react";
import { AiFillChrome } from "react-icons/ai";
import { GoKebabHorizontal } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";
import { BellIcon } from "@chakra-ui/icons";
import Image from "next/image";
const NotPreviewWebWin = ({ formik }: any) => {
  const [show, setShow] = React.useState(false);

  const handleToggle = () => setShow(!show);

  return (
    <Box
      bg={`url(${webWindowPreview.src})`}
      style={{
        width: "350px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        height: "430px",
        //backgroundImage: "url(/web-windows-preview.svg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "center"
      }}
    >
      <Card marginRight={2} marginBottom={10} width={"90%"} backgroundColor="#eeeeee" >
        <CardBody minWidth="100%" p={0}>
          <Container p={2} width={"100%"} display="flex" flexDirection="column">
            <Container
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Container
                display="flex"
                flexDirection="row"
                alignItems="center    "
              >
                <AiFillChrome style={{ marginRight: 5 }} />
                <Text fontSize={"sm"}>Google Chrome</Text>
              </Container>
              <Container
                display="flex"
                flexDirection="row"
                justifyContent={"flex-end"}
              >
                <GoKebabHorizontal style={{ marginRight: 10 }} />
                <RxCross2 />
              </Container>
            </Container>
            <Container display="flex" flexDirection="row">
              <Container display="flex" flexDirection="column">
                <h1>
                  <strong>{formik.values.psmsgttl}</strong>
                </h1>
                <h3 style={{ color: "#5d5a5a" }}>{formik.values.psmsgbdy}</h3>
                <small style={{ color: "#ababab" }}>
                  {formik.values.psmsgurl}
                </small>
              </Container>
            </Container>
          </Container>
        </CardBody>

        <CardFooter
          justify="space-between"
          flexWrap="wrap"
          sx={{
            "& > button": {
              minW: "136px",
            },
          }}
        >
        </CardFooter>
      </Card>
    </Box>
  );
};

export default NotPreviewWebWin;
