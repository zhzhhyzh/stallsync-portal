// Chakra imports
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Divider,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";
import Spacing from "@app/constants/Spacing";
import Card from "@app/components/common/Card/Card";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";

import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { numberWithCommas } from "@app/utils/StringUtils";

export default function RepaymentScheduleForm({
  formik,
}: RepaymentScheduleProps) {
  const { sendRequest, loading } = useApi({ title: "Repayment Schedule" });
  const router = useRouter();
  const dispatch = useAppDispatch();

  const generateAccordionItem = (
    repaymentScheduleArray: any[],
    totals: any,
    ratetyp: string
  ) => {
    return (
      Array.isArray(repaymentScheduleArray) &&
      repaymentScheduleArray.map((items: any, index: number) => {
        return (
          <>
            <Card mt={5} borderColor={"#ffffff"}>
              <AccordionItem borderWidth={0}>
                {({ isExpanded }) => (
                  <>
                    <h2>
                      <AccordionButton>
                        <Box
                          as="span"
                          fontSize={"lg"}
                          fontWeight={"medium"}
                          flex="1"
                          textAlign="left"
                        >
                          {items?.year}
                        </Box>
                        {isExpanded ? <FaMinus /> : <FaPlus />}
                      </AccordionButton>
                      <Divider borderWidth={"1px"} borderColor={"gray.400"} />
                    </h2>

                    <AccordionPanel pb={4}>
                      <TableContainer>
                        <Table variant="simple">
                          <Thead>
                            {ratetyp == "FLTRT" ? (
                              <Tr fontSize={"12px"}>
                                <Th>No.</Th>
                                <Th>Due Date</Th>
                                <Th isNumeric>Billed Principal</Th>
                                <Th isNumeric>Billed Interest</Th>
                                <Th isNumeric>Installment Amt</Th>
                                <Th isNumeric>O/S Principal</Th>
                                <Th isNumeric>Unearned Interest</Th>
                              </Tr>
                            ) : (
                              <Tr fontSize={"12px"}>
                                <Th>No.</Th>
                                {/* <Th>Start Date</Th>
                                <Th>End Date</Th> */}
                                <Th>Due Date</Th>
                                {/* <Th>Day Accrual</Th> */}
                                <Th isNumeric>Rate(%)</Th>
                                <Th isNumeric>Billed Principal</Th>
                                <Th isNumeric>Billed Interest</Th>
                                <Th isNumeric>Installment Amt</Th>
                                <Th isNumeric>O/S Principal</Th>
                              </Tr>
                            )}
                          </Thead>
                          <Tbody>
                            {generateTableRow(items?.detail, ratetyp)}
                          </Tbody>
                          {repaymentScheduleArray.length > 0 &&
                            index == repaymentScheduleArray.length - 1 && (
                              <Tfoot>
                                {ratetyp == "FLTRT" ? (
                                  <Tr>
                                    <Th
                                      fontFamily={"Montserrat"}
                                      fontSize={"14px"}
                                    >
                                      Total
                                    </Th>
                                    <Th></Th>
                                    <Th
                                      fontFamily={"Montserrat"}
                                      fontSize={"14px"}
                                      isNumeric
                                    >
                                      {totals.total_accumulate_billed_principal}
                                    </Th>
                                    <Th
                                      fontFamily={"Montserrat"}
                                      fontSize={"14px"}
                                      isNumeric
                                    >
                                      {totals.total_accumulate_billed_interest}
                                    </Th>
                                    <Th isNumeric></Th>
                                    <Th isNumeric></Th>
                                    <Th isNumeric></Th>
                                  </Tr>
                                ) : (
                                  <Tr>
                                    <Th fontSize={"14px"}>Total</Th>
                                    <Th></Th>
                                    {/* <Th></Th> */}
                                    {/* <Th></Th> */}
                                    <Th></Th>
                                    <Th
                                      fontFamily={"Montserrat"}
                                      fontSize={"14px"}
                                      isNumeric
                                    >
                                      {totals.total_accumulate_billed_principal}
                                    </Th>
                                    <Th
                                      fontFamily={"Montserrat"}
                                      fontSize={"14px"}
                                      isNumeric
                                    >
                                      {totals.total_accumulate_billed_interest}
                                    </Th>
                                    <Th
                                      fontFamily={"Montserrat"}
                                      fontSize={"14px"}
                                      isNumeric
                                    >
                                      {totals.total_payable}
                                    </Th>
                                  </Tr>
                                )}
                              </Tfoot>
                            )}
                        </Table>
                      </TableContainer>
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>
            </Card>
          </>
        );
      })
    );
  };

  const generateTableRow = (
    repaymentScheduleDetailsArray: any[],
    ratetyp: string
  ) => {
    return (
      Array.isArray(repaymentScheduleDetailsArray) &&
      repaymentScheduleDetailsArray.map((items: any, index: number) => {
        return (
          <>
            {ratetyp == "FLTRT" ? (
              <Tr fontSize={"14px"}>
                <Td>{items?.payment_count}</Td>
                <Td>{items?.due_date}</Td>
                <Td isNumeric>{items?.principal}</Td>
                <Td isNumeric>{items?.interest}</Td>
                <Td isNumeric>{items?.installment_amt}</Td>
                <Td isNumeric>{items?.os_principal}</Td>
                <Td isNumeric>{items?.unearned_interest}</Td>
                {/* <Td textAlign={"center"}>{items?.factor}</Td> */}
              </Tr>
            ) : (
              <Tr fontSize={"14px"}>
                <Td>{items?.payment_count}</Td>
                {/* <Td>{items?.start_date}</Td> */}
                <Td>{items?.due_date}</Td>
                {/* <Td>{items?.day_accrual}</Td> */}
                <Td isNumeric>{items?.rate}</Td>
                <Td isNumeric>{items?.principal}</Td>
                <Td isNumeric>{items?.interest}</Td>
                <Td isNumeric>{items?.installment_amt}</Td>
                <Td isNumeric>{items?.os_principal}</Td>
              </Tr>
            )}
          </>
        );
      })
    );
  };

  return (
    <Flex
      flexDir={{
        base: "column",
        lg: "row",
      }}
      gap={Spacing.gap}
      mt={Spacing.gap}
    >
      <Box w={"100%"}>
        <Card className="grid grid-cols-1 gap-6">
          <Box
            display="flex"
            flexDir="column"
            alignItems={"center"}
            gap={6}
            width="100%"
          >
            <Grid
              gap={2}
              templateColumns="1fr auto 1fr 1fr auto 1fr 1fr auto 1fr 0.5fr auto 0.5fr"
              templateRows="repeat(3, 1fr)"
              fontSize={14}
              width="100%"
              px={5}
            >
              <GridItem fontWeight={"semibold"}>Loan Amount</GridItem>
              <GridItem>:</GridItem>
              <GridItem fontWeight={"medium"} textAlign={"right"}>
                <Flex width={"70%"} justifyContent={"flex-end"}>
                  {numberWithCommas(
                    formik.values.repayment_schedule_header?.loan_amt
                  ) || "0.00"}
                </Flex>
              </GridItem>
              <GridItem fontWeight={"semibold"}>First Due Date</GridItem>
              <GridItem>:</GridItem>
              <GridItem fontWeight={"medium"}>
                {formik.values.repayment_schedule_header?.start_date || "N/A"}
              </GridItem>
              <GridItem fontWeight={"semibold"}>Payment Freq</GridItem>
              <GridItem>:</GridItem>
              <GridItem fontWeight={"medium"}>
                {formik.values.repayment_schedule_header?.payment_freq &&
                formik.values.repayment_schedule_header?.payment_freq != ""
                  ? formik.values.repayment_schedule_header?.payment_freq +
                    (formik.values.repayment_schedule_header
                      ?.payment_freq_type &&
                    formik.values.repayment_schedule_header
                      ?.payment_freq_type == "M"
                      ? formik.values.repayment_schedule_header?.payment_freq >
                        1
                        ? " Months"
                        : " Month"
                      : formik.values.repayment_schedule_header?.payment_freq >
                        1
                      ? " Days"
                      : " Day")
                  : "N/A"}
              </GridItem>
              <GridItem fontWeight={"semibold"}>Rate</GridItem>
              <GridItem>:</GridItem>
              <GridItem fontWeight={"medium"}>
                {(formik.values.repayment_schedule_header?.rate &&
                  formik.values.repayment_schedule_header?.rate + "%") ||
                  "0.00%"}
              </GridItem>

              <GridItem fontWeight={"semibold"}>Total Interest</GridItem>
              <GridItem>:</GridItem>
              <GridItem fontWeight={"medium"} textAlign={"right"}>
                <Flex width={"70%"} justifyContent={"flex-end"}>
                  {numberWithCommas(
                    formik.values.repayment_schedule_header?.total_interest
                  ) || "0.00"}
                </Flex>
              </GridItem>
              <GridItem fontWeight={"semibold"}>Tenure</GridItem>
              <GridItem>:</GridItem>
              <GridItem fontWeight={"medium"}>
                {formik.values.repayment_schedule_header?.tenure &&
                formik.values.repayment_schedule_header?.tenure != ""
                  ? formik.values.repayment_schedule_header?.tenure +
                    (formik.values.repayment_schedule_header?.tenure_type &&
                    formik.values.repayment_schedule_header?.tenure_type == "M"
                      ? formik.values.repayment_schedule_header?.tenure > 1
                        ? " Months"
                        : " Month"
                      : formik.values.repayment_schedule_header?.tenure > 1
                      ? " Days"
                      : " Day")
                  : "N/A"}
              </GridItem>
              <GridItem fontWeight={"semibold"}>Installment</GridItem>
              <GridItem>:</GridItem>
              <GridItem fontWeight={"medium"}>
                {numberWithCommas(
                  formik.values.repayment_schedule_header?.installment
                ) || "0.00"}
              </GridItem>
              <GridItem fontWeight={"semibold"}>EIR Rate</GridItem>
              <GridItem>:</GridItem>
              <GridItem fontWeight={"medium"}>
                {(formik.values.repayment_schedule_header?.eir_rate &&
                  formik.values.repayment_schedule_header?.eir_rate + "%") ||
                  "0.00%"}
              </GridItem>

              <GridItem fontWeight={"semibold"}>Total Payable</GridItem>
              <GridItem>:</GridItem>
              <GridItem fontWeight={"medium"} textAlign={"right"}>
                <Flex width={"70%"} justifyContent={"flex-end"}>
                  {numberWithCommas(
                    formik.values.repayment_schedule_header?.total_payable
                  ) || "0.00"}
                </Flex>
              </GridItem>
              <GridItem fontWeight={"semibold"}>Maturity Date</GridItem>
              <GridItem>:</GridItem>
              <GridItem fontWeight={"medium"}>
                {formik.values.repayment_schedule_header?.maturity_date ||
                  "N/A"}
              </GridItem>
              <GridItem fontWeight={"semibold"}>Final Installment</GridItem>
              <GridItem>:</GridItem>
              <GridItem fontWeight={"medium"}>
                {numberWithCommas(
                  formik.values.repayment_schedule_header?.final_installment
                ) || "0.00"}
              </GridItem>
            </Grid>
          </Box>
        </Card>
        <Accordion defaultIndex={[0]} allowMultiple>
          {generateAccordionItem(
            formik.values.repayment_schedule.schedule_list,
            formik.values.repayment_schedule.total,
            formik.values.ratetyp
          )}
        </Accordion>
      </Box>
    </Flex>
  );
}

interface RepaymentScheduleProps {
  formik?: any;
}
