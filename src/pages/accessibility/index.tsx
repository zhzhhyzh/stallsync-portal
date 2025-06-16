import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import Card from "@app/components/common/Card/Card";
import Accessibility from "@app/components/pages/accessibility/Accessibility";
import Spacing from "@app/constants/Spacing";
import {
  Flex, Text,
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";

export default function AccessibilityForm() {
  return (
    <>
      <Flex direction={"column"} alignSelf={"center"} pl={Spacing.gap} py={Spacing.gap}>
        <Text fontSize={"3xl"} fontWeight="500" mb={1}>
          Accessibility
        </Text>
        <Breadcrumbs breadcrumbItems={[
          {
            title: "Accessibility",
          },
        ]} />
      </Flex>
      <Card overflow={'hidden'}>
        <Accessibility />
      </Card>
    </>
  );
}
