import ActActForm from "@app/components/forms/queue/ActActForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const mode = String(router.query?.mode);
  const practcod = String(router.query?.practcod);
  const QueueID = String(router.query?.practcod);
  const actID = String(router.query?.actID)

  return (
    <>
      {id && id !== "undefined" ? (
        <ActActForm id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
        <ActActForm id={null} mode={mode} practcod={practcod} QueueID={QueueID} actID={actID} />
      )}
    </>
  );
}

