// import FunctionForm from "@app/components/forms/Functions/FunctionForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Form from "@app/components/forms/announcement/Form";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const mode = String(router.query?.mode);


  return (
    <>
      {id && id !== "undefined" ? (
        <Form id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
        <Form id={null} mode={mode} />
      )}
    </>
  );
}
