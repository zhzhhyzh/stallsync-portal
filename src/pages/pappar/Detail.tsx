import PapparForm from "@app/components/forms/pappar/papparForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const mode = String(router.query?.mode);

  return (
    <>
      {id && id !== "undefined" ? (
        <PapparForm id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <PapparForm id={null} mode={mode} />
      )}
    </>
  );
}
