import React from "react";
import webAndroidPreview from "@app/assets/img/android-preview.png";
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
  Text,
} from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import Image from "next/image";
const NotPreviewWebAndroid = ({ formik }: any) => {
  const [show, setShow] = React.useState(false);

  const handleToggle = () => setShow(!show);

  return (
    <Box
      bg={`url(${webAndroidPreview.src})`}
      style={{
        width: "60%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "400px",
        //backgroundImage: "url(/android-preview.png)",
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
            marginLeft: 14,
            marginRight: 14,
            backgroundColor: "white",
          }}
          allowToggle
        >
          <AccordionItem style={{ borderRadius: 20 }}>
            {({ isExpanded }) => (
              <>
                <h2>
                  <AccordionButton style={{ borderRadius: 20 }}>
                    <BellIcon style={{ marginRight: 5 }} />
                    {!isExpanded ? (
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
                          <Text fontSize={"xs"} fontWeight={"bold"}>
                            {formik.values.psmsgttl}
                          </Text>{" "}
                          <>
                            <small>
                              <ul
                                style={{
                                  listStyleType: "disc",
                                  fontSize: "7pt",
                                }}
                              >
                                <li style={{ display: "inline-block" }}>
                                  {formik.values.psmsgurl}
                                </li>{" "}
                                <li style={{ display: "inline-block" }}>now</li>
                              </ul>
                            </small>
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
                          <Text fontSize={"xs"}>{formik.values.psmsgbdy}</Text>
                        </Container>
                      </Box>
                    ) : (
                      <Box
                        as="span"
                        flex="1"
                        display={"flex"}
                        flexDirection={"column"}
                        textAlign="left"
                      >
                        <small>
                          {" "}
                          <Container
                            style={{
                              flexDirection: "row",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <h1>{formik.values.psmsgurl}</h1>
                            <ul
                              style={{ listStyleType: "disc", fontSize: "7pt" }}
                            >
                              <li style={{ display: "inline-block" }}>now</li>
                            </ul>
                          </Container>
                        </small>
                      </Box>
                    )}

                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel p={4} px={8}>
                  <Text fontSize={"md"} fontWeight={"bold"}>
                    {formik.values.psmsgttl}
                  </Text>{" "}
                  <Text fontSize={"md"}>{formik.values.psmsgbdy}</Text>
                  {formik.values.imageSrc && formik.values.imageSrc !== "" && (
                    <img
                      style={{ height: 128, width: "100%" }}
                      src={formik.values.imageSrc}
                      alt="Notification"
                    />
                  )}
                  {/* // <Image
                //   alt="notification"
                //   width={100}
                //   height={100}
                //   src={'/About-Location-NY.jpg'} /> */}
                  {/* <Button backgroundColor={'rgba(0,0,0,0)'}>
                    Reply
                  </Button>
                  <Button backgroundColor={'rgba(0,0,0,0)'}>
                    Ignore
                  </Button>
                  <Button backgroundColor={'rgba(0,0,0,0)'}>
                    Cancel
                  </Button> */}
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        </Accordion>
      </>
    </Box>
  );
};

export default NotPreviewWebAndroid;
