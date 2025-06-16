import { Flex, Spinner } from "@chakra-ui/react";
import dynamic from "next/dynamic";

export function lazyComponent(promise, namedExport) {
  return dynamic(
    async () => {
      if (!namedExport) {
        return promise;
      }
      return promise.then((mod) => mod[namedExport]);
    },
    {
      loading: () => (
        <Flex align={"center"} justify={"center"}>
          <Spinner size={"lg"} />
        </Flex>
      ),
    }
  );
}
