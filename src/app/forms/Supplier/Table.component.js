"use client";
import { useEffect, useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { useSupplier } from "../../contexts/SupplierContext";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from '@mui/icons-material/Refresh';
import CustomTable from "../../Components/helperComponents/CustomTable";
import CommonAPISave from "../../Components/CommonAPISave";


const TableComponent = forwardRef((props, ref) => {
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState('');

  const { setselectedRow, setShowEntry, setIsEdit, setIsView, dispatch, columns } = useSupplier();

  useImperativeHandle(ref, () => ({
    Refresh: () => {
      fetchSupplier();
    },
  }));
  const fetchSupplier = useCallback(async () => {
    try {
      const res = await CommonAPISave({
        url: "/api/getSupplier",
        params: {
          pageNumber: page,
          pageSize: rowsPerPage,
          search: searchText || "",
        },
      });

      setTableData(res?.Output?.data || []);
      setTotalCount(res?.Output?.totalCount || 0);
    } catch (error) {
      console.error("Error fetching Supplier:", error);
      setTableData([]);
    }
  }, [page, rowsPerPage, searchText]);


  useEffect(() => {
    fetchSupplier();
  }, [fetchSupplier]);


  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchText) fetchSupplier();
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchText, fetchSupplier]);


  const handleEdit = (row) => {
    setIsEdit(true);
    setIsView(false);
    setselectedRow(row);
    dispatch({ type: "customername", payload: row.customername });
    dispatch({ type: "suppliercode", payload: row.suppliercode });
    dispatch({ type: "address1", payload: row.address1 });
    dispatch({ type: "address2", payload: row.address2 });
    dispatch({ type: "address3", payload: row.address3 });
    dispatch({ type: "phonenumber", payload: row.phonenumber });
    dispatch({ type: "gstnumber", payload: row.gstnumber });
    dispatch({ type: "statecode", payload: row.statecode });
    dispatch({ type: "statename", payload: row.statename });
    dispatch({ type: "openingcredit", payload: row.openingcredit });
    dispatch({ type: "openingdebit", payload: row.openingdebit });
    dispatch({ type: "balance", payload: row.balance });
    dispatch({ type: "status", payload: row.status });
    setShowEntry(true);
  };


  const handleView = (row) => {
    setIsEdit(false);
    setIsView(true);
    setselectedRow(row);
    dispatch({ type: "customername", payload: row.customername });
    dispatch({ type: "suppliercode", payload: row.suppliercode });
    dispatch({ type: "address1", payload: row.address1 });
    dispatch({ type: "address2", payload: row.address2 });
    dispatch({ type: "address3", payload: row.address3 });
    dispatch({ type: "phonenumber", payload: row.phonenumber });
    dispatch({ type: "gstnumber", payload: row.gstnumber });
    dispatch({ type: "statecode", payload: row.statecode });
    dispatch({ type: "statename", payload: row.statename });
    dispatch({ type: "openingcredit", payload: row.openingcredit });
    dispatch({ type: "openingdebit", payload: row.openingdebit });
    dispatch({ type: "balance", payload: row.balance });
    dispatch({ type: "status", payload: row.status });
    setShowEntry(false);
    console.log("View", row);
  };


  return (
    <div className="p-2">
      <div className="flex justify-between w-full gap-4 mb-2 px-3">
        <h2 className="text-sm font-semibold text-gray-700  ">Supplier List  ({totalCount})
          <IconButton color="primary" title="Refresh" aria-label="Refresh" >
            <RefreshIcon fontSize="small" onClick={fetchSupplier} />
          </IconButton>
        </h2>

        <div className="w-[250px]">
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="EntryInputField100"
            placeholder="Search by name/code"
          />
        </div>
      </div>

      <CustomTable
        columns={columns}
        data={tableData}
        page={page - 1}
        rowsPerPage={rowsPerPage}
        setPage={(newPage) => setPage(newPage + 1)}
        setRowsPerPage={setRowsPerPage}
        onEdit={handleEdit}
        onView={handleView}
        totalCount={totalCount}
      />

    </div>
  );
});
TableComponent.displayName = "TableComponent";
export default TableComponent;
