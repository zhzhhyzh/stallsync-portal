import React, { useEffect } from "react";
import androidPreview from "@app/assets/img/android-preview.png";
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
import { convertWhatsappText } from "@app/helpers/commonHelper";
import { FaWhatsappSquare } from "react-icons/fa";

const NotPreviewAndroid = ({ formik }: any) => {
  const [show, setShow] = React.useState(false);
  const [accordian, setAccordian] = React.useState(0);
  const [formattedMessage, setFormattedMessage] = React.useState("");

  useEffect(() => {
    if (formik.values.psnotchn === "WA") {

      let res4 = convertWhatsappText(formik.values.psmsgbdy) 
   
      let whatsapp =  document.getElementById("whatsapp")
      if (whatsapp) whatsapp.innerHTML = res4
      let whatsapp2 =  document.getElementById("whatsapp2")
      if (whatsapp2) whatsapp2.innerHTML = res4

    }
  }, [formik.values.psnotchn, formik.values.psmsgbdy,accordian])

  const handleToggle = () => setShow(!show);

  return (
    <Box
      bg={`url(${androidPreview.src})`}
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
        onChange={(val)=>setAccordian(parseInt(val.toString()))}
          style={{
            borderRadius: 20,
            boxShadow: "0px  #000000",
            marginLeft: 14,
            marginRight: 14,
            backgroundColor: "white",
          }}
          allowToggle
        >
          <AccordionItem p={0} style={{ borderRadius: 20 }}>
            {({ isExpanded }) => (
              <>
                <h2>
                  <AccordionButton  style={{ borderRadius: 20 }}>

                  {formik.values.psnotchn==="WA"?<FaWhatsappSquare style={{height:'30px',width:'30px',}}/>

:<BellIcon style={{ marginRight: 5 }} />}                    {!isExpanded ? (
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
                          <Text fontSize={"xs"} fontWeight={"bold"}>{formik.values.psmsgttl}</Text>{" "}
                          <>
                            <small>
                              <ul style={{ listStyleType: "disc", fontSize: "7pt" }}>
                                <li style={{ display: "inline-block" }}>
                                  Test App
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
                          <Text id="whatsapp2" fontSize={"xs"}>{formik.values.psnotchn === "WA" ? "" : formik.values.psmsgbdy}</Text>
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
                          <Container
                            style={{
                              flexDirection: "row",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <h1>Test App</h1>{" "}
                            <ul style={{ listStyleType: "disc", fontSize: "7pt" }}>
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
                  <h1>
                    <strong>{formik.values.psmsgttl}</strong>
                  </h1>
                  <h1 id="whatsapp">{formik.values.psnotchn === "WA" ? "" : formik.values.psmsgbdy}</h1>
                  {formik.values.imageSrc && formik.values.imageSrc !== "" && (
                    <img
                      alt="notification"
                      style={{ height: 128, width: "100%" }}
                      src={formik.values.imageSrc}
                    />
                  )}
                  <Button size={"xs"} backgroundColor={"rgba(0,0,0,0)"}>Reply</Button>
                  <Button size={"xs"} backgroundColor={"rgba(0,0,0,0)"}>Ignore</Button>
                  <Button size={"xs"} backgroundColor={"rgba(0,0,0,0)"}>Cancel</Button>
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        </Accordion>
      </>
    </Box>
  );
};

export default NotPreviewAndroid;
