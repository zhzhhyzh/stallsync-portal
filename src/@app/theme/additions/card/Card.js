import Spacing from "@app/constants/Spacing";
import { defineStyleConfig } from "@chakra-ui/react";

const Card = defineStyleConfig({
  baseStyle: {
    p: Spacing.gap,
    display: "flex",
    flexDirection: "column",
    width: "100%",
    position: "relative",
    minWidth: "0px",
    wordWrap: "break-word",
    backgroundClip: "border-box",
    //weird bug???, variant panel not working, OMG
    bg: "white",
    width: "100%",
    boxShadow: "0px 3.5px 5.5px rgba(0, 0, 0, 0.02)",
    borderRadius: "15px",
  },
  variants: {
    panel: (props) => ({
      bg: props.colorMode === "dark" ? "gray.700" : "white",
      width: "100%",
      boxShadow: "0px 3.5px 5.5px rgba(0, 0, 0, 0.02)",
      borderRadius: "15px",
    }),
  },
  defaultProps: {
    variant: "panel",
  },
});

export const CardComponent = {
  components: {
    Card,
  },
};
