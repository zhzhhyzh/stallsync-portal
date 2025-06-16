import React from "react";
import webMacosPreview from "@app/assets/svg/web-macos-preview.svg";
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
  Select,
} from "@chakra-ui/react";
import { AiFillChrome } from "react-icons/ai";
import { BellIcon } from "@chakra-ui/icons";
import { RxCrossCircled } from "react-icons/rx";
import { BsChevronRight } from "react-icons/bs";
import Image from "next/image";
const NotPreviewWebMacos = ({ formik }: any) => {
  const [show, setShow] = React.useState(false);
  const [hover, setHover] = React.useState(false);

  const handleToggle = () => setShow(!show);

  return (
    <Box
      bgImage={`url(${webMacosPreview.src})`}
      style={{
        width: "60%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        height: "300px",
        //backgroundImage: "url(/web-macos-preview.svg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {" "}
      <>
        <Container
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            width: "85%",
            borderColor: "#eeeeee",
            borderRadius: 20,
            borderWidth: 2,
            boxShadow:
              "rgba(0, 0, 0, 0.14) 0px 3px 13px 1px, rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px",
            marginTop: 50,
          }}
          display="flex"
          flexDirection="column"
          size="sm"
        >
          <RxCrossCircled
            size={15}
            style={{
              marginLeft: -20,
              position: "absolute",
              //left: 66,
              //top: 225,
              display: hover ? "initial" : "none",
            }}
          />
          <Container
            pr={0}
            display="flex"
            flexDirection="row"
            justifyContent="flex-end"
            size="sm"
          >
            <BsChevronRight
              onClick={handleToggle}
              size={13}
              style={{
                paddingTop: 3,
                color: hover || show ? "initial" : "rgba(0,0,0,0)",
                transform: show ? "rotate(90deg)" : "none",
              }}
            />
          </Container>
          <Collapse startingHeight={0} in={show}>
            {/* <Image/> */}
          </Collapse>
          <AiFillChrome style={{ marginBottom: 10 }} size={50} />
          <Container pl={0} display="flex" flexDirection="row" size="sm">
            <Container display="flex" flexDirection="column" pr={0}>
              <h1>
                <strong>{formik.values.prnotttl}</strong>
              </h1>
              <h1>
                <strong>{formik.values.prnoturl}</strong>
              </h1>
              <h1>{formik.values.prnotmsg}</h1>
            </Container>
            <Container
              pl={-1}
              maxWidth={20}
              display="flex"
              flexDirection="column"
              justifyContent="flex-end"
            >
              {hover && !show ? (
                <Select width={100} size="xs">
                  <option selected hidden disabled value="Options">
                    Options
                  </option>

                  <option value="option1">Reply</option>
                  <option value="option2">Ignore</option>
                  <option value="option3">Cancel</option>
                  <option value="option4">Settings</option>
                </Select>
              ) : (
                <></>
              )}
              {/* <Image/> */}
            </Container>
          </Container>
          <Collapse startingHeight={0} in={show}>
            <ButtonGroup
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* first button somehow out of alignment */}
              <Button
                style={{ display: "none" }}
                backgroundColor={"white"}
                color={"black"}
              ></Button>
              <Button
                style={{ minWidth: "100%" }}
                backgroundColor={"white"}
                color={"black"}
              >
                Reply
              </Button>
              <Button
                style={{
                  minWidth: "100%",
                  borderTop: "0.5px solid rgba(60, 60, 60, 0.25)",
                  borderBottom: "0.5px solid rgba(60, 60, 60, 0.25)",
                  borderRadius: 0,
                }}
                backgroundColor={"white"}
                color={"black"}
              >
                Ignore
              </Button>
              <Button
                style={{
                  minWidth: "100%",
                  borderBottom: "0.5px solid rgba(60, 60, 60, 0.25)",
                  borderRadius: 0,
                }}
                backgroundColor={"white"}
                color={"black"}
              >
                Cancel
              </Button>
              <Button
                style={{ minWidth: "100%" }}
                backgroundColor={"white"}
                color={"black"}
              >
                Settings
              </Button>
            </ButtonGroup>
          </Collapse>
        </Container>
      </>
    </Box>
  );
};

export default NotPreviewWebMacos;
