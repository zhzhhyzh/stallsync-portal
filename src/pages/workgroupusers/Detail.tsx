// import WorkgroupForm from "@app/components/forms/Workgroup/WorkgroupForm";

import WorkgroupUserForm from "@app/components/forms/WorkgroupUser/WorkgroupUserForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id); //workgroup code
  const mode = String(router.query?.mode);

  console.log("workgroup code", id)
  console.log("mode", mode)


  return (
    <>
      {id && id !== "undefined" && (
        <WorkgroupUserForm id={id} mode={mode} />
      ) 
    }
    </>
  );
}
