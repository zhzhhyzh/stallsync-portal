// Chakra imports
import Colors from "@app/constants/Colors";
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Tooltip,
  IconButton,
  Switch,
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";

import { DatePicker, Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { IoChevronBack, IoSave, IoTrash } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import Buttons from "@app/components/common/Buttons/Buttons";
import useFetchSegmentsDetail from "@app/hooks/selector/useFetchSegmentsDetail";
import useFetchNotMetadata from "@app/hooks/selector/useFetchNotMetadata";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { manageSegment } from "@app/redux/segment/slice";
import { SegmentSchema } from "../@schemas/segmentSchema";
import { v4 as uuidv4 } from "uuid";
import { CloseIcon } from "@chakra-ui/icons";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
import dayjs, { Dayjs } from "dayjs";

export default function SegmentsForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Segment" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;

  const [detailData] = useFetchSegmentsDetail(id);
  const [metadata] = useFetchNotMetadata({ type: "2" });
  const [ddlData] = useFetchDDL({ code: ["OPRT", "MDAGRP", "YESORNO"] });

  const [metadataGroup, setMetadataGroup] = useState<any[]>([]);
  const [rulesArray, setRulesArray] = useState<Rules[]>([]);

  const initialValues = {
    pssegcde: "",
    pssegdsc: "",
    psseglds: "",
    pssegsts: true,
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: SegmentSchema,
    onSubmit: (values) => {
      let { pssegcde, pssegdsc, psseglds, pssegsts } = values;

      let isPassed = validationOnRules(rulesArray);
      let postData = {
        id,
        pssegcde,
        pssegdsc,
        psseglds,
        pssegsts: pssegsts === true ? "Y" : "N",
        rules: rulesArray.length > 0 ? rulesArray : [],
      };

      if (isPassed) {
        onSubmit(postData);
      }
    },
  });

  useEffect(() => {
    if (mode !== "ADD" && id) {
      //Reset Form if detailData is empty object
      if (Object.keys(detailData).length === 0) formik.resetForm();
      if (Object.keys(detailData).length > 0) {
        formik.setValues({
          ...detailData,
          pssegsts: detailData.pssegsts === "Y" ? true : false,
          id: detailData?.pssegcde,
        });

        const newRulesArray = recreateRulesArray(detailData.rules);
        setRulesArray(newRulesArray);
      }
    }
  }, [detailData]);

  useEffect(() => {
    if (ddlData.MDAGRP && ddlData.MDAGRP.length > 0) {
      let newArray = [...ddlData.MDAGRP];

      if (mode !== "ADD" && id) {
        if (Object.keys(detailData).length > 0) {
          const usedGroup = recreateMetadataGroup(detailData.rules);
          let filteredNewArray = newArray
            .filter((item) => {
              return !usedGroup.includes(item.prgecode);
            })
            .filter(
              (item: DDL_TYPES) =>
                item.prgecode === "POL" ||
                item.prgecode === "POV" ||
                item.prgecode === "QUO" ||
                item.prgecode === "TRN" ||
                item.prgecode === "VEH" ||
                item.prgecode === "CUS" ||
                item.prgecode === "MEM"
            );
          setMetadataGroup(filteredNewArray);
        }
      } else {
        setMetadataGroup(newArray);
      }
    }
  }, [ddlData]);

  function recreateRulesArray(array: Rules[]) {
    let mainArray: Rules[] = [];

    array.map((item: Rules) => {
      let rulesArray: RuleItems[] = [];

      item.ruleArray.map((ruleItem: RuleItems) => {
        rulesArray.push({
          id: ruleItem.id,
          field: ruleItem.field,
          operator: ruleItem.operator,
          value: ruleItem.value,
          condition: ruleItem.condition,
        });
      });
      mainArray.push({
        id: item.id,
        group: item.group,
        ruleArray: rulesArray,
        condition: item.condition,
      });
    });

    return mainArray;
  }

  function recreateMetadataGroup(array: Rules[]) {
    let groupList: any[] = [];

    array.map((item: Rules) => {
      groupList.push(item.group);
    });

    return groupList;
  }

  const handleStatusChange = () => {
    formik.setFieldValue("pssegsts", !formik.values.pssegsts);
  };

  function handleArrayValue(
    groupId: string,
    groupItemId: string,
    type: string,
    value: string
  ) {
    let findSelectedOrItem: Rules[] = rulesArray.filter(
      (item) => item.id === groupId
    );
    let findSelectedAndItem: RuleItems[] = findSelectedOrItem[0].ruleArray;

    findSelectedAndItem.forEach((item, index) => {
      if (item.id === groupItemId) {
        if (type === "field") {
          findSelectedAndItem[index].field = value;
          let rulesItemElement = document.getElementById(
            "Field-" + groupId + "-" + groupItemId
          );
          if (rulesItemElement) {
            rulesItemElement.style.borderColor = "#e5e7eb";
          }
          let rulesItemErrorElement = document.getElementById(
            "FieldError-" + groupId + "-" + groupItemId
          );
          if (rulesItemErrorElement) {
            rulesItemErrorElement.style.display = "none";
            rulesItemErrorElement.innerText = "";
          }
        } else if (type === "operator") {
          findSelectedAndItem[index].operator = value;
          findSelectedAndItem[index].value = "";
          let rulesItemElement = document.getElementById(
            "Operator-" + groupId + "-" + groupItemId
          );
          if (rulesItemElement) {
            rulesItemElement.style.borderColor = "#e5e7eb";
          }
          let rulesItemErrorElement = document.getElementById(
            "OperatorError-" + groupId + "-" + groupItemId
          );
          if (rulesItemErrorElement) {
            rulesItemErrorElement.style.display = "none";
            rulesItemErrorElement.innerText = "";
          }
        } else {
          findSelectedAndItem[index].value = value;

          let rulesItemElement = document.getElementById(
            "Value-" + groupId + "-" + groupItemId
          );
          if (rulesItemElement) {
            rulesItemElement.style.borderColor = "#e5e7eb";
          }
          let rulesItemErrorElement = document.getElementById(
            "ValueError-" + groupId + "-" + groupItemId
          );
          if (rulesItemErrorElement) {
            rulesItemErrorElement.style.display = "none";
            rulesItemErrorElement.innerText = "";
          }
        }
      }
    });

    let newArray = [...rulesArray];
    newArray.forEach((item, index) => {
      if (item.id === groupId) {
        item.ruleArray = findSelectedAndItem;
      }
    });

    setRulesArray(newArray);
  }

  async function onSubmit(data: any) {
    const { success } = await sendRequest({
      fn: manageSegment(data),
      formik,
    });
    if (success) {
      setTimeout(() => {
        showModal(dispatch, {
          title: mode !== "ADD" ? "Update Record" : "Add Record",
          message: mode !== "ADD" ? "Record Updated" : "Record Added",
        });
        router.back();
      }, 200);
    }
  }

  async function handleGroupChange(
    event: React.ChangeEvent<HTMLSelectElement>,
    id: string
  ) {
    setMetadataGroup((prevList) =>
      prevList?.filter((item) => {
        return item.prgecode !== event.target.value;
      })
    );

    let newArray = [...rulesArray];
    newArray.forEach((item, index) => {
      if (item.id === id) {
        item.group = event.target.value;
        item.ruleArray = [
          // {
          //   id: uuidv4(),
          //   field: "",
          //   operator: "",
          //   value: "",
          //   condition: "",
          // },
        ];
      }
    });

    setRulesArray(newArray);
  }

  function removeGroup(groupId: string, groupName: string) {
    let newArray: Rules[] = [...rulesArray];

    newArray = newArray.filter((item) => item.id !== groupId);
    if (newArray.length === 1) {
      newArray[0].condition = "";
    }

    setRulesArray(newArray);

    if (groupName !== "") {
      let oriGroupArray = [...ddlData.MDAGRP];
      let getRemovedGroupInfo = oriGroupArray.filter(
        (item) => item.prgecode === groupName
      );

      if (getRemovedGroupInfo.length > 0) {
        setMetadataGroup((prevList) => {
          return [
            ...prevList,
            {
              prgecode: getRemovedGroupInfo[0].prgecode,
              prgedesc: getRemovedGroupInfo[0].prgedesc,
              prgeldes: getRemovedGroupInfo[0].prgeldes,
            },
          ];
        });
      }
    }
  }

  function removeGroupItem(groupId: string, groupItemId: string) {
    let findSelectedGroup: Rules[] = rulesArray.filter(
      (item) => item.id === groupId
    );
    let findSelectedGroupItem: RuleItems[] = findSelectedGroup[0].ruleArray;

    let removedItem: RuleItems[] = findSelectedGroupItem.filter(
      (item) => item.id !== groupItemId
    );

    if (removedItem.length === 1) {
      removedItem[0].condition = "";
    }

    let newArray: Rules[] = [...rulesArray];
    newArray.forEach((item, index) => {
      if (item.id === groupId) {
        item.ruleArray = removedItem;
      }
    });
    setRulesArray(newArray);
  }

  function addAndOrGroup(condition: string) {
    let genId = uuidv4();
    setRulesArray([
      ...rulesArray,
      {
        id: genId,
        group: "",
        condition: condition,
        ruleArray: [],
      },
    ]);
  }

  function addAndOrGroupItem(condition: string, groupId: string) {
    let findSelectedGroup: Rules[] = rulesArray.filter(
      (item) => item.id === groupId
    );
    let findSelectedGroupItem: RuleItems[] = findSelectedGroup[0].ruleArray;

    let genGroupItemId = uuidv4();

    let newArray = [...rulesArray];
    newArray.forEach((item, index) => {
      if (item.id === groupId) {
        item.ruleArray = [
          ...findSelectedGroupItem,
          {
            id: genGroupItemId,
            field: "",
            operator: "",
            value: "",
            condition: condition,
          },
        ];
      }
    });

    setRulesArray(newArray);
  }

  const generateGroup = (RulesArray: Rules[]) => {
    return (
      Array.isArray(RulesArray) &&
      RulesArray.map((items: Rules, index: number) => {
        return (
          <Box key={"Group-" + items.id} id={"Group-" + items.id}>
            {items.condition !== "" && index !== 0 && (
              <Text pl={3} pt={2} fontSize={"md"} fontWeight={"medium"}>
                {items.condition}
              </Text>
            )}
            <Flex direction={"column"} mt={2} borderWidth={2} borderRadius={20}>
              <Box
                pl={5}
                pt={5}
                //pb={2}
                pr={5}
                display={"flex"}
                justifyContent={"space-between"}
              >
                {items.group !== "" ? (
                  <Select
                    id={"GroupSelect-" + items.id}
                    w={"200px"}
                    placeholder="Please Select Group"
                    value={items.group}
                    //onChange={(evt) => handleGroupChange(evt)}
                    disabled={true}
                  >
                    {Array.isArray(ddlData.MDAGRP) &&
                      ddlData.MDAGRP.filter(
                        (item: DDL_TYPES) =>
                          item.prgecode === "POL" ||
                          item.prgecode === "POV" ||
                          item.prgecode === "QUO" ||
                          item.prgecode === "TRN" ||
                          item.prgecode === "VEH" ||
                          item.prgecode === "CUS" ||
                          item.prgecode === "MEM"
                      ).map((option: any) => (
                        <option
                          key={option.prgecode}
                          value={option.prgecode}
                          data-key={option.prgecode}
                        >
                          {option.prgedesc}
                        </option>
                      ))}
                  </Select>
                ) : (
                  <Flex direction={"column"}>
                    <Select
                      id={"GroupSelect-" + items.id}
                      w={"200px"}
                      placeholder="Please Select Group"
                      value={items.group}
                      onChange={(evt) => handleGroupChange(evt, items.id)}
                      disabled={items.group !== "" ? true : false}
                    >
                      {Array.isArray(metadataGroup) &&
                        metadataGroup
                          .filter(
                            (item: DDL_TYPES) =>
                              item.prgecode === "POL" ||
                              item.prgecode === "POV" ||
                              item.prgecode === "QUO" ||
                              item.prgecode === "TRN" ||
                              item.prgecode === "VEH" ||
                              item.prgecode === "CUS" ||
                              item.prgecode === "MEM"
                          )
                          .map((option: any) => (
                            <option
                              key={option.prgecode}
                              value={option.prgecode}
                              data-key={option.prgecode}
                            >
                              {option.prgedesc}
                            </option>
                          ))}
                    </Select>
                    <Text
                      id={"GroupError-" + items.id}
                      fontSize={"sm"}
                      color={"red"}
                      display={"none"}
                    ></Text>
                  </Flex>
                )}
                <Box display={"flex"} alignItems={"center"}>
                  <Tooltip label="Delete Group" fontSize="sm">
                    <IconButton
                      variant="ghost"
                      verticalAlign={"center"}
                      size={"sm"}
                      borderRadius={2}
                      colorScheme="red"
                      sx={{
                        _hover: {
                          //backgroundColor: Colors.BACKGROUND,
                          color: Colors.DANGER,
                        },
                      }}
                      icon={<CloseIcon />}
                      aria-label={"delete"}
                      onClick={() => removeGroup(items.id, items.group)}
                    />
                  </Tooltip>
                </Box>
              </Box>
              <Box>
                {generateGroupItem(items.id, items.group, items.ruleArray)}
              </Box>

              <Box pl={5} pt={items.group !== "" ? 3 : 1} pb={5}>
                {items.group !== "" && (
                  <>
                    {items.ruleArray.length === 0 ? (
                      <Buttons
                        mr={2}
                        size={"xs"}
                        variant={"outline"}
                        borderColor={Colors.PRIMARY}
                        color={Colors.PRIMARY}
                        buttonText="Add Rule"
                        buttonDefaultType="CUSTOM"
                        buttonHoverBackgroundColor={Colors.PRIMARY}
                        buttonHoverColor={Colors.BACKGROUND}
                        onClick={() => addAndOrGroupItem("", items.id)}
                      />
                    ) : (
                      <>
                        <Buttons
                          mr={2}
                          size={"xs"}
                          variant={"outline"}
                          borderColor={Colors.PRIMARY}
                          color={Colors.PRIMARY}
                          buttonText="AND"
                          buttonDefaultType="CUSTOM"
                          buttonHoverBackgroundColor={Colors.PRIMARY}
                          buttonHoverColor={Colors.BACKGROUND}
                          onClick={() => addAndOrGroupItem("AND", items.id)}
                        />
                        <Buttons
                          size={"xs"}
                          variant={"outline"}
                          borderColor={Colors.PRIMARY}
                          color={Colors.PRIMARY}
                          buttonText="OR"
                          buttonDefaultType="CUSTOM"
                          buttonHoverBackgroundColor={Colors.PRIMARY}
                          buttonHoverColor={Colors.BACKGROUND}
                          onClick={() => addAndOrGroupItem("OR", items.id)}
                        />
                      </>
                    )}
                  </>
                )}
              </Box>
            </Flex>
          </Box>
        );
      })
    );
  };

  const generateGroupItem = (
    groupId: string,
    groupName: string,
    groupItem: RuleItems[]
  ) => {
    return (
      <>
        {Array.isArray(groupItem) &&
          groupItem.map((items: RuleItems, index: number) => {
            return (
              <Box
                key={"MainGroupItem-" + groupId + "-" + items.id}
                id={"MainGroupItem-" + groupId + "-" + items.id}
              >
                {items.condition !== "" && index !== 0 && (
                  <Text pl={8} pt={2} fontSize={"sm"} fontWeight={"light"}>
                    {items.condition}
                  </Text>
                )}
                <Flex
                  key={"GroupItem-" + groupId + "-" + items.id}
                  id={"GroupItem-" + groupId + "-" + items.id}
                  direction={"row"}
                  justifyContent={"space-between"}
                  pl={5}
                  pr={5}
                  pt={2}
                  pb={1}
                >
                  <Flex direction={"row"}>
                    <Box pr={1}>
                      <Select
                        id={"Field-" + groupId + "-" + items.id}
                        placeholder="Please Select Field"
                        value={items.field}
                        onChange={(evt) =>
                          handleArrayValue(
                            groupId,
                            items.id,
                            "field",
                            evt.target.value
                          )
                        }
                      >
                        {Array.isArray(metadata) &&
                          metadata
                            .filter((x) => x.psmdagrp === groupName)
                            .map((option: any) => (
                              <option
                                key={option.psmdafld}
                                value={option.psmdafld}
                                data-key={option.psmdafld}
                              >
                                {option.psmdadsp} - {option.psmdadsc}
                              </option>
                            ))}
                      </Select>
                      <Text
                        id={"FieldError-" + groupId + "-" + items.id}
                        fontSize={"sm"}
                        color={"red"}
                        display={"none"}
                      ></Text>
                    </Box>
                    <Box pr={1}>
                      <Select
                        id={"Operator-" + groupId + "-" + items.id}
                        name="fieldOperator"
                        value={items.operator}
                        onChange={(evt) =>
                          handleArrayValue(
                            groupId,
                            items.id,
                            "operator",
                            evt.target.value
                          )
                        }
                        placeholder="Please Select Operator"
                      >
                        {ddlData?.OPRT?.map((option: DDL_TYPES) => (
                          <option key={option.prgecode} value={option.prgecode}>
                            {option.prgedesc}
                          </option>
                        ))}
                      </Select>
                      <Text
                        id={"OperatorError-" + groupId + "-" + items.id}
                        fontSize={"sm"}
                        color={"red"}
                        display={"none"}
                      ></Text>
                    </Box>
                    <Box pr={1}>
                      {items.operator == "DTEQ" ? (
                        <DatePicker
                          id={"Value-" + groupId + "-" + items.id}
                          name="fieldValue"
                          style={{ width: "100%" }}
                          format={"DD/MM/YYYY"}
                          value={items.value ? dayjs(items.value) : null}
                          onChange={(value) =>
                            handleArrayValue(
                              groupId,
                              items.id,
                              "value",
                              value?.toString() || ""
                            )
                          }
                        />
                      ) : items.operator == "EQB" ? (
                        <Select
                          id={"Value-" + groupId + "-" + items.id}
                          name="fieldValue"
                          value={items.value}
                          onChange={(evt) =>
                            handleArrayValue(
                              groupId,
                              items.id,
                              "value",
                              evt.target.value
                            )
                          }
                          placeholder="Please Select Value"
                        >
                          {ddlData?.YESORNO?.map((option: DDL_TYPES) => (
                            <option
                              key={option.prgecode}
                              value={option.prgecode}
                            >
                              {option.prgedesc}
                            </option>
                          ))}
                        </Select>
                      ) : (
                        <Input
                          id={"Value-" + groupId + "-" + items.id}
                          type="text"
                          name="fieldValue"
                          onChange={(evt) =>
                            handleArrayValue(
                              groupId,
                              items.id,
                              "value",
                              evt.target.value
                            )
                          }
                          placeholder="Field Value"
                          value={items.value}
                        />
                      )}

                      <Text
                        id={"ValueError-" + groupId + "-" + items.id}
                        fontSize={"sm"}
                        color={"red"}
                        display={"none"}
                      ></Text>
                    </Box>
                  </Flex>
                  <Box display={"flex"} alignItems={"center"}>
                    <Tooltip label="Delete" fontSize="sm">
                      <IconButton
                        variant="outline"
                        verticalAlign={"center"}
                        size={"sm"}
                        borderRadius={2}
                        colorScheme="red"
                        sx={{
                          _hover: {
                            backgroundColor: Colors.DANGER,
                            color: Colors.BACKGROUND,
                          },
                        }}
                        icon={<IoTrash />}
                        aria-label={"delete"}
                        onClick={() => removeGroupItem(groupId, items.id)}
                      />
                    </Tooltip>
                  </Box>
                </Flex>
              </Box>
            );
          })}
      </>
    );
  };

  function validationOnRules(rulesArray: Rules[]) {
    let result = true;
    for (var i = 0; i < rulesArray.length; i++) {
      let rulesGroupObj = rulesArray[i];
      if (rulesGroupObj.group === "") {
        result = false;

        let rulesGroupElement = document.getElementById(
          "GroupSelect-" + rulesGroupObj.id
        );
        if (rulesGroupElement) {
          rulesGroupElement.style.borderColor = "red";
        }
        let rulesGroupErrorElement = document.getElementById(
          "GroupError-" + rulesGroupObj.id
        );
        if (rulesGroupErrorElement) {
          rulesGroupErrorElement.style.display = "block";
          rulesGroupErrorElement.innerText = "Field is required";
        }
      }

      if (rulesGroupObj.ruleArray.length > 0) {
        for (var z = 0; z < rulesGroupObj.ruleArray.length; z++) {
          let rulesItemObj = rulesGroupObj.ruleArray[z];
          if (rulesItemObj.field === "") {
            result = false;
            let rulesItemElement = document.getElementById(
              "Field-" + rulesGroupObj.id + "-" + rulesItemObj.id
            );
            if (rulesItemElement) {
              rulesItemElement.style.borderColor = "red";
            }
            let rulesItemErrorElement = document.getElementById(
              "FieldError-" + rulesGroupObj.id + "-" + rulesItemObj.id
            );
            if (rulesItemErrorElement) {
              rulesItemErrorElement.style.display = "block";
              rulesItemErrorElement.innerText = "Field is required";
            }
          }

          if (rulesItemObj.operator === "") {
            result = false;
            let rulesItemElement = document.getElementById(
              "Operator-" + rulesGroupObj.id + "-" + rulesItemObj.id
            );
            if (rulesItemElement) {
              rulesItemElement.style.borderColor = "red";
            }
            let rulesItemErrorElement = document.getElementById(
              "OperatorError-" + rulesGroupObj.id + "-" + rulesItemObj.id
            );
            if (rulesItemErrorElement) {
              rulesItemErrorElement.style.display = "block";
              rulesItemErrorElement.innerText = "Field is required";
            }
          }

          if (rulesItemObj.value === "" && rulesItemObj.operator !== "NE") {
            result = false;
            let rulesItemElement = document.getElementById(
              "Value-" + rulesGroupObj.id + "-" + rulesItemObj.id
            );
            if (rulesItemElement) {
              rulesItemElement.style.borderColor = "red";
            }
            let rulesItemErrorElement = document.getElementById(
              "ValueError-" + rulesGroupObj.id + "-" + rulesItemObj.id
            );
            if (rulesItemErrorElement) {
              rulesItemErrorElement.style.display = "block";
              rulesItemErrorElement.innerText = "Field is required";
            }
          }

          if (
            rulesItemObj.operator === "GT" ||
            rulesItemObj.operator === "GTE" ||
            rulesItemObj.operator === "LT" ||
            rulesItemObj.operator === "LTE"
          ) {
            if (rulesItemObj.value !== "") {
              const testNumber = Number(rulesItemObj.value);
              const testDate = Date.parse(rulesItemObj.value);
              if (isNaN(testNumber) && isNaN(testDate)) {
                result = false;
                let rulesItemElement = document.getElementById(
                  "Value-" + rulesGroupObj.id + "-" + rulesItemObj.id
                );
                if (rulesItemElement) {
                  rulesItemElement.style.borderColor = "red";
                }
                let rulesItemErrorElement = document.getElementById(
                  "ValueError-" + rulesGroupObj.id + "-" + rulesItemObj.id
                );
                if (rulesItemErrorElement) {
                  rulesItemErrorElement.style.display = "block";
                  rulesItemErrorElement.innerText = "Invalid Data Type";
                }
              }
            }
          }
        }
      }
    }

    return result;
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Segment
          </Text>
          <Breadcrumbs
            breadcrumbItems={[
              {
                title: "Segments Listing",
                href: `/segment`, // Add parameter if needed eg. /generalParameter/?id=123
              },
              {
                title: "Segment (" + mode + ")",
              },
            ]}
          />
        </Flex>
        <Box
          display={"flex"}
          alignSelf={"center"}
          pr={{
            base: 0,
            md: Spacing.containerPx,
          }}
        >
          <Space size="small">
            <Buttons buttonDefaultType={"BACK"} onclick={() => router.back()} />
            {mode && mode !== "VIEW" && (
              <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
            )}
          </Space>
        </Box>
      </Flex>
      <Flex direction={"column"} gap={Spacing.gap} mt={Spacing.gap}>
        <Card className="grid grid-cols-1 gap-6">
          <Box>
            <div className="flex flex-col sm:flex-row gap-6">
              <Box display="flex" flexDir="column" gap={6} width="50%">
                <FormControl
                  id="pssegcde"
                  isInvalid={
                    Boolean(formik.errors.pssegcde) &&
                    Boolean(formik.touched.pssegcde)
                  }
                  isReadOnly={mode !== "ADD" ? true : false}
                >
                  <CustomFormLabel labelText="Segment Code" />
                  <Input
                    placeholder={"Enter Segment Code"}
                    type="text"
                    name="pssegcde"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.pssegcde}
                  />
                  {formik.errors.pssegcde && (
                    <FormErrorMessage>
                      {formik.errors.pssegcde}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="pssegdsc"
                  isInvalid={
                    Boolean(formik.errors.pssegdsc) &&
                    Boolean(formik.touched.pssegdsc)
                  }
                >
                  <CustomFormLabel labelText="Description" />
                  <Input
                    placeholder={"Enter Description"}
                    type="text"
                    name="pssegdsc"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.pssegdsc}
                  />
                  {formik.errors.pssegdsc && (
                    <FormErrorMessage>
                      {formik.errors.pssegdsc}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psseglds"
                  isInvalid={
                    Boolean(formik.errors.psseglds) &&
                    Boolean(formik.touched.psseglds)
                  }
                >
                  <FormLabel>Local Description</FormLabel>
                  <Input
                    placeholder={"Enter Local Description"}
                    type="text"
                    name="psseglds"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.psseglds}
                  />
                  {formik.errors.psseglds && (
                    <FormErrorMessage>
                      {formik.errors.psseglds}
                    </FormErrorMessage>
                  )}
                </FormControl>
                {mode === "EDIT" && (
                  <FormControl
                    id="pssegsts"
                    isInvalid={
                      Boolean(formik.errors.pssegsts) &&
                      Boolean(formik.touched.pssegsts)
                    }
                  >
                    <FormLabel>Active</FormLabel>
                    <Switch
                      id="pssegsts"
                      name="pssegsts"
                      isChecked={formik.values.pssegsts}
                      onChange={handleStatusChange}
                      onBlur={formik.handleBlur}
                      size="md"
                      colorScheme={"green"}
                      sx={{
                        "span.chakra-switch__track:not([data-checked])": {
                          backgroundColor: Colors.DANGER,
                        },
                      }}
                    />
                    {formik.errors.pssegsts && (
                      <FormErrorMessage>
                        {formik.errors.pssegsts}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                )}
              </Box>
            </div>
          </Box>
        </Card>
        <Card className="grid grid-cols-1 gap-6">
          <Box>
            <Text>Segment Rules</Text>
            {/* {generateOrRule(rulesArray)} */ generateGroup(rulesArray)}
            <Box pl={5} pt={5}>
              {rulesArray.length === 0 ? (
                <Buttons
                  mr={2}
                  variant={"outline"}
                  borderColor={Colors.PRIMARY}
                  color={Colors.PRIMARY}
                  buttonText={"Add Rule"}
                  style={{ alignSelf: "center" }}
                  buttonDefaultType="CUSTOM"
                  buttonHoverBackgroundColor={Colors.PRIMARY}
                  buttonHoverColor={Colors.BACKGROUND}
                  onClick={() => addAndOrGroup("")}
                />
              ) : (
                <>
                  <Buttons
                    mr={2}
                    variant={"outline"}
                    borderColor={Colors.PRIMARY}
                    color={Colors.PRIMARY}
                    buttonText={"AND"}
                    style={{ alignSelf: "center" }}
                    buttonDefaultType="CUSTOM"
                    buttonHoverBackgroundColor={Colors.PRIMARY}
                    buttonHoverColor={Colors.BACKGROUND}
                    onClick={() => addAndOrGroup("AND")}
                  />
                  <Buttons
                    variant={"outline"}
                    borderColor={Colors.PRIMARY}
                    color={Colors.PRIMARY}
                    buttonText={"OR"}
                    style={{ alignSelf: "center" }}
                    buttonDefaultType="CUSTOM"
                    buttonHoverBackgroundColor={Colors.PRIMARY}
                    buttonHoverColor={Colors.BACKGROUND}
                    onClick={() => addAndOrGroup("OR")}
                  />
                </>
              )}
            </Box>
          </Box>
        </Card>
      </Flex>
      <Flex justifyContent="flex-end" pl={10} pr={10} pt={10}>
        <Box>
          <Space size="small">
            <Buttons buttonDefaultType={"BACK"} onclick={() => router.back()} />
            {mode && mode !== "VIEW" && (
              <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
            )}
          </Space>
        </Box>
      </Flex>
    </form>
  );
}

interface RuleItems {
  id: string;
  field: string;
  operator: string;
  value: string;
  condition: string;
}

interface Rules {
  id: string;
  group: string;
  condition: string;
  ruleArray: RuleItems[];
}

interface MetadataGroupList {
  group: string;
  groupListArray: any[];
}
