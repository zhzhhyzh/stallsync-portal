import NotificationTemplateForm from "@app/components/forms/NotificationTemplate/NotificationTemplateForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const id2 = String(router.query?.id2);
  const mode = String(router.query?.mode);

  return (
    <>
      {id && id !== "undefined" ? (
        <NotificationTemplateForm id={id} id2={id2} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <NotificationTemplateForm id={null} mode={mode} />
      )}
    </>
  );
}