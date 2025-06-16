import { TableContainer } from "@chakra-ui/react";
import React, { useRef, useState, useEffect } from "react";
// import { createColumn, Table as ChakraTable } from "react-chakra-pagination";

import { Space, Table as TableAntd, Tag } from "antd";
import useApi from "@app/hooks/useApi";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { resetRefreshTable, selectTableRefreshCount } from "@app/redux/app/slice";

export default function Table(props: TableDefaultProps) {
  const { data, length, columns, refreshFn, extraParams, totalRecords, onDoubleClick } = props;
  const dispatch = useAppDispatch();

  const tableRefreshCount = useAppSelector(selectTableRefreshCount)
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const tableRef = useRef(null);

  // const handleExportCsv = () => {
  //   //@ts-ignore
  //   tableRef?.current.exportCsv({ filename: "data.csv" });
  // };

  const tableStyles = {
    fontFamily: "Montserrat ,Roboto, sans-serif", // Set the desired font family
  };

  function onChangePage(page: number) {
    setPage(page);
  }

  function showTotal(total: number, range: number[]) {
    return `Show total ${range[0]}-${range[1]} of ${total} entries`;
  }

  useEffect(() => {
    dispatch(resetRefreshTable())
  }, [])

  useEffect(() => {
    if (refreshFn || tableRefreshCount > 0) {
      dispatch(
        refreshFn({
          page: page > 0 ? page - 1 : page,
          limit: pageSize,
          ...(extraParams || {}),
        })
      );
    }
  }, [page, pageSize, JSON.stringify(extraParams), tableRefreshCount]);

  useEffect(() => {
    //Always default page to 1 when filter is changed
    setPage(1);
  }, [JSON.stringify(extraParams)]);

  return (
    <TableContainer>
      {/* <Button variant="primary" leftIcon={<IoDownload />} onClick={handleExportCsv}>
        Export to CSV
      </Button> */}
      <TableAntd
        {...props}
        ref={tableRef}
        columns={columns}
        dataSource={data}
        pagination={{
          showSizeChanger: true,
          showTitle: true,
          pageSize: length || pageSize,
          total: totalRecords,
          current: page,
          onChange(page, pageSize) {
            setPage(page);
            setPageSize(length === pageSize ? length : pageSize);
            props?.onPageChange && props?.onPageChange(page);
            props?.onSizeChange && props?.onSizeChange(pageSize);
          },
          showTotal,
        }}
        onRow={onDoubleClick ? (record, index) => ({ onDoubleClick: () => onDoubleClick(record, index) }) : undefined}
        style={tableStyles}
      />
    </TableContainer>
  );
}

type TableDefaultProps = {
  data: any;
  columns: any[];
  length?: number;
  onPageChange?: any;
  onSizeChange?: any;
  refreshFn?: any;
  extraParams?: any;
  totalRecords: any;
  onDoubleClick?: any;
  [otherOptions: string | number | symbol]: unknown;
};
