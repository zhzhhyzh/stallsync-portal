// pages/404.tsx
import React from "react";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";

const Custom404 = () => {
    return (
        <Flex
            direction="column"
            justify="center"
            align="center"
            h="100vh"
            bg="gray.50"
            textAlign="center"
            px={4}
        >
            <Heading fontSize="6xl" color="red.400">
                404
            </Heading>
            <Text fontSize="xl" mt={4}>
                Oops! The page you're looking for doesn't exist.
            </Text>
            <Text mt={2} color="gray.500">
                It might have been removed or never existed.
            </Text>
            <Link href="/dashboard" passHref>
                <Button
                    mt={6}
                    bg="#C2A76D"
                    color="white"
                    _hover={{ bg: "#a68f5e" }} 
                >
                    Go Back Home
                </Button>
            </Link>
        </Flex>
    );
};

// ✅ Make sure this default export exists and is a React component
export default Custom404;
