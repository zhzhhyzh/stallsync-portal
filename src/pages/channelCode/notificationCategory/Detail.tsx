import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import NotificationCategoryForm from "@app/components/forms/ChannelCode/NotificationCategoryForm";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const pschncde = String(router.query?.pschncde);
  const mode = String(router.query?.mode);

//   return (
//     <>
//       {(
//         mode && mode === "ADD" &&
//           <NotificationCategoryForm id={null} pschncde={pschncde} mode={mode} />
//       )}
//     </>
//   );

  return (
    <>
      {id && id !== "undefined" ? (
        <NotificationCategoryForm id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <NotificationCategoryForm id={null} pschncde={pschncde} mode={mode} />
      )}
    </>
  );
}