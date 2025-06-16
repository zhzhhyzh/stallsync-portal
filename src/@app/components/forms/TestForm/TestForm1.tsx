// Chakra imports
import Colors from "@app/constants/Colors";
import {
    Box,
    Button,
    Card,
    CardHeader,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    PinInput,
    PinInputField,
    Radio,
    RadioGroup,
    Select,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Stack,
    Switch,
    Text,
} from "@chakra-ui/react";
// assets
import React, { useState } from "react";

import Spacing from "@app/constants/Spacing";
import { useFormik } from "formik";
import { TestSchema } from "@app/components/forms/@schemas/testSchema";
import { DatePicker } from "antd";

export default function TestForm1() {
    const formik = useFormik({
        initialValues: {
            input1: "",
            input2: "",
        },
        validationSchema: TestSchema,
        onSubmit: (values) => {
            onSubmit(values);
        },
    });

    function onSubmit(data: any) { }

    return (
        <form onSubmit={formik.handleSubmit}>
            <Box
                mt={`${Spacing.containerPx}`}
                className="flex flex-row justify-between"
            >
                <Text fontSize="2xl" fontWeight={"bold"}>
                    Title
                </Text>
                <Button variant="primary" type="submit">
                    Save
                </Button>
            </Box>
            <Box mt={`${Spacing.containerPx}`} className="flex flex-col md:flex-row gap-6">
                <Card p={4} width="100%">
                    <Text fontSize="lg" fontWeight={"bold"} mb={5}>
                        Title
                    </Text>
                    <div className="flex flex-col sm:flex-row gap-6">
                        <Box display="flex" flexDir="column" gap={6} width="100%">
                            <FormControl
                                id="input1"
                                isInvalid={Boolean(formik.errors.input1)}
                            >
                                <FormLabel>Input 1</FormLabel>
                                <Input
                                    placeholder={"Enter input 1"}
                                    type="text"
                                    name="input1"
                                    onChange={formik.handleChange}
                                    value={formik.values.input1}
                                />
                                {formik.errors.input1 && (
                                    <FormErrorMessage>{formik.errors.input1}</FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl
                                id="input2"
                                isInvalid={Boolean(formik.errors.input2)}
                            >
                                <FormLabel>Input 2</FormLabel>
                                <Input
                                    placeholder={"Enter input 2"}
                                    type="text"
                                    name="input2"
                                    onChange={formik.handleChange}
                                    value={formik.values.input2}
                                />
                                {formik.errors.input2 && (
                                    <FormErrorMessage>{formik.errors.input2}</FormErrorMessage>
                                )}
                            </FormControl>
                        </Box>
                        <Box display="flex" flexDir="column" gap={6} width="100%">
                            <FormControl
                                id="input1"
                                isInvalid={Boolean(formik.errors.input1)}
                            >
                                <FormLabel>Input 1</FormLabel>
                                <Input
                                    placeholder={"Enter input 1"}
                                    type="text"
                                    name="input1"
                                    onChange={formik.handleChange}
                                    value={formik.values.input1}
                                />
                                {formik.errors.input1 && (
                                    <FormErrorMessage>{formik.errors.input1}</FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl
                                id="input2"
                                isInvalid={Boolean(formik.errors.input2)}
                            >
                                <FormLabel>Input 2</FormLabel>
                                <Input
                                    placeholder={"Enter input 2"}
                                    type="text"
                                    name="input2"
                                    onChange={formik.handleChange}
                                    value={formik.values.input2}
                                />
                                {formik.errors.input2 && (
                                    <FormErrorMessage>{formik.errors.input2}</FormErrorMessage>
                                )}
                            </FormControl>
                        </Box>
                    </div>
                </Card>
                <Card p={4} width="100%">
                    <Text fontSize="lg" fontWeight={"bold"} mb={5}>
                        Title
                    </Text>
                    <div className="flex flex-col sm:flex-row gap-6">
                        <Box display="flex" flexDir="column" gap={6} width="100%">
                            <FormControl
                                id="input1"
                                isInvalid={Boolean(formik.errors.input1)}
                            >
                                <FormLabel>Input 1</FormLabel>
                                <Select>
                                    <option>Option 1</option>
                                    <option>Option 2</option>
                                </Select>
                                {formik.errors.input1 && (
                                    <FormErrorMessage>{formik.errors.input1}</FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl
                                id="input2"
                                isInvalid={Boolean(formik.errors.input2)}
                            >
                                <FormLabel>Input 2</FormLabel>
                                <DatePicker className="w-full" />
                                {formik.errors.input2 && (
                                    <FormErrorMessage>{formik.errors.input2}</FormErrorMessage>
                                )}
                            </FormControl>
                        </Box>
                        <Box display="flex" flexDir="column" gap={6} width="100%">
                            <FormControl
                                id="input1"
                                isInvalid={Boolean(formik.errors.input1)}
                            >
                                <FormLabel>Input 1</FormLabel>
                                <Input
                                    placeholder={"Enter input 1"}
                                    type="text"
                                    name="input1"
                                    onChange={formik.handleChange}
                                    value={formik.values.input1}
                                />
                                {formik.errors.input1 && (
                                    <FormErrorMessage>{formik.errors.input1}</FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl
                                id="input2"
                                isInvalid={Boolean(formik.errors.input2)}
                            >
                                <FormLabel>Input 2</FormLabel>
                                <Input
                                    placeholder={"Enter input 2"}
                                    type="text"
                                    name="input2"
                                    onChange={formik.handleChange}
                                    value={formik.values.input2}
                                />
                                {formik.errors.input2 && (
                                    <FormErrorMessage>{formik.errors.input2}</FormErrorMessage>
                                )}
                            </FormControl>
                        </Box>
                    </div>
                </Card>
            </Box>
            <Card
                p={4}
                mt={`${Spacing.containerPx}`}
                className="grid grid-cols-1 gap-6"
            >
                <Box>
                    <Text fontSize="lg" fontWeight={"bold"} mb={5}>
                        Title
                    </Text>
                    <div className="flex flex-col sm:flex-row gap-6">
                        <Box display="flex" flexDir="column" gap={6} width="100%">
                            <FormControl
                                id="input1"
                                isInvalid={Boolean(formik.errors.input1)}
                            >
                                <FormLabel>Slider</FormLabel>
                                <Slider aria-label='slider-ex-1' defaultValue={30}>
                                    <SliderTrack>
                                        <SliderFilledTrack />
                                    </SliderTrack>
                                    <SliderThumb />
                                </Slider>
                                {formik.errors.input1 && (
                                    <FormErrorMessage>{formik.errors.input1}</FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl
                                id="input2"
                                isInvalid={Boolean(formik.errors.input2)}
                            >
                                <FormLabel>Input 2</FormLabel>
                                <HStack>
                                    <PinInput>
                                        <PinInputField />
                                        <PinInputField />
                                        <PinInputField />
                                        <PinInputField />
                                    </PinInput>
                                </HStack>
                                {formik.errors.input2 && (
                                    <FormErrorMessage>{formik.errors.input2}</FormErrorMessage>
                                )}
                            </FormControl>
                        </Box>
                        <Box display="flex" flexDir="column" gap={6} width="100%">
                            <FormControl
                                id="input1"
                                isInvalid={Boolean(formik.errors.input1)}
                            >
                                <FormLabel>Input 1</FormLabel>
                                <Switch id='email-alerts' />
                                {formik.errors.input1 && (
                                    <FormErrorMessage>{formik.errors.input1}</FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl
                                id="input2"
                                isInvalid={Boolean(formik.errors.input2)}
                            >
                                <FormLabel>Input 2</FormLabel>
                                <RadioGroup
                                // onChange={setValue} value={value}
                                >
                                    <Stack direction='row'>
                                        <Radio value='1'>First</Radio>
                                        <Radio value='2'>Second</Radio>
                                        <Radio value='3'>Third</Radio>
                                    </Stack>
                                </RadioGroup>
                                {formik.errors.input2 && (
                                    <FormErrorMessage>{formik.errors.input2}</FormErrorMessage>
                                )}
                            </FormControl>
                        </Box>
                    </div>
                </Box>
                <Box>
                    <Text fontSize="lg" fontWeight={"bold"} mb={5}>
                        Title
                    </Text>
                    <div className="flex flex-col sm:flex-row gap-6">
                        <Box display="flex" flexDir="column" gap={6} width="100%">
                            <FormControl
                                id="input1"
                                isInvalid={Boolean(formik.errors.input1)}
                            >
                                <FormLabel>Input 1</FormLabel>
                                <Select>
                                    <option>Option 1</option>
                                    <option>Option 2</option>
                                </Select>
                                {formik.errors.input1 && (
                                    <FormErrorMessage>{formik.errors.input1}</FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl
                                id="input2"
                                isInvalid={Boolean(formik.errors.input2)}
                            >
                                <FormLabel>Input 2</FormLabel>
                                <DatePicker className="w-full" />
                                {formik.errors.input2 && (
                                    <FormErrorMessage>{formik.errors.input2}</FormErrorMessage>
                                )}
                            </FormControl>
                        </Box>
                        <Box display="flex" flexDir="column" gap={6} width="100%">
                            <FormControl
                                id="input1"
                                isInvalid={Boolean(formik.errors.input1)}
                            >
                                <FormLabel>Input 1</FormLabel>
                                <NumberInput>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                {formik.errors.input1 && (
                                    <FormErrorMessage>{formik.errors.input1}</FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl
                                id="input2"
                                isInvalid={Boolean(formik.errors.input2)}
                            >
                                <FormLabel>Input 2</FormLabel>
                                <Input
                                    placeholder={"Enter input 2"}
                                    type="text"
                                    name="input2"
                                    onChange={formik.handleChange}
                                    value={formik.values.input2}
                                />
                                {formik.errors.input2 && (
                                    <FormErrorMessage>{formik.errors.input2}</FormErrorMessage>
                                )}
                            </FormControl>
                        </Box>
                    </div>
                </Box>
            </Card>
            <Box mt={`${Spacing.containerPx}`} className="flex flex-col items-end">
                <Button variant="primary" type="submit">
                    Save
                </Button>
            </Box>
        </form>
    )
}