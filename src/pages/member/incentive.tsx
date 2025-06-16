// import FunctionForm from "@app/components/forms/Functions/FunctionForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Incentive from "@app/components/forms/Member/Incentive";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const mode = String(router.query?.mode);

  return (
    <>
      {id && id !== "undefined" ? (
        <Incentive id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <Incentive id={null} mode={mode} />
      )}
    </>
  );
}
