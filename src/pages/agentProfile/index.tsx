// import FunctionForm from "@app/components/forms/Functions/FunctionForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import MemberNavigation from "@app/components/forms/Member/MemberNavigation";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import useFetchMemberProfile from "@app/hooks/selector/useFetchAgentProfile";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const mode = String(router.query?.mode);
  const [detailData, onInit, loading2, reset] = useFetchMemberProfile(
    {}
  );
  return (
    <>
    
          <MemberNavigation profile={detailData} breadcrumbs={<Breadcrumbs breadcrumbItems={[
                        {
                            title: "Agent Profile",
                        },
                    
                    ]}
                    />} id={null} mode={mode} />
    </>
  );
}
