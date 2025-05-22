"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Grid,
  IconButton,
} from "@mui/material";
import { useTax } from "../../contexts/TaxContext";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { MdClear } from "react-icons/md";

const EntryComponent = () => {
  const { state, dispatch, saveTax,setShowEntry } = useTax();
  console.log("EntryComponent state", state);

  const handleSave = () => {
    if (!state.taxname) {
      window.alert("Enter Tax Name");
      return;
    }
    saveTax();
  };

  const handleCancel = () => {
    dispatch({ type: "RESET" });
    setShowEntry(false)
    }
  

  return (
    <div className="p-4">
      <Card className="w-full mb-4">
        <CardHeader
          title={
            <h2 className="text-sm font-semibold text-gray-700 underline">
              Tax Entry
            </h2>
          }
          action={
            <div className="flex gap-2 items-center">
              <IconButton
                onClick={() => {dispatch({ type: "RESET" });}}
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
          <Grid container spacing={2}>
            {/* Tax Code */}
            <Grid item xs={12} sm={6} md={4}>
              <div className="w-full sm:w-[300px] relative">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Tax Code:
                </label>
                <input
                  value={state.taxcode}
                  disabled
                  placeholder="Auto-generated"
                  className="EntryInputField100 w-full bg-gray-100 text-gray-500 pr-8"
                />
              </div>
            </Grid>

            {/* Tax Name with Clear Button */}
            <Grid item xs={12} sm={6} md={4}>
              <div className="w-full sm:w-[300px] relative">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Tax Name:
                </label>
                <input
                  value={state.taxname}
                  onChange={(e) =>
                    dispatch({ type: "taxname", payload: e.target.value })
                  }
                  placeholder="Enter Tax Name"
                  className="EntryInputField100 w-full pr-8"
                />
                {state.taxname && (
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({ type: "taxname", payload: "" })
                      dispatch({ type: "taxcode", payload: "" })
                    }
                    }
                    className="absolute right-2 top-[31px] text-gray-500 hover:text-black flex "
                  >
                    <MdClear size={18} />
                  </button>
                )}
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <div className="w-full sm:w-[300px] relative">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Tax Percentage:
                </label>
                <input
                  value={state.taxpercentage}
                  onChange={(e) =>
                    dispatch({ type: "taxpercentage", payload: e.target.value })
                  }
                  placeholder="Enter Tax Percentage"
                  className="EntryInputField100 w-full pr-8"
                />
                {state.taxpercentage && (
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({ type: "taxpercentage", payload: "" })
                    }
                    }
                    className="absolute right-2 top-[31px] text-gray-500 hover:text-black flex "
                  >
                    <MdClear size={18} />
                  </button>
                )}
              </div>
            </Grid>

          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};

export default EntryComponent;
