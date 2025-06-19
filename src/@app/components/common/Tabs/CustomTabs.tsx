import { FormLabel, FormLabelProps, Stack, Tab, TabProps } from '@chakra-ui/react';
import React from 'react';
import Spacing from "@app/constants/Spacing";

export default function CustomTabs(props: CustomTabsDefaultProps) {

  const { 
    index,label,selectedTabIndex,...rest
  } = props;
  
  return (
  
      <Tab
        key={`promo-tab-${index}`}
        py={3}
        whiteSpace="nowrap"
        ml={{
          base: 0,
          md: Spacing.containerPx,
        }}
        fontWeight={selectedTabIndex === index ? "medium" : "normal"}
        color={selectedTabIndex === index ? "yellow.600" : "gray"} 
        paddingBottom="3px"
        borderBottomWidth={2}
        {...rest}
      >
        {label}
      </Tab>
    );
};

type CustomTabsDefaultProps = TabProps & {
  index?: number | undefined;
  selectedTabIndex?: number | undefined;
  label?: string | undefined;

};
