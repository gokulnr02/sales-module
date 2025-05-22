"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  IconButton,
} from "@mui/material";
import { useItem } from "../../contexts/ItemContext";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CommonAPISave from "../../Components/CommonAPISave";
import { MdClear } from "react-icons/md";

const EntryComponent = () => {
  const { state, dispatch, saveItem, setShowEntry, selectedRow, isEdit } = useItem();
  const [Categories, setCategories] = useState([]);
  const [Taxes, setTaxes] = useState([])
  console.log("EntryComponent state", state);

  const handleSave = () => {
    saveItem();
  };

  const categoryRef = useRef(null);
  const taxRef = useRef(null);

  const handleCancel = () => {
    dispatch({ type: "RESET" });
    setShowEntry(false)
  }

  // Autofill from selectedRow on edit
  useEffect(() => {
    if (isEdit && selectedRow) {
      setTaxes([{
        "taxcode": selectedRow.taxcode,
        "taxname": selectedRow.taxname,
      }]);
      setCategories([{
        "categorycode": selectedRow.categorycode,
        "categoryname": selectedRow.categoryname,
      }]);
    }
  }, [isEdit, selectedRow]);

  const dropDownSelect = async (endPoint, TablePagination) => {
    const url = `/api/${endPoint}`;
    const params = {
      status: 'Active',
      pageNumber: TablePagination.pageNumber,
      pageSize: TablePagination.pageSize
    };
    await CommonAPISave({ url, params }).then((res) => {
      if (res.Output.status.code && res.Output.data.length > 0) {
        const data = res.Output.data;
        if (endPoint === 'GetCategories') {
          setCategories(data);
          // Focus the select
          categoryRef.current?.focus();
        } else if (endPoint === 'GetTaxes') {
          setTaxes(data);
          taxRef.current?.focus();
        }
      }
    });
  };

  return (
    <div className="p-4">
      <Card className="w-full mb-4">
        <CardHeader
          title={
            <h2 className="text-sm font-semibold text-gray-700 underline">
              Item Entry
            </h2>
          }
          action={
            <div className="flex gap-2 items-center">
              <IconButton
                onClick={() => { dispatch({ type: "RESET" }); }}
                color="primary"
                size="small"
                title="Reset"
                aria-label="Reset"
              >
                <RestartAltIcon fontSize="small" />
              </IconButton>
              <Button
                onClick={handleSave}
                variant="contained"
                color="success"
                size="small"
                startIcon={<SaveIcon />}
              >
                {isEdit ? "Update" : "Save"}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outlined"
                color="error"
                size="small"
                startIcon={<CancelIcon />}
              >
                Cancel
              </Button>

            </div>
          }
          sx={{ paddingBottom: 1 }}
        />
        <CardContent>
          <div className="w-full flex justify-start items-center flex-wrap gap-[10px]">

            {/* Item Code */}
            <div className="relative w-[calc(25%-10px)] flex flex-col gap-[6px]">
              <label className="text-xs">Item Code:</label>
              <div className="relative w-full">
                <input
                  type="number"
                  className="EntryInputField100 pr-8 w-full  text-gray-500"
                  placeholder="Enter Item Code"
                  value={state.itemcode}
                  // disabled
                  onChange={(e) =>
                    dispatch({ type: "itemcode", payload: e.target.value })
                  }
                />
                {state.itemcode && (
                  <span
                    onClick={() => dispatch({ type: "itemcode", payload: "" })}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 cursor-pointer"
                  >
                    <MdClear />
                  </span>
                )}
              </div>
            </div>

            {/* Item Name */}
            <div className="relative w-[calc(25%-10px)] flex flex-col gap-[6px]">
              <label className="text-xs">Item Name:</label>
              <div className="relative w-full">
                <input
                  type="text"
                  className="EntryInputField100 pr-8 w-full"
                  placeholder="Enter Item Name"
                  value={state.itemname}
                  onChange={(e) =>
                    dispatch({ type: "itemname", payload: e.target.value })
                  }
                />
                {state.itemname && (
                  <span
                    onClick={() => {
                      dispatch({ type: "itemname", payload: "" });
                      dispatch({ type: "itemcode", payload: "" });
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 cursor-pointer"
                  >
                    <MdClear />
                  </span>
                )}
              </div>
            </div>

            {/* Category Name */}
            <div className="relative w-[calc(25%-10px)] flex flex-col gap-[6px]">
              <label className="text-xs">Category Name:</label>
              <div className="relative w-full">
                <select
                  ref={categoryRef}
                  className="EntryInputField100 pr-8 w-full appearance-none"
                  value={state.categoryname}
                  onChange={(e) => {
                    const selectedCategory = Categories.find(item => item.categoryname === e.target.value);
                    dispatch({ type: "categoryname", payload: e.target.value });
                    dispatch({
                      type: "categorycode",
                      payload: selectedCategory ? selectedCategory.categorycode : "",
                    });
                  }}
                  onClick={() => {
                    dropDownSelect("GetCategories", { pageNumber: 1, pageSize: 10 });
                  }}
                >
                  <option value="">Select Category</option>
                  {Categories.map((item) => (
                    <option key={item.categoryname} value={item.categoryname}>
                      {item.categoryname}
                    </option>
                  ))}
                </select>
                {state.categoryname && (
                  <span
                    onClick={() => {
                      dispatch({ type: "categoryname", payload: "" });
                      dispatch({ type: "categorycode", payload: "" });
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 cursor-pointer"
                  >
                    <MdClear />
                  </span>
                )}
              </div>
            </div>


            {/* HSN Code */}
            <div className="relative w-[calc(25%-10px)] flex flex-col gap-[6px]">
              <label className="text-xs">HSN Code:</label>
              <div className="relative w-full">
                <input
                  type="text"
                  className="EntryInputField100 pr-8 w-full"
                  placeholder="Enter HSN Code"
                  value={state.hsncode}
                  onChange={(e) =>
                    dispatch({ type: "hsncode", payload: e.target.value })
                  }
                />
                {state.hsncode && (
                  <span
                    onClick={() => dispatch({ type: "hsncode", payload: "" })}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 cursor-pointer"
                  >
                    <MdClear />
                  </span>
                )}
              </div>
            </div>

            {/* Tax Name */}
            <div className="relative w-[calc(25%-10px)] flex flex-col gap-[6px]">
              <label className="text-xs">Tax Name:</label>
              <div className="relative w-full">
                <select
                  ref={taxRef}
                  className="EntryInputField100 pr-8 w-full appearance-none"
                  value={state.taxname}
                  onChange={(e) => {
                    const selectedTax = Taxes.find(item => item.taxname === e.target.value);
                    dispatch({ type: "taxname", payload: e.target.value });
                    dispatch({
                      type: "taxcode",
                      payload: selectedTax ? selectedTax.taxcode : "",
                    });
                  }}
                  onClick={() => {
                    dropDownSelect("GetTaxes", { pageNumber: 1, pageSize: 10 });
                  }}
                >
                  <option value="">Select Tax</option>
                  {Taxes.map((item) => (
                    <option key={item.taxcode} value={item.taxname}>
                      {item.taxname}
                    </option>
                  ))}
                </select>
                {state.taxname && (
                  <span
                    onClick={() => {
                      dispatch({ type: "taxname", payload: "" });
                      dispatch({ type: "taxcode", payload: "" });
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 cursor-pointer"
                  >
                    <MdClear />
                  </span>
                )}
              </div>
            </div>


            {/* UOM Name */}
            <div className="relative w-[calc(25%-10px)] flex flex-col gap-[6px]">
              <label className="text-xs">UOM Name:</label>
              <div className="relative w-full">
                <input
                  type="text"
                  className="EntryInputField100 pr-8 w-full"
                  placeholder="Enter UOM Name"
                  value={state.uomname}
                  onChange={(e) =>
                    dispatch({ type: "uomname", payload: e.target.value })
                  }
                />
                {state.uomname && (
                  <span
                    onClick={() => dispatch({ type: "uomname", payload: "" })}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 cursor-pointer"
                  >
                    <MdClear />
                  </span>
                )}
              </div>
            </div>
          </div>

        </CardContent>

      </Card>
    </div>
  );
};

export default EntryComponent;
