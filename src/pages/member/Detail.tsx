// import FunctionForm from "@app/components/forms/Functions/FunctionForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import MemberNavigation from "@app/components/forms/Member/MemberNavigation";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const mode = String(router.query?.mode);

  return (
    <>
      {id && id !== "undefined" ? (
        <MemberNavigation id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <MemberNavigation id={null} mode={mode} />
      )}
    </>
  );
}
