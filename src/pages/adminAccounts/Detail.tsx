import AdminAccountsForm from "@app/components/forms/AdminAccount/AdminAccountForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const mode = String(router.query?.mode);

  return (
    <>
      {id && id !== "undefined" ? (
        <AdminAccountsForm id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <AdminAccountsForm id={null} mode={mode} />
      )}
    </>
  );
}