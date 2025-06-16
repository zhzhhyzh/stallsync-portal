import FunctionForm from "@app/components/forms/Functions/FunctionForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const mode = String(router.query?.mode);

  return (
    <>
      {id && id !== "undefined" ? (
        <FunctionForm id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <FunctionForm id={null} mode={mode} />
      )}
    </>
  );
}