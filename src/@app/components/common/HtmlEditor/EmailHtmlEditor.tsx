// Chakra imports
import { IconButton } from "@chakra-ui/react";
import React, { useRef, useState, useEffect } from "react";

import EmailEditor from "react-email-editor";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";

import test from "./test.json";

export const htmlEditorExport = (editor: any, callback: (data: any) => any) => {
  return editor?.exportHtml(callback);
};

export const htmlEditorSaveDesign = (
  editor: any,
  callback: (data: any) => any
) => {
  return editor?.saveDesign(callback);
};

export const htmlEditorLoadDesign = (editor: any, design: any) => {
  return editor?.loadDesign(test);
};

export default function EmailHtmlEditor({
  height,
  designContent,
  formik,
}: {
  height?: number | string;
  designContent: any;
  formik: any;
}) {
  const emailEditorRef = useRef<any>(null);
  const [isReady, setReady] = useState(false);

  const onReady = () => {
    // editor is ready
    // you can load your template here;
      if (!isReady) {
        setReady(true);
        if (designContent && emailEditorRef?.current?.editor) {
          if (Object.keys(designContent).length !== 0) {
            emailEditorRef?.current?.editor?.loadDesign(designContent.design);
          }else{
            emailEditorRef?.current?.editor?.loadBlank();
            emailEditorRef?.current?.editor?.exportHtml((data: any) => {
              formik.setFieldValue("currentMsgbdy", data?.html);
              formik.setFieldValue("psmsgbdy", data?.html);
              formik.setFieldValue("psmsgobj", data);
            });
          }
        }
      }
  };

  useEffect(() => {
    if (isReady && emailEditorRef?.current) {

      emailEditorRef?.current?.editor?.addEventListener(
        "design:updated",
        function (data: any) {
          emailEditorRef?.current?.editor?.exportHtml((data: any) => {
            if(formik.values.forceLoad === false && data?.html !== formik.values.currentMsgbdy){
              formik.setFieldValue("isContentChanged", true);
            }else{
              formik.setFieldValue("isContentChanged", false);
            }
            
            formik.setFieldValue("psmsgbdy", data?.html);
            formik.setFieldValue("psmsgobj", data);
          });
        }
      );
      
      if (formik.values.forceLoad) {
        if (Object.keys(designContent).length !== 0) {
          if(emailEditorRef?.current?.editor){
            formik.setFieldValue("forceLoad", false);
            formik.setFieldValue("isContentChanged", false);
            emailEditorRef?.current?.editor?.loadDesign(designContent.design);
            emailEditorRef?.current?.editor?.exportHtml((data: any) => {
              formik.setFieldValue("currentMsgbdy", data?.html);
              formik.setFieldValue("psmsgbdy", data?.html);
              formik.setFieldValue("psmsgobj", data);
            });
          }
        }else{
          formik.setFieldValue("forceLoad", false);
          formik.setFieldValue("isContentChanged", false);
          emailEditorRef?.current?.editor?.loadBlank();
          emailEditorRef?.current?.editor?.exportHtml((data: any) => {
            formik.setFieldValue("currentMsgbdy", data?.html);
            formik.setFieldValue("psmsgbdy", data?.html);
            formik.setFieldValue("psmsgobj", data);
          });
        }
      }
    }
  }, [emailEditorRef, isReady, designContent]);

  const [fullscreen, setFullscreen] = useState(false);

  return (
    <>
      <EmailEditor
        ref={emailEditorRef}
        onReady={onReady}
        // options={{
        //   tools: {
        //     image: {
        //       enabled: false,
        //     },
        //     text: {
        //       enabled: false,
        //     },
        //     form: {
        //       enabled: false,
        //     },
        //     heading: {
        //       enabled: false,
        //     },
        //     button: {
        //       enabled: false,
        //     },
        //     divider: {
        //       enabled: false,
        //     },
        //     html: {
        //       enabled: false,
        //     },
        //     menu: {
        //       enabled: false,
        //     },
        //   },
        //   editor: {
        //     minRows: 0,
        //     maxRows: 0,
        //     autoSelectOnDrop: false,
        //   },
        //   tabs: {
        //     content: {
        //       active: false,
        //       enabled: false,
        //     },
        //     blocks: {
        //       active: false,
        //       enabled: false,
        //     },
        //     body: {
        //       active: false,
        //       enabled: false,
        //     },
        //   },
        //   features: {
        //     textEditor: {
        //       tables: false,
        //     },
        //   },
        //   appearance: {
        //     theme: "light",
        //     panels: {
        //       tools: {
        //         dock: "right",
        //         collapsible: false,
        //         tabs: {
        //           body: {
        //             visible: false,
        //           }
        //         },
        //       },
        //     },
        //     features: {
        //       preview: false,
        //     },
        //   },
        // }}
        style={{
          height: height || "auto",
          ...(fullscreen
            ? {
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                zIndex: 9999,
              }
            : {}),
        }}
      />
      <IconButton
        aria-label="fullscreen"
        onClick={() => setFullscreen(!fullscreen)}
        icon={
          fullscreen ? (
            <MdFullscreenExit size={25} />
          ) : (
            <MdFullscreen size={25} />
          )
        }
        style={{
          position: fullscreen ? "fixed" : "absolute",
          top: 25,
          left: 5,
          zIndex: fullscreen ? 10000 : "auto",
        }}
      />
    </>
  );
}
