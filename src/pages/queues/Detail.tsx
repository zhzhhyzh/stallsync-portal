import QueueForm from "@app/components/forms/queue/QueueForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const mode = String(router.query?.mode);

  return (
    <>
      {id && id !== "undefined" ? (
        <QueueForm id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <QueueForm id={null} mode={mode} />
      )}
    </>
  );
}
