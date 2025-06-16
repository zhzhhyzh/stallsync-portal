import React,{useEffect} from "react";
import iosPreview from "@app/assets/img/ios-preview.png";
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
  Text,
} from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import Image from "next/image";
import { convertWhatsappText } from "@app/helpers/commonHelper";
import { FaWhatsappSquare } from "react-icons/fa";

const NotPreviewIos = ({ formik }: any) => {
  const [show, setShow] = React.useState(false);
  const [accordian, setAccordian] = React.useState(0);

  const handleToggle = () => setShow(!show);
  useEffect(() => {
    if (formik.values.psnotchn === "WA") {

      let res4 = convertWhatsappText(formik.values.psmsgbdy) 
   
      let whatsapp =  document.getElementById("whatsapp")
      if (whatsapp) whatsapp.innerHTML = res4
      let whatsapp2 =  document.getElementById("whatsapp2")
      if (whatsapp2) whatsapp2.innerHTML = res4

    }
  }, [formik.values.psnotchn, formik.values.psmsgbdy,accordian])

  return (
    <Box
      bg={`url(${iosPreview.src})`}
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
            marginLeft: 18,
            marginRight: 22,
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
                    {formik.values.psnotchn==="WA"?<FaWhatsappSquare style={{height:'30px',width:'30px',}}/>

:<BellIcon style={{ marginRight: 5 }} />}
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
                        <Text fontSize={"xs"}>{formik.values.psmsgttl}</Text>{" "}
                        <Text fontSize={"xs"}>now</Text>
                      </Container>
                      <Container
                        style={{
                          flexDirection: "row",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text id="whatsapp" fontSize={"xs"}>{formik.values.psnotchn === "WA" ? "" : formik.values.psmsgbdy}</Text>
                        {formik.values.imageSrc &&
                          formik.values.imageSrc !== "" && (
                            <img
                              width="32"
                              height="32"
                              style={{ objectFit: "fill" }}
                              src={formik.values.imageSrc}
                              alt={"notification"}
                            />
                          )}
                      </Container>
                    </Box>
                  </AccordionButton>
                </h2>
              </>
          </AccordionItem>
        </Accordion>
        {show && (
          <Box
            p={4}
            h={"250px"}
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
        )}
      </>
    </Box>
  );
};

export default NotPreviewIos;
