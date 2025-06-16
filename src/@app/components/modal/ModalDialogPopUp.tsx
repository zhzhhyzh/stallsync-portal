import Colors from "@app/constants/Colors";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ResponsiveValue,
} from "@chakra-ui/react";
import Buttons from "../common/Buttons/Buttons";

type DefaultProps = {
  isOpen: boolean;
  onClose: any;
  children: React.ReactNode;
  size?:
    | ResponsiveValue<
        | (string & {})
        | "sm"
        | "md"
        | "lg"
        | "xl"
        | "2xl"
        | "xs"
        | "3xl"
        | "4xl"
        | "5xl"
        | "6xl"
        | "full"
      >
    | undefined;
  header?: string;
  footerClose?: boolean;
  footerCloseText?: string;
};

export default function ModalDialog({
  isOpen,
  onClose,
  children,
  size,
  header,
  footerClose,
  footerCloseText,
}: DefaultProps) {
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered size={size || "md"}>
      <ModalOverlay />
      <ModalContent bg={Colors.BACKGROUND} pb={4}>
        {header && header !== "" && <ModalHeader>{header}</ModalHeader>}
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        {footerClose && (
          <ModalFooter>
            <Buttons
              variant={"outline"}
              borderColor={Colors.SUCCESS}
              color={Colors.SUCCESS}
              buttonText={footerCloseText || "Close"}
              style={{ alignSelf: "center" }}
              buttonDefaultType="CUSTOM"
              buttonHoverBackgroundColor={Colors.SUCCESS3}
              buttonHoverColor={Colors.BACKGROUND}
              onClick={onClose}
            />
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
