import { Text, Stack, TextProps } from '@chakra-ui/react';
import React from 'react';

export default function CustomText(props: CustomTextProps) {

  const { 
    labelText,
  } = props;
  
  const text = labelText || "";
  return (
    <Stack spacing={4} alignItems="start" padding={0}>
        <Text>
        {text}
        <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
        </Text>

    </Stack>
  );
};

type CustomTextProps = TextProps & {
  labelText?: string | undefined;
};