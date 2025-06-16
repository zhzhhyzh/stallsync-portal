import { FormLabel, FormLabelProps, Stack } from '@chakra-ui/react';
import React from 'react';

export default function CustomFormLabel(props: FormLabelDefaultProps) {

  const { 
    labelText,
  } = props;
  
  const text = labelText || "";
  return (
    <Stack spacing={4} alignItems="start" padding={0}>
        <FormLabel>
        {text}
        <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
        </FormLabel>

    </Stack>
  );
};

type FormLabelDefaultProps = FormLabelProps & {
  labelText?: string | undefined;
};
