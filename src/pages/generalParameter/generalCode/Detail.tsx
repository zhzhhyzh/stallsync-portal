import GeneralCodeForm from "@app/components/forms/GeneralParameter/GeneralCodeForm";
import { useRouter } from "next/router";
import React, { useEffect} from "react";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const mode = String(router.query?.mode);
  const gentypcode = String(router.query?.prgtycde);
  const genCode = String(router.query?.genCode);


  return (
    <>
      {id && id !== "undefined" ? (
        <GeneralCodeForm id={id} mode={mode} genCode={genCode} />
      ) : (
        mode && mode === "ADD" && gentypcode && gentypcode !== "undefined" &&
          <GeneralCodeForm id={null} mode={mode} genTypCode={gentypcode} />
      )}
    </>
  );
}