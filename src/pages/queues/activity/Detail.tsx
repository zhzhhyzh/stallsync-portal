import ActForm from "@app/components/forms/queue/ActForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const mode = String(router.query?.mode);
  const prquecde = String(router.query?.QueueID)
  const practcod = String(router.query?.actid)
  const prquedesc = String(router.query?.prquedesc)

  return (
    <>
      {id && id !== "undefined" ? (
        <ActForm id={id} mode={mode} practcod={practcod}  />
      ) : (
        mode && mode === "ADD" && prquecde && prquecde !== "undefined" &&
        <ActForm id={null} mode={mode} prquecde={prquecde} prquedesc={prquedesc} />
      )}
    </>
  );
}
