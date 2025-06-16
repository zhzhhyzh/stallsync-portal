import React from "react";
import webIosPreview from "@app/assets/img/ios-preview.png";
import {
  // PreviewImage,
  Button,
  Collapse,
  Container,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  AccordionIcon,
  Box,
  ButtonGroup,
} from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import Image from "next/image";
const NotPreviewWebIos = ({ formik }: any) => {
  const [show, setShow] = React.useState(false);

  const handleToggle = () => setShow(!show);

  return (
    <Box
      bg={`url(${webIosPreview.src})`}
      style={{
        width: "60%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "400px",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {" "}
      <>
        <Accordion
          style={{
            borderRadius: 20,
            boxShadow: "0px  #000000",
            marginLeft: 18,
            marginRight: 22,
            marginTop: 4,
            backgroundColor: "white",
          }}
          allowToggle
        >
          <AccordionItem style={{ borderRadius: 20 }}>
              <>
                <h2>
                  <AccordionButton
                    onClick={handleToggle}
                    style={{ borderRadius: 20 }}
                  >
                    <BellIcon style={{ marginRight: 5 }} />
                    <Box
                      as="span"
                      flex="1"
                      display={"flex"}
                      flexDirection={"column"}
                      textAlign="left"
                    >
                      <Container
                        style={{
                          flexDirection: "row",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <h1 style={{ fontSize: 12.5 }}>
                          {formik.values.psmsgttl}
                        </h1>{" "}
                        <>
                          <h1 style={{ fontSize: 12.5 }}>now</h1>
                        </>
                      </Container>
                      <Container
                        style={{
                          flexDirection: "row",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <h1 style={{ fontSize: 12.5 }}>
                          from {formik.values.psmsgurl}
                        </h1>
                      </Container>
                      <Container
                        style={{
                          flexDirection: "row",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <h1 style={{ fontSize: 12.5 }}>
                          {formik.values.psmsgbdy}
                        </h1>
                      </Container>
                    </Box>
                  </AccordionButton>
                </h2>
              </>
          </AccordionItem>
        </Accordion>
        <Box
          p={4}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button
            style={{
              minWidth: "200px",
              maxHeight: "30px",
              border: "0.5px solid rgba(60, 60, 60, 0.25)",
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}
            backgroundColor={"white"}
            color={"black"}
            fontWeight={"normal"}
            fontSize={"xs"}
            justifyContent={"flex-start"}
          >
            Reply
          </Button>
          <Button
            style={{
              //minWidth: "100%",
              minWidth: "200px",
              maxHeight: "30px",
              borderLeft: "0.5px solid rgba(60, 60, 60, 0.25)",
              borderRight: "0.5px solid rgba(60, 60, 60, 0.25)",
              borderRadius: 0,
            }}
            backgroundColor={"white"}
            color={"black"}
            fontWeight={"normal"}
            fontSize={"xs"}
            justifyContent={"flex-start"}
          >
            Ignore
          </Button>
          <Button
            style={{
              //minWidth: "100%",
              minWidth: "200px",
              maxHeight: "30px",
              border: "0.5px solid rgba(60, 60, 60, 0.25)",
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            }}
            backgroundColor={"white"}
            color={"black"}
            fontWeight={"normal"}
            fontSize={"xs"}
            justifyContent={"flex-start"}
          >
            Cancel
          </Button>
        </Box>
      </>
    </Box>
  );
};

export default NotPreviewWebIos;
