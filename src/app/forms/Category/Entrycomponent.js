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
import { useCategory } from "../../contexts/CategoryContext";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { MdClear } from "react-icons/md";

const EntryComponent = () => {
  const { state, dispatch, saveCategory,setShowEntry } = useCategory();
  console.log("EntryComponent state", state);

  const handleSave = () => {
    if (!state.categoryname) {
      window.alert("Enter Category Name");
      return;
    }
    saveCategory();
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
              Category Entry
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
            {/* Category Code */}
            <Grid item xs={12} sm={6} md={4}>
              <div className="w-full sm:w-[300px] relative">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Category Code:
                </label>
                <input
                  value={state.categorycode}
                  disabled
                  placeholder="Auto-generated"
                  className="EntryInputField100 w-full bg-gray-100 text-gray-500 pr-8"
                />
              </div>
            </Grid>

            {/* Category Name with Clear Button */}
            <Grid item xs={12} sm={6} md={4}>
              <div className="w-full sm:w-[300px] relative">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Category Name:
                </label>
                <input
                  value={state.categoryname}
                  onChange={(e) =>
                    dispatch({ type: "categoryname", payload: e.target.value })
                  }
                  placeholder="Enter Category Name"
                  className="EntryInputField100 w-full pr-8"
                />
                {state.categoryname && (
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({ type: "categoryname", payload: "" })
                      dispatch({ type: "categorycode", payload: "" })
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
