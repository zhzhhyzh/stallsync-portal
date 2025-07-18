// Chakra imports
import Colors from "@app/constants/Colors";
import {
    Box,
    Select,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionIcon,
    AccordionPanel,
    Checkbox,
    Stack,
    Spinner,
    Card,
    Text,
    Switch
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import useFetchAccessibility from "@app/hooks/selector/useFetchAccessibility";
import { access } from "fs";
import {
    fetchAccessibility,
    manageAccessActions,
} from "@app/redux/accessibility/slice";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import { selectHome } from "@app/redux/app/slice";
import { IoClose, IoCheckmarkSharp } from "react-icons/io5";
import Spacing from "@app/constants/Spacing";
import useFetchDDLRoleCode from "@app/hooks/selector/useFetchDDLRoleCode";

export default function Accessibility({ selectedRole }: { selectedRole?: string }) {
    const dispatch = useAppDispatch();
    const api = useApi({ title: "Accessibility" });
    const loading = api?.loading ?? false;
    const sendRequest = api?.sendRequest ?? (() => Promise.resolve({ success: false }));

    const homeData = useAppSelector(selectHome);

    const [ddlData] = useFetchDDL({ code: ["USRROLE", "FUNACT"] });
    const [ddlData1] = useFetchDDLRoleCode();
    const [accessData] = useFetchAccessibility();
    const [role, setRole] = useState(selectedRole === undefined ? "ADM" : selectedRole);
    const [checkboxState, setCheckboxState] = useState<any>({});
    const [submitData, setSubmitData] = useState<any>({});
    const [groupCode, setGroupCode] = useState<any>({});

    useEffect(() => {
        if (Array.isArray(accessData) && accessData.length > 0 && (selectedRole === undefined || (selectedRole !== undefined && selectedRole !== ""))) {
            initCheckboxes();
        }
    }, [accessData, role, ddlData?.FUNACT]);

    useEffect(() => {
        if (submitData && Object.keys(submitData).length > 0) onSubmit();
    }, [submitData]);

    useEffect(() => {
        if (selectedRole === "") {
            setCheckboxState({})
            setRole("")
        } else {
            setRole(selectedRole || "ADM")
        }
    }, [selectedRole]);

    function roleOnChange(event: any) {
        setRole(event.target.value);
    }

    function initCheckboxes() {
        let tempGroupCode: any = {};
        (accessData || []).map((group: any) => {
            group.prfunctions.map((functions: any) => {
                (ddlData.FUNACT || []).map((option: DDL_TYPES) => {
                    let selectedRoleArr = functions?.roles?.reduce(
                        (accumulator: any[], currentValue: any) => {
                            if (currentValue.pracsrol === role) {
                                accumulator.push(currentValue);
                            }
                            return accumulator;
                        },
                        []
                    );
                    let filteredAction = selectedRoleArr[0]?.prfunact?.filter(
                        (objectValue: any) =>
                            objectValue.label !== "" && objectValue.label === option.prgecode
                    );

                    if (filteredAction && filteredAction.length > 0) {
                        let isCheck = filteredAction[0].checked;
                        let actionField = filteredAction[0].field;
                        setCheckboxState((prevState: any) => ({
                            ...prevState,
                            [functions.pracsfun]: {
                                ...(prevState[functions.pracsfun] || null),
                                [option.prgecode]: {
                                    field: actionField,
                                    check: Boolean(isCheck),
                                    loading: false,
                                },
                            },
                        }));
                    }
                    //preset all group code action
                    if (selectedRoleArr[0]?.pracsrol === role) {
                        const temp = selectedRoleArr[0]?.prfunact?.map((action: any) => action.label)
                        // tempGroupCode[group.prfungrp] = (tempGroupCode[group.prfungrp] && tempGroupCode[group.prfungrp].length < temp.length) ? temp : tempGroupCode[group.prfungrp] || temp
                        //combine all action and remove duplicate
                        //@ts-ignore
                        tempGroupCode[group.prfungrp] = !tempGroupCode[group.prfungrp] ? temp : [...new Set([...tempGroupCode[group.prfungrp], ...temp])]
                    }
                });
            });
        });
        setGroupCode(tempGroupCode);
    }

    function handleCheckBoxOnChange(func: string, action: string) {
        setSubmitData({
            ...checkboxState,
            [func]: {
                ...(checkboxState[func] || null),
                [action]: {
                    ...(checkboxState[func][action] || null),
                    check: !checkboxState[func][action].check,
                    loading: true,
                },
            },
        });

        setCheckboxState((prevState: any) => {
            if (action in prevState[func]) {
                return {
                    ...prevState,
                    [func]: {
                        ...(prevState[func] || null),
                        [action]: {
                            ...prevState[func][action],
                            check: !prevState[func][action].check,
                            loading: true,
                        },
                    },
                };
            } else {
                return {
                    ...prevState,
                    [func]: {
                        ...(prevState[func] || null),
                    },
                };
            }
        });
    }

    function handleGroupCheckBoxOnChange(
        grp: string,
        action: string,
        value: boolean
    ) {
        let _checkboxes = checkboxState;
        accessData.map((group: any) => {
            if (group.prfungrp === grp) {
                group.prfunctions.map((func: any) => {
                    let funcCode = func.pracsfun;
                    let _func = null;
                    if (_checkboxes[funcCode]) {
                        if (action in _checkboxes[funcCode]) {
                            _func = {
                                ..._checkboxes[funcCode],
                                [action]: {
                                    ..._checkboxes[funcCode][action],
                                    check: value,
                                    loading: true,
                                },
                            };
                        } else {
                            _func = {
                                ..._checkboxes[funcCode],
                            };
                        }
                    }

                    _checkboxes = {
                        ..._checkboxes,
                        [funcCode]: _func,
                    };
                });
            }
        });
        setCheckboxState(_checkboxes);
        setSubmitData(_checkboxes);
    }

    function generateGroupCheckBox(group: any) {
        return groupCode[group?.prfungrp]?.map((act: string) => {
            // return ddlData?.FUNACT?.map((option: DDL_TYPES) => {
            let groupCheck = true;
            let returnEmpty = true;

            group.prfunctions.map((functions: any) => {
                if (checkboxState[functions.pracsfun]) {
                    if (act in checkboxState[functions.pracsfun]) {
                        if (!checkboxState[functions.pracsfun][act].check) {
                            groupCheck = false;
                        }
                        returnEmpty = false;
                    }
                }
            });

            if (!returnEmpty) {
                return (
                    // <Box flexDir={'column'} alignItems={'center'} w={"60px"}>
                    <Box display="flex" justifyContent="center" alignItems="center" w="60px">
                        {groupCheck ? (
                            <IoCheckmarkSharp size={22} color={Colors.SUCCESS} />
                        ) : (
                            <IoClose size={22} color={Colors.DANGER} />
                        )}
                    </Box>


                    // </Box>
                );
                // } else {
                //   return (
                //     <Box opacity={0}>
                //       <Checkbox
                //         isDisabled={true}
                //         isChecked={false}
                //         key={option.prgecode}
                //         value={option.prgecode}
                //       />
                //       <Text style={{
                //         color: `#f1f1f1`,
                //         fontSize: `.8em`,
                //         margin: 0,
                //         whiteSpace: 'nowrap',
                //         transform: `scale(0.8)`,
                //       }}>
                //         {option.prgedesc}
                //       </Text>
                //     </Box>
                //   );
            }
        });
    }

    function generateGroupLabel(group: any) {
        return groupCode[group?.prfungrp]?.map((act: string) => {
            // return ddlData?.FUNACT?.map((option: DDL_TYPES) => {
            let groupCheck = true;
            let returnEmpty = true;

            group.prfunctions.map((functions: any) => {
                if (checkboxState[functions.pracsfun]) {
                    if (act in checkboxState[functions.pracsfun]) {
                        if (!checkboxState[functions.pracsfun][act].check) {
                            groupCheck = false;
                        }
                        returnEmpty = false;
                    }
                }
            });

            const findFuncAct = ddlData?.FUNACT?.find((option: DDL_TYPES) => option.prgecode === act);

            if (!returnEmpty) {
                return (
                    <Box flexDir={'column'} alignItems={'center'} w={"60px"} pb={1} >
                        <Text style={{
                            // color: `#f1f1f1`,
                            fontSize: `.8em`,
                            margin: 0,
                            whiteSpace: 'nowrap',
                            transform: `scale(0.8)`,
                        }}
                            textAlign={'center'}
                        >
                            {findFuncAct?.prgedesc}
                        </Text>
                    </Box>
                );
                // } else {
                //   return (
                //     <Box opacity={0}>
                //       <Text style={{
                //         color: `#f1f1f1`,
                //         fontSize: `.8em`,
                //         margin: 0,
                //         whiteSpace: 'nowrap',
                //         transform: `scale(0.8)`,
                //       }}>
                //         {option.prgedesc}
                //       </Text>
                //     </Box>
                //   );
            }
        });
    }

    function renderAccessStatus(functions: any, group: any) {
        return groupCode[group?.prfungrp]?.map((act: string) => {
            const selectedRoleArr = functions?.roles?.filter((r: any) => r.pracsrol === role);
            const findFuncAct = selectedRoleArr?.[0]?.prfunact?.find((a: any) => a.label === act);
            const isChecked = findFuncAct?.checked === 1;

            const isLoading = checkboxState?.[functions.pracsfun]?.[act]?.loading ?? false;

            if (isChecked !== undefined) {
                return isLoading ? (
                    <Box display="flex" flexDir="column" alignItems="center" w="60px" h="20px">
                        <Spinner color={Colors.SUCCESS} />
                    </Box>
                ) : (
                    <Box display="flex" flexDir="column" alignItems="center" w="60px">
                        {checkboxState?.[functions.pracsfun]?.[act]?.check ? (
                            <IoCheckmarkSharp size={22} color={Colors.SUCCESS} />
                        ) : (
                            <IoClose size={22} color={Colors.DANGER} />
                        )}
                    </Box>
                );
            } else {
                return (
                    <Box display="flex" flexDir="column" alignItems="center" w="60px" h="20px">
                        <IoClose size={20} color={Colors.DANGER} />
                    </Box>
                );
            }
        });
    }


    async function onSubmit() {
        let functions: any[] = [];
        let actions = {};

        Object.keys(submitData).map((funcKey) => {
            let accessible = false;
            if (!submitData[funcKey]) return;
            Object.keys(submitData[funcKey]).map((actionKey) => {
                let _action = submitData[funcKey][actionKey];
                if (_action.check !== undefined) {
                    if (_action.check) {
                        accessible = true;
                    }
                    actions = {
                        ...actions,
                        [_action.field]: _action.check ? 1 : 0,
                    };
                }
            });
            functions.push({
                prfuncde: funcKey,
                pracssts: accessible ? 1 : 0,
                prfunact: actions,
            });
        });

        let postData = {
            prrolecode: role,
            data: functions,
        };

        const { success } = await sendRequest({
            fn: manageAccessActions(postData),
        });

        if (success) {
            await dispatch(fetchAccessibility({}));
        }
    }

    const labelW = 180
    return (
        <Box>
            {
                (homeData?.access && checkAccessMatrix(homeData?.access, accessType.ACES_EDIT)) && (
                    <Box>
                        <Box >
                            <Text fontSize={16} fontWeight={"bold"}>
                                Accessibility Parameter
                            </Text>
                        </Box>
                        {
                            selectedRole === undefined && (
                                <Box w={"30%"} display="flex" flexDirection="row" pt={Spacing.gap}>
                                    <Select
                                        name="userRole"
                                        onChange={roleOnChange}
                                        //placeholder="Please Select User Role"
                                        value={role}
                                    >
                                        {ddlData?.USRROLE?.map((option: DDL_TYPES) => (
                                            <option key={option.prgecode} value={option.prgecode}>
                                                {option.prgedesc}
                                            </option>
                                        ))}
                                        {/* {Array.isArray(ddlData1) && ddlData1.length > 0 ? (
                                            ddlData1.map((option: any) => (
                                                <option key={option.psroldsc} value={option.psrolcde}>
                                                    {option.psroldsc}
                                                </option>
                                            ))
                                        ) : (
                                            <option value="">No options available</option>
                                        )} */}
                                    </Select>
                                </Box>
                            )
                        }
                        <Box pt={5} overflow={'auto'}>
                            <Accordion allowMultiple minW={'600px'} pb={Spacing.gap}>
                                {(accessData || []).map((group: any) => (
                                    <AccordionItem borderRadius={0} pt={6} >
                                        <Box ml={labelW} className="flex flex-row gap-10" pl={5}>
                                            {generateGroupLabel(group)}
                                        </Box>
                                        <AccordionButton p={5} bgColor={'rgba(0,0,0,0.05)'} _hover={{ backgroundColor: 'rgba(0,0,0,0.07)' }}>
                                            <Box w={labelW}>
                                                <Text style={{ color: Colors.DARK, fontSize: 16 }} className="text-left">
                                                    {group.prfungrpdsc}
                                                </Text>
                                            </Box>

                                            <Box className="flex-1 flex flex-row gap-10">
                                                {generateGroupCheckBox(group)}
                                            </Box>

                                            {/* Only show dropdown icon if more than 1 function */}
                                            {group.prfunctions.length > 1 && <AccordionIcon w={"20px"} />}
                                        </AccordionButton>

                                        {
                                            group.prfunctions.length > 1 ? (
                                                group.prfunctions.map((functions: any) => (
                                                    <AccordionPanel py={4} px={5} _hover={{ backgroundColor: 'rgba(0,0,0,0.03)' }}>
                                                        <Box className="flex flex-row items-center">
                                                            <Box w={labelW}>
                                                                <Text>{functions.pracsfundsc}</Text>
                                                            </Box>
                                                            <Box className="flex-1 flex flex-row gap-10">
                                                                {renderAccessStatus(functions, group)}
                                                            </Box>
                                                        </Box>
                                                    </AccordionPanel>
                                                ))
                                            ) : null
                                        }

                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </Box>
                    </Box>
                )
            }
        </Box>
    );
}
