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
  Switch,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  IconButton,
  HStack,
  Checkbox,
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";

import { Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { IoAddSharp, IoChevronBack, IoCloseCircle, IoEye, IoSave, IoEyeOff } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal } from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineCheckCircle, AiOutlineLeft } from "react-icons/ai";
import useFetchFunctionsDetail from "@app/hooks/selector/useFetchFunctionsDetail";
import { manageFunctions } from "@app/redux/functions/slice";
import { FunctionsSchema } from "../@schemas/functionsShema";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";

export default function FunctionForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Functions" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;
  const [detailData] =
    useFetchFunctionsDetail(id);
  const [ddlData] = useFetchDDL({ code: ["FUNGRP", "FUNACT"] });

  const [avaAction, setAvaAction] = useState<{ key: string, label: string }[]>([]);
  const [action, setAction] = useState<{ key: string, label: string, status: number }[]>([]);

  const initialValues = {
    prfuncde: "",
    prfunnme: "",
    prfunlnm: "",
    prfungrp: "",
    prfunsts: false
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: FunctionsSchema,
    onSubmit: (values) => {
      const inputValue = {
        ...values,
        prfunact: action
      }
      onSubmit(inputValue);
    },
  });

  useEffect(() => {
    if (mode !== "ADD" && id) {
      //Reset Form if detailData is empty object
      if(Object.keys(detailData).length === 0) formik.resetForm();

      if(Object.keys(detailData).length > 0){
        formik.setValues({
          ...detailData,
          id: detailData?.prfuncde,
        });
  
        if (detailData?.pravlact?.length > 0) {
          setAvaAction(detailData?.pravlact);
        }
  
        if (detailData?.prfunact?.length > 0) {
          setAction(detailData?.prfunact);
        }
      }
    }
  }, [detailData]);

  useEffect(() => {
    if (mode === "ADD") {
      if (Object.keys(ddlData).length > 0 && ddlData?.FUNACT?.length > 0) {
        let _temp: { key: string, label: string }[] = [];
        ddlData?.FUNACT.map((r: DDL_TYPES) => {
          _temp.push({
            key: r.prgecode,
            label: r.prgedesc,
          })
        });
        setAvaAction(_temp);
      }
    }
  }, [ddlData])

  async function onSubmit(data: any) {
    const { success } = await sendRequest({
      fn: manageFunctions(data),
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

  function onAddAction(index: number) {
    let _avaAction = [...avaAction];

    setAction([
      ...action,
      {
        ...avaAction[index],
        status: 1,
      }
    ]);

    _avaAction.splice(index, 1);
    setAvaAction(_avaAction);
  }

  function onCheckAction(index: number) {
    let _act = [...action];
    let currKey = _act[index]?.key;
    let currLabel = _act[index]?.label;
    let currStatus = _act[index]?.status;

    _act[index] = {
      key: currKey,
      label: currLabel,
      status: currStatus === 1 ? 0 : 1
    }

    setAction(_act);
  }

  function onRemoveAction(index: number) {
    let _action = [...action];

    setAvaAction([
      ...avaAction,
      action[index],
    ]);
    _action.splice(index, 1);
    setAction(_action);
  }

  const handleStatusChange = () => {
    formik.setFieldValue("prfunsts", !formik.values.prfunsts);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="500" mb={1}>
            Functions
          </Text>
          <Breadcrumbs breadcrumbItems={[
                {
                  title: "Functions",
                  href: `/functions`,// Add parameter if needed eg. /generalParameter/?id=123
                },
                {
                  title: "Functions ("+ mode +")",
                },
              ]} />
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
            {
              mode && mode !== "VIEW" && (
              <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
            )}
          </Space>
        </Box>
      </Flex>
      <Flex 
        flexDir={{
          base: "column",
          lg: 'row'
        }}
        justifyContent={"space-evenly"}
      >
        <Box w={{
          base: "100%",
          lg: '49%'
        }}>
          <Card
            p={4}
            mt={`${Spacing.containerPx}`}
            className="grid grid-cols-1 gap-6"
          >
            <Box>
              <div className="flex flex-col sm:flex-row gap-6">
                <Box display="flex" flexDir="column" gap={6} width="100%">
                  <FormControl
                    id="prfuncde"
                    isInvalid={Boolean(formik.errors.prfuncde) && Boolean(formik.touched.prfuncde)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    {/* <FormLabel>Function Code*</FormLabel> */}
                    <CustomFormLabel labelText="Function Code"/>
                    <Input
                      placeholder={"Enter Function Code"}
                      type="text"
                      name="prfuncde"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.prfuncde}
                      isDisabled={mode === "EDIT" ? true : false}
                    />
                    {formik.errors.prfuncde && (
                      <FormErrorMessage>{formik.errors.prfuncde}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    id="prfunnme"
                    isInvalid={Boolean(formik.errors.prfunnme) && Boolean(formik.touched.prfunnme)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    {/* <FormLabel>Description*</FormLabel> */}
                    <CustomFormLabel labelText="Description"/>
                    <Input
                      placeholder={"Enter Description"}
                      type="text"
                      name="prfunnme"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.prfunnme}
                    />
                    {formik.errors.prfunnme && (
                      <FormErrorMessage>{formik.errors.prfunnme}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    id="prfunlnm"
                    isInvalid={Boolean(formik.errors.prfunlnm) && Boolean(formik.touched.prfunlnm)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    <FormLabel>Local Description</FormLabel>
                    <Input
                      placeholder={"Enter Local Description"}
                      type="text"
                      name="prfunlnm"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.prfunlnm}
                    />
                    {formik.errors.prfunlnm && (
                      <FormErrorMessage>{formik.errors.prfunlnm}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    id="prfungrp"
                    isInvalid={Boolean(formik.errors.prfungrp) && Boolean(formik.touched.prfungrp)}
                  >
                    {/* <FormLabel>Function Group*</FormLabel> */}
                    <CustomFormLabel labelText="Function Group"/>
                    <Select
                      placeholder="Please Select Function Group"
                      value={formik.values.prfungrp}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      {ddlData?.FUNGRP?.map((option: DDL_TYPES) => (
                        <option key={option.prgecode} value={option.prgecode}>
                          {option.prgedesc}
                        </option>
                      ))}
                    </Select>
                    {formik.errors.prfungrp && (
                      <FormErrorMessage>
                        {formik.errors.prfungrp}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  {
                    mode !== 'ADD' && (
                      <FormControl
                        id="prfunsts"
                        isInvalid={Boolean(formik.errors.prfunsts) && Boolean(formik.touched.prfunsts)}
                      >
                        <FormLabel>Active</FormLabel>
                        <Switch
                          id="prfunsts"
                          name="prfunsts"
                          isChecked={formik.values.prfunsts}
                          onChange={handleStatusChange}
                          onBlur={formik.handleBlur}
                          size="md"
                          colorScheme={"green"}
                          sx={{ 'span.chakra-switch__track:not([data-checked])': { backgroundColor: Colors.DANGER } }}
                        />
                        {formik.errors.prfunsts && (
                          <FormErrorMessage>
                            {formik.errors.prfunsts}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    )
                  }
                  {/* <Box display={"flex"} justifyContent={"space-between"}>
                    <Text fontSize={"sm"} fontWeight={"medium"}>Action</Text>
                    <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"} >
                      <Space size="small" >
                        <Menu>
                          <MenuButton as={IconButton} icon={<IoAddSharp />}></MenuButton>
                          <MenuList minWidth={"5rem"}>
                            {
                              avaAction && avaAction.length > 0 ? (
                                avaAction.map((r: any, i: number) =>
                                  <MenuItem onClick={() => { onAddAction(i) }} >{r.key || r.prgecode}</MenuItem>)
                              ) : (
                                <MenuItem>No Available Action</MenuItem>
                              )
                            }
                          </MenuList>
                        </Menu>
                        <Text fontSize={"md"} fontWeight={"bold"}>
                          Add Action
                        </Text>
                      </Space>
                    </Box>
                  </Box>
                  {
                    action ? (
                      <Box>
                        {
                          action.map((r: any, i: number) => {
                            return (
                              <Box p={2} m={2} display={"flex"} borderWidth={1} borderColor={Colors.GRAY} borderRadius={15} justifyContent={"space-between"} alignItems={"center"}>
                                <Text>{r.key}</Text>
                                <HStack>
                                  <IconButton
                                    variant={"outline"}
                                    color={Number(r.status.toString()) === 1 ? Colors.SUCCESS : Colors.GRAY}
                                    // bgColor={Number(r.status.toString()) === 1 ? Colors.SUCCESS: Colors.GRAY}
                                    icon={Number(r.status.toString()) === 1 ? <IoEye size={18} /> : <IoEyeOff size={18} />}
                                    aria-label={"check"}
                                    onClick={() => onCheckAction(i)}
                                  />
                                  <IconButton
                                    variant={"outline"}
                                    // variant="danger"
                                    color={Colors.DANGER}
                                    icon={<IoCloseCircle size={18} />}
                                    aria-label={"delete"}
                                    onClick={() => onRemoveAction(i)}
                                  />
                                </HStack>
                              </Box>
                            )
                          })
                        }
                      </Box>
                    ) : (
                      <Box></Box>
                    )
                  } */}
                </Box>
              </div>
            </Box>
          </Card>
        </Box>
        
        <Box w={{
          base: "100%",
          lg: '49%'
        }}>
          <Card
            p={4}
            mt={`${Spacing.containerPx}`}
            className="grid grid-cols-1 gap-6"
          >
            <Box display={"flex"} justifyContent={"space-between"}>
              <Text fontSize={"xs"} fontWeight={"semibold"} color={"#526069"} textTransform={"uppercase"}>Action</Text>
              <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"} >
                <Space size="small" >
                  <Menu>
                    <MenuButton as={IconButton} icon={<IoAddSharp />}></MenuButton>
                    <MenuList minWidth={"5rem"}>
                      {
                        avaAction && avaAction.length > 0 ? (
                          avaAction.map((r: any, i: number) =>
                            <MenuItem onClick={() => { onAddAction(i) }} >{r.key || r.prgecode}</MenuItem>)
                        ) : (
                          <MenuItem>No Available Action</MenuItem>
                        )
                      }
                    </MenuList>
                  </Menu>
                  <Text fontSize={"md"} fontWeight={"bold"}>
                    Add Action
                  </Text>
                </Space>
              </Box>
            </Box>
            {
              action ? (
                <Box>
                  {
                    action.map((r: any, i: number) => {
                      return (
                        <Box p={2} m={2} display={"flex"} borderWidth={1} borderColor={Colors.GRAY} borderRadius={15} justifyContent={"space-between"} alignItems={"center"}>
                          <Text>{r.key}</Text>
                          <HStack>
                            <IconButton
                              variant={"outline"}
                              color={Number(r.status.toString()) === 1 ? Colors.SUCCESS : Colors.GRAY}
                              // bgColor={Number(r.status.toString()) === 1 ? Colors.SUCCESS: Colors.GRAY}
                              icon={Number(r.status.toString()) === 1 ? <IoEye size={18} /> : <IoEyeOff size={18} />}
                              aria-label={"check"}
                              onClick={() => onCheckAction(i)}
                            />
                            <IconButton
                              variant={"outline"}
                              // variant="danger"
                              color={Colors.DANGER}
                              icon={<IoCloseCircle size={18} />}
                              aria-label={"delete"}
                              onClick={() => onRemoveAction(i)}
                            />
                          </HStack>
                        </Box>
                      )
                    })
                  }
                </Box>
              ) : (
                <Box></Box>
              )
            }
          </Card>
        </Box>
      </Flex>
      <Flex justifyContent="flex-end" pl={10} pr={10} pt={10} >
        <Box>
          <Space size="small">
            <Buttons buttonDefaultType={"BACK"} onclick={() => router.back()} />
            {
              mode && mode !== "VIEW" && (
                <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
            )}
          </Space>
        </Box>
      </Flex>
    </form>
  );
}
