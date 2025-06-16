// import FunctionForm from "@app/components/forms/Functions/FunctionForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import MemberNavigation from "@app/components/forms/Member/MemberNavigation";
import RaiseRequestForm from "@app/components/forms/Member/RaiseRequestForm";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const mode = String(router.query?.mode);

  return (
    <>
     
        <RaiseRequestForm id={id} mode={mode} />
   
    </>
  );
}
