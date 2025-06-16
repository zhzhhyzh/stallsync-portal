import ProdFeeForm from "@app/components/forms/Product/ProdFeeForm";
import { useRouter } from "next/router";
import React, { useEffect} from "react";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const mode = String(router.query?.mode);
  const psprddsc = String(router.query?.psprddsc);
  const psprdcod = String(router.query?.psprdcod);


  return (
    <>
      {id && id !== "undefined" ? (
        <ProdFeeForm id={id} mode={mode} psprddsc={psprddsc} psprdcod={psprdcod} />
      ) : (
        mode && mode === "ADD" && psprdcod && psprdcod !== "undefined" &&
          <ProdFeeForm id={null} mode={mode}  psprddsc={psprddsc} psprdcod={psprdcod} />
      )}
    </>
  );
}