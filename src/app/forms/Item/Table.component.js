"use client";
import { useEffect, useState, useCallback, useImperativeHandle ,forwardRef} from "react";
import { useItem } from "../../contexts/ItemContext";
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


  const { setselectedRow, setShowEntry, setIsEdit, setIsView, dispatch, columns } = useItem();

  useImperativeHandle(ref, () => ({
    Refresh: () => {
      fetchCategories();
    },
  }));
  const fetchCategories = useCallback(async () => {
    try {
      const res = await CommonAPISave({
        url: "/api/GetItems",
        params: {
          pageNumber: page,
          pageSize: rowsPerPage,
          search: searchText || "",
        },
      });

      setTableData(res?.Output?.data || []);
      setTotalCount(res?.Output?.totalCount || 0);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setTableData([]);
    }
  }, [page, rowsPerPage, searchText]);


  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);


  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchText) fetchCategories();
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchText, fetchCategories]);



  const handleEdit = (row) => {
    setIsEdit(true);
    setIsView(false);
    setselectedRow(row);
    dispatch({ type: "itemcode", payload: row.itemcode });
    dispatch({ type: "itemname", payload: row.itemname });
    dispatch({ type: "hsncode", payload: row.hsncode });
    dispatch({ type: "taxcode", payload: row.taxcode });
    dispatch({ type: "taxname", payload: row.taxname });
    dispatch({ type: "uomname", payload: row.uomname });
    dispatch({ type: "status", payload: row.status });
    dispatch({ type: "categorycode", payload: row.categorycode });
    dispatch({ type: "categoryname", payload: row.categoryname });
    setShowEntry(true);
  };



  const handleView = (row) => {
    setIsEdit(false);
    setIsView(true);
    setselectedRow(row);
    dispatch({ type: "itemcode", payload: row.itemcode });
    dispatch({ type: "itemname", payload: row.itemname });
    dispatch({ type: "hsncode", payload: row.hsncode });
    dispatch({ type: "taxcode", payload: row.taxcode });
    dispatch({ type: "taxname", payload: row.taxname });
    dispatch({ type: "uomname", payload: row.uomname });
    dispatch({ type: "status", payload: row.status });
    dispatch({ type: "categorycode", payload: row.categorycode });
    dispatch({ type: "categoryname", payload: row.categoryname });
    setShowEntry(false);
    console.log("View", row);
  };

 
  

  return (
    <div className="p-2">
      <div className="flex justify-between w-full gap-4 mb-2 px-3">
        <h2 className="text-sm font-semibold text-gray-700  ">Item List  ({totalCount})
          <IconButton  color="primary" title="Refresh" aria-label="Refresh" >
            <RefreshIcon fontSize="small" onClick={fetchCategories}/>
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
