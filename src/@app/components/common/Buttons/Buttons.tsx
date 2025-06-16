import { Button, ButtonProps, ResponsiveValue  } from "@chakra-ui/react";
import React, { useRef, useState, useEffect } from "react";

import { useRouter } from "next/router";

import Colors from "@app/constants/Colors";
import { AiOutlineLeft } from "react-icons/ai";
import { IoAdd, IoSave } from "react-icons/io5";
import { LinkIcon } from "@chakra-ui/icons";

export default function Buttons(props: ButtonsDefaultProps) {
  const router = useRouter();
  const { 
    buttonDefaultType, 
    buttonType, 
    buttonText, 
    onclick, 
    buttonLeftIcon, 
    buttonColor, 
    buttonBorderColor, 
    buttonHoverBackgroundColor, 
    buttonHoverColor, 
    buttonSize, 
    buttonVariant, 
    buttonLoading, 
    buttonBorderRadius, 
    buttonFontWeight, 
    buttonBgColor,
    ...rest
    } = props;

  let color = buttonColor || undefined;
  let borderColor = buttonBorderColor || undefined;
  let hoverBackgroundColor = buttonHoverBackgroundColor || undefined;
  let hoverColor = buttonHoverColor || undefined;
  let size = buttonSize || undefined;
  let variant = buttonVariant || undefined;
  let borderRadius = buttonBorderRadius || undefined;
  let fontWeight = buttonFontWeight || undefined;
  let bgColor = buttonBgColor || undefined;
  let type = buttonType || "button";
  let leftIcon = buttonLeftIcon || undefined;
  let text = buttonText || "";

  switch(buttonDefaultType) {
    case "ADD":
      hoverBackgroundColor = Colors.SUCCESS3;
      variant = "primary";
      type = "button";  
      leftIcon = <IoAdd size={20}/>
      size = "sm";
      fontWeight = "normal";
      borderRadius = 3;
      bgColor = Colors.SUCCESS;
      text = "ADD";
      break;
    case "BACK":
      color = Colors.DANGER;
      borderColor = Colors.DANGER;
      hoverBackgroundColor = Colors.DANGER;
      hoverColor = Colors.BACKGROUND;
      variant = "outline";
      type = "button";
      leftIcon = <AiOutlineLeft />
      size = "sm";
      fontWeight = "normal";
      borderRadius = 3;
      text = "BACK";
      break;
    case "CLOSE":
      hoverBackgroundColor = Colors.DANGER2;
      variant = "danger";
      type = "button";
      size = "sm";
      fontWeight = "normal";
      borderRadius = 3;
      text = "CANCEL";
      break;  
    case "SAVE":
      hoverBackgroundColor = Colors.SUCCESS3;
      variant = "primary";
      type = "submit";
      leftIcon = <IoSave />
      size = "sm";
      fontWeight = "normal";
      borderRadius = 3;
      bgColor = Colors.SUCCESS;
      text = "SAVE";
      break;
    case "LINK":
      hoverBackgroundColor = Colors.SUCCESS3;
      variant = "primary";
      type = "submit";
      leftIcon = <LinkIcon />
      size = "sm";
      fontWeight = "normal";
      borderRadius = 3;
      bgColor = Colors.SUCCESS;
      text = "LINK";
      break;
    case "OK":
      hoverBackgroundColor = Colors.SUCCESS3;
      variant = "primary";
      type = "button";
      size = "sm";
      fontWeight = "normal";
      borderRadius = 3;
      bgColor = Colors.SUCCESS;
      text = "OK";
      break;
    case "CONFIRM":
      hoverBackgroundColor = Colors.SUCCESS2;
      variant = "primary";
      type = "button";
      size = "md";
      fontWeight = "normal";
      borderRadius = 3;
      bgColor = Colors.SUCCESS;
      text = "Confirm";
      break;
    case "CANCEL":
      hoverBackgroundColor = Colors.DANGER2;
      variant = "danger";
      type = "button";
      size = "md";
      fontWeight = "normal";
      borderRadius = 3;
      text = "Cancel";
      break;      
    default:
      size = buttonSize || "sm";
      variant = buttonVariant || "primary";
      borderRadius = buttonBorderRadius || 3;
      fontWeight = buttonFontWeight || "normal";
      text = buttonText || "";
  }

  return (
    <>
    {
      buttonDefaultType && (
        <Button
          size={size}
          color={color}
          bgColor={bgColor}
          borderColor={borderColor}
          borderRadius={borderRadius}
          fontWeight={fontWeight}
          leftIcon={leftIcon}
          variant={variant}
          type={type}
          onClick={onclick}
          isLoading={buttonLoading}
          sx={{ _hover: { backgroundColor: hoverBackgroundColor, color: hoverColor } }}
          {...rest}
        >
          {text}
        </Button>  
      )
    }
    </>
  );
}

type ButtonsDefaultProps = ButtonProps & {
  buttonDefaultType: "ADD" | "BACK" | "SAVE" | "OK" | "CONFIRM" | "CANCEL" | "CLOSE" | "CUSTOM" | "LINK";
  buttonColor?: any;
  buttonBorderColor?: any;
  buttonHoverBackgroundColor?: any;
  buttonHoverColor?: any;
  buttonLeftIcon?: React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined;
  buttonText?: string | undefined;
  onclick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  buttonSize?: ResponsiveValue<"sm" | "md" | "lg" | (string & {}) | "xs"> | undefined;
  buttonVariant?: ResponsiveValue<"link" | "outline" | (string & {}) | "ghost" | "solid" | "unstyled"> | undefined;
  buttonBorderRadius?: ResponsiveValue<number | "md" | "base" | (string & {}) | "sm" | "lg" | "xl" | "2xl" | "-moz-initial" | "inherit" | "initial" | "revert" | "revert-layer" | "unset" | "none" | "3xl" | "full"> | undefined;
  buttonLoading?: boolean | undefined;
  buttonBgColor?: any;
  buttonFontWeight?: ResponsiveValue<number | (string & {}) | "bold" | "black" | "normal" | "medium" | "thin" | "hairline" | "light" | "semibold" | "extrabold"> | undefined;
  buttonType?: "button" | "submit" | "reset" | undefined;
};