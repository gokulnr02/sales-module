"use client";
import { useEffect, useState, useCallback, useImperativeHandle ,forwardRef} from "react";
import { useTax } from "../../contexts/TaxContext";
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


  const { setselectedRow, setShowEntry, setIsEdit, setIsView, dispatch ,columns} = useTax();

  useImperativeHandle(ref, () => ({
    Refresh: () => {
      fetchTax();
    },
  }));
  const fetchTax = useCallback(async () => {
    try {
      const res = await CommonAPISave({
        url: "/api/GetTaxes",
        params: {
          pageNumber: page,
          pageSize: rowsPerPage,
          search: searchText || "",
        },
      });

      setTableData(res?.Output?.data || []);
      setTotalCount(res?.Output?.totalCount || 0);
    } catch (error) {
      console.error("Error fetching Tax:", error);
      setTableData([]);
    }
  }, [page, rowsPerPage, searchText]);


  useEffect(() => {
    fetchTax();
  }, [fetchTax]);


  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchText) fetchTax();
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchText, fetchTax]);

  const handleEdit = (row) => {
    setIsEdit(true);
    setIsView(false);
    setselectedRow(row);
    dispatch({ type: "taxcode", payload: row.taxcode });
    dispatch({ type: "taxname", payload: row.taxname });
    dispatch({ type: "taxpercentage", payload: row.taxpercentage });
    setShowEntry(true);
  };

  const handleView = (row) => {
    setIsEdit(false);
    setIsView(true);
    setselectedRow(row);
    dispatch({ type: "taxcode", payload: row.taxcode });
    dispatch({ type: "taxname", payload: row.taxname });
    dispatch({ type: "taxpercentage", payload: row.taxpercentage });
    setShowEntry(false);
    console.log("View", row);
  };

  return (
    <div className="p-2">
      <div className="flex justify-between w-full gap-4 mb-2 px-3">
        <h2 className="text-sm font-semibold text-gray-700  ">Tax List  ({totalCount})
          <IconButton  color="primary" title="Refresh" aria-label="Refresh" >
            <RefreshIcon fontSize="small" onClick={fetchTax}/>
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
