"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  IconButton,
} from "@mui/material";
import { useSupplier } from "../../contexts/SupplierContext";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CommonAPISave from "../../Components/CommonAPISave";
import { MdClear } from "react-icons/md";

const EntryComponent = () => {
  const { state, dispatch, saveSupplier, setShowEntry,selectedRow ,isEdit} = useSupplier();
  const [StateSelect, setStateSelect] = useState([]);
  const StaeRef = useRef(null);
  console.log("EntryComponent state", state);

  const handleSave = () => {
    saveSupplier();
  };


  const handleCancel = () => {
    dispatch({ type: "RESET" });
    setShowEntry(false)
  }

  const dropDownSelect = async (endPoint, TablePagination) => {
    const url = `/api/${endPoint}`;
    const params = {
      status: 'Active',
      pageNumber: TablePagination.pageNumber,
      pageSize: TablePagination.pageSize
    }
    await CommonAPISave({ url, params }).then((res) => {
      if (res.Output.status.code && res.Output.data.length > 0) {
        const data = res.Output.data
        if (endPoint == 'GetStates') {
          setStateSelect(data)
        }
      }
    })
  }

  useEffect(() => { 
    if(isEdit && selectedRow){
      setStateSelect([
        { statecode: selectedRow.statecode, statename: selectedRow.statename }
      ])
    }
  },[isEdit, selectedRow])

  return (
    <div className="p-4">
      <Card className="w-full mb-4">
        <CardHeader
          title={
            <h2 className="text-sm font-semibold text-gray-700 underline">
              Supplier Entry
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
                Save
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
          <div className="w-full h-[235px] p-2 pt-4">
            <div className="w-full flex justify-start items-center flex-wrap gap-[10px]">

              {[
                { label: 'Supplier Code:', field: 'suppliercode', placeholder: 'Enter Supplier Code' },
                { label: 'Supplier Name:', field: 'customername', placeholder: 'Enter Supplier Name' },
                { label: 'Address 1:', field: 'address1', placeholder: 'Enter Address 1' },
                { label: 'Address 2:', field: 'address2', placeholder: 'Enter Address 2' },
                { label: 'Address 3:', field: 'address3', placeholder: 'Enter Address 3' },
                { label: 'Phone No:', field: 'phonenumber', placeholder: 'Enter Phone No' },
                { label: 'GST No:', field: 'gstnumber', placeholder: 'Enter GST No' },
                { label: 'OP Credit Balance:', field: 'openingcredit', placeholder: 'Enter OP Credit Balance' },
                { label: 'OP Debit Balance:', field: 'openingdebit', placeholder: 'Enter OP Debit Balance' }
              ].map(({ label, field, placeholder }) => (
                <div key={field} className="relative w-[calc(25%-10px)] h-auto flex flex-col justify-start items-start gap-[6px]">
                  <label className="w-full text-xs">{label}</label>
                  <div className="relative w-full">
                    <input
                      type="text"
                      className="EntryInputField100 pr-8"
                      placeholder={placeholder}
                      value={state[field]}
                      onChange={(e) => dispatch({ type: field, payload: e.target.value })}
                    />
                    {state[field] && (
                      <span
                        onClick={() => dispatch({ type: field, payload: '' })}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 cursor-pointer"
                      >
                        <MdClear />
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {/* State dropdown field */}
              <div className="relative w-[calc(25%-10px)] h-auto flex flex-col justify-start items-start gap-[4px]">
                <label className="w-full text-sm">State Name:</label>
                <div className="relative w-full">
                  <select
                    ref={StaeRef}
                    className="InputStyle w-full pr-8 appearance-none"
                    value={state.statename}
                    onClick={() => dropDownSelect('GetStates', { pageNumber: 1, pageSize: 10 })}
                    onChange={(e) => {
                      const selected = StateSelect.find(item => item.statename === e.target.value);
                      dispatch({ type: "statename", payload: e.target.value });
                      dispatch({ type: "statecode", payload: selected?.statecode || "" });
                    }}
                  >
                    <option value="">Select State</option>
                    {StateSelect.map((item) => (
                      <option key={item.statecode} value={item.statename}>
                        {item.statename}
                      </option>
                    ))}
                  </select>
                  {state.statename && (
                    <span
                      onClick={() => {
                        dispatch({ type: "statename", payload: "" });
                        dispatch({ type: "statecode", payload: "" });
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 cursor-pointer"
                    >
                      <MdClear />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EntryComponent;
