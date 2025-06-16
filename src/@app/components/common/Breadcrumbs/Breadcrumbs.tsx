import { Breadcrumb, BreadcrumbItem,  Text } from "@chakra-ui/react";
import React, { useRef, useState, useEffect } from "react";

import { useRouter } from "next/router";

import Colors from "@app/constants/Colors";
import { RiHome5Fill } from "react-icons/ri";
import { BREADCRUMBS_TYPES } from "@app/interfaces/breadcrumbs.types";
import Link from "next/link";
export default function Breadcrumbs(props: BreadcrumbsProps) {
  const router = useRouter();
  // const { 
  //   ...rest
  //   } = props;


  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem key={`breadcrumb-0`}>
          <Link href="/dashboard">
            <RiHome5Fill className=" text-gray-400" fontSize={14} />
          </Link>
        </BreadcrumbItem>
        {
          props.breadcrumbItems && props.breadcrumbItems.map((item: BREADCRUMBS_TYPES, index: number) => (
            item.href ? (
              <BreadcrumbItem key={`breadcrumb-${index}`}>
                <Link href={item.href} >
                  <Text fontSize={"xs"} color={"blue"}>{item.title}</Text>
                </Link>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem key={`breadcrumb-${index}`}>
                <Text fontSize={"xs"}>{item.title}</Text>
              </BreadcrumbItem>
            )
          ))
        }
      </Breadcrumb>
    </>
  );
}

type BreadcrumbsProps = {
  breadcrumbItems: BREADCRUMBS_TYPES[];
};
