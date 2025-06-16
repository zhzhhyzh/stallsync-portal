import Colors from "@app/constants/Colors";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import {
  closeGlobalModal,
  selectGlobalModal,
  selectGlobalModalActions,
  selectGlobalModalMessage,
  selectGlobalModalStatus,
  selectGlobalModalTitle,
} from "@app/redux/app/slice";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoInformationCircle,
  IoWarning,
} from "react-icons/io5";
import Buttons from "../common/Buttons/Buttons";

type DefaultProps = {
  // title: String;
  // message: String;
  // status?: "info" | "warning" | "success" | "error";
};

export default function ModalDialog({ }: //   title,
  //   message,
  //   status = "info",
  DefaultProps) {
  const cancelRef = useRef();

  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectGlobalModal);
  const modalTitle = useAppSelector(selectGlobalModalTitle);
  const modalMessage = useAppSelector(selectGlobalModalMessage);
  const modalStatus = useAppSelector(selectGlobalModalStatus);
  const modalActions = useAppSelector(selectGlobalModalActions);

  function onClose() {
    dispatch(closeGlobalModal());
  }
  return (
    <AlertDialog
      motionPreset="slideInBottom"
      // @ts-ignore
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      size={{ base: "xs", sm: "sm", md: "lg" }}
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>{modalTitle}</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          <div className="flex flex-col items-center">
            {modalStatus === "info" && (
              <IoInformationCircle color={Colors.INFO} size={150} />
            )}
            {modalStatus === "success" && (
              <IoCheckmarkCircle color={Colors.SUCCESS2} size={150} />
            )}
            {modalStatus === "warning" && (
              <IoWarning color={Colors.WARNING} size={150} />
            )}
            {modalStatus === "error" && (
              <IoCloseCircle color={Colors.DANGER} size={150} />
            )}
            <Text textAlign={"center"}>
              {modalMessage}
            </Text>
          </div>
        </AlertDialogBody>
        <AlertDialogFooter display={"flex"} justifyContent={"center"}>
          {
            modalActions.length === 0 ? (
              // <Button
              //   onClick={onClose}
              //   style={{
              //     minHeight: "auto",
              //     minWidth: 80,
              //   }}
              // >
              //   Ok
              // </Button>
              <Buttons buttonDefaultType={"OK"} onclick={onClose} style={{
                minHeight: "auto",
                minWidth: 80,
              }}/>
            ) : (
              <div className="flex flex-row flex-wrap gap-2">
                {
                  modalActions.map((action) => {
                    //if(action?.title === )
                    return (
                      // <Button
                      //   onClick={action?.isClose ? onClose : action?.onClick}
                      //   style={{
                      //     minHeight: "auto",
                      //     minWidth: 80,
                      //   }}
                      //   {...action?.props}
                      // >
                      //   {action?.title}
                      // </Button>
                      <Buttons 
                        buttonDefaultType={action?.title !== "" ? action.title.toUpperCase() : "CUSTOM"}
                        onClick={action?.isClose ? onClose : action?.onClick}
                        style={{
                          minHeight: "auto",
                          minWidth: 80,
                        }}
                        buttonText={action?.title}
                        {...action?.props} />
                    )
                  })
                }
              </div>
            )
          }
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
