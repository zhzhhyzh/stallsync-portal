import React, { useEffect } from "react";
import whatsappPreview from "@app/assets/img/whatsapp-preview.png";
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
import { convertWhatsappText, formatFileSize } from "@app/helpers/commonHelper";
import styles from './chatBubble.module.css'

const NotPreviewWhatsapp = ({ formik, selectedPushFile }: any) => {
  const [show, setShow] = React.useState(false);

  const handleToggle = () => setShow(!show);
  useEffect(() => {
    if (formik.values.psnotchn === "WAP") {

      let res4 = convertWhatsappText(formik.values.pswapmsg)

      let whatsapp = document.getElementById("whatsapp")


      if (whatsapp) {
        if (res4) {

          whatsapp.innerHTML = res4
        } else {
          whatsapp.innerHTML = "&nbsp;"

        }

      }
      // let whatsapp2 =  document.getElementById("whatsapp2")
      // if (whatsapp2) whatsapp2.innerHTML = res4

    }
  }, [formik.values.psnotchn, formik.values.pswapmsg])

  return (
    <Box
      bg={`url(${whatsappPreview.src})`}
      style={{
        // backgroundColor:'black',
        width: "300px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "400px",
        //backgroundImage: "url(/android-preview.png)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left top",
        backgroundSize: "cover",
      }}
    >

      <div className={`${styles.talkBubble} ${styles.triRight} ${styles.leftTop}`}>
        <div className="talktext">
          {selectedPushFile.length > 0 && (/\.(jpg|jpeg|png|gif|bmp)$/.test(selectedPushFile[0].name) ?
            <img src={selectedPushFile[0]?.url} /> : <div style={{ marginBottom:5,backgroundColor: '#eceef0', borderRadius: 15, padding: 10, fontSize: 10, display:'flex',flexDirection:'row', alignItems:"center"}}><div style={{backgroundColor:"#d1172f", width:"30%", fontWeight:'900', fontSize:17,padding:'10% 0',color:'white', marginRight:10, borderRadius:10, textAlign:'center'}}>{selectedPushFile[0].name?.split('.')[selectedPushFile[0].name?.split('.').length-1].toUpperCase()}</div><div><p>{selectedPushFile[0].name}</p><p>{selectedPushFile[0].size?formatFileSize(selectedPushFile[0].size,2):""}</p></div></div>)}
          <Text id="whatsapp" style={{ position: "relative" ,zIndex: 50 }}></Text>
        </div></div>
    </Box>
  );
};

export default NotPreviewWhatsapp;
