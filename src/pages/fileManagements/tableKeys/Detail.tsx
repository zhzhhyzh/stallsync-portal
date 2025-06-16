
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import TableKeyForm from "@app/components/forms/TableKey/TableKeyForm";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const mode = String(router.query?.mode);

  const pstblnme = String(router.query?.pstblnme);
  const pstbldsc = String(router.query?.pstbldsc);

  console.log("ID =>", id);
  console.log("MODE =>", mode);

  return (
    <>
      {id && id !== "undefined" ? (
        <TableKeyForm id={id} mode={mode} pstbldsc={pstbldsc} />
      ) : (
        mode && mode === "ADD" &&
          <TableKeyForm id={null} pstblnme={pstblnme} pstbldsc={pstbldsc} mode={mode} />
      )}
    </>
  );
}