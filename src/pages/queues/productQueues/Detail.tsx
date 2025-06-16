
import ProductWorkgroupForm from "@app/components/forms/ProductWorkgroup/ProductWorkgroupForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id); //workgroup code 
  const mode = String(router.query?.mode);
  const prquecod = String(router.query?.prquecod);
  const prquedesc = String(router.query?.prquedesc);

  // const prprodcd = String(router.query?.prprodcd);

  // console.log("workgroup code", id)
  console.log("mode", mode) //LINK


  return (
    <>
      {/* {id && id !== "undefined" && (
        ) 
      } */}
      <ProductWorkgroupForm prquecod={prquecod}  mode={mode} prquedesc={prquedesc}/>
      
    </>
  );
}
