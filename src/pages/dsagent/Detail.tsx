import DsagentForm from "@app/components/forms/dsagent/DsagentForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const mode = String(router.query?.mode);

  return (
    <>
      {
        id && id !== "undefined" ? (
          <DsagentForm id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <DsagentForm id={null} mode={mode} />
      )}
    </>
  );
}
