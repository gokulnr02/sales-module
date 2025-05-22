"use client";
import { useReducer, useState, useCallback, useRef } from "react";
import EntryComponent from '../../forms/Item/Entrycomponent';
import TableComponent from "../../forms/Item/Table.component";
import CommonAPISave from "app/Components/CommonAPISave";
import showToast from '../../../utils/toastService';
import Sidebar from "../../Components/Sidebar";
import { ToastContainer } from "react-toastify";
import { RiMenuFold2Line, RiMenuFoldLine } from "react-icons/ri";
import ViewCard from "../../Components/helperComponents/ViewCard";
import { ItemContext } from "../../contexts/ItemContext";

const initialState = {
    itemcode: "",
    itemname: "",
    categorycode: "",
    categoryname: "",
    hsncode: "",
    taxcode: "",
    taxname: "",
    uomname: "",
    status: "Active"
};

const ItemMasterReducers = (state, action) => {
    switch (action.type) {
        case "RESET":
            return initialState;
        default:
            return {
                ...state,
                [action.type]: action.payload,
            };
    }
};

export default function ItemMaster() {
    const [state, dispatch] = useReducer(ItemMasterReducers, initialState);
    const [isOpen, setIsOpen] = useState(true);
    const [showEntry, setShowEntry] = useState(false);
    const [selectedRow, setselectedRow] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [isView, setIsView] = useState(false);

    const columns = [
        { key: "itemcode", label: "Item Code" },
        { key: "itemname", label: "Item Name" },
        { key: "categoryname", label: "Category Name" },
        { key: "hsncode", label: "HSN code" },
        { key: "taxname", label: "Tax Name" },
        { key: "uomname", label: "UOM Name" },
    ];

    const tableRef = useRef(null);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const pushSelectedToState = (row) => {
        Object.entries(row).forEach(([key, value]) => {
            dispatch({ type: key, payload: value });
        });
    };

    const saveItem = useCallback(async () => {
        if (!state.itemname) {
            showToast("Kindly enter the Item Name", "warn");
            return;
        } else if (!state.categorycode) {
            showToast("Kindly select the Category", "warn");
            return;
        } else if (!state.taxcode) {
            showToast("Kindly select the Tax", "warn");
            return;
        }else if (!state.uomname) {
            showToast("Kindly select the UOM", "warn");
            return;
        }else if (!state.hsncode) {
            showToast("Kindly enter the HSN code", "warn");
            return;
        }

        const res = await CommonAPISave({
            url: "/api/InsertItem",
            params: {...state, isEdit},
        });

        if (res.Output?.status?.code === 200) {
            showToast(res.Output.status.message, "success");
            dispatch({ type: "RESET" });
            tableRef.current.Refresh();
            setShowEntry(false);
        } else {
            showToast(res.Output.status.message, "warn");
        }
    }, [state]);

    return (
        <ItemContext.Provider
            value={{
                state, dispatch, saveItem,
                setShowEntry, setselectedRow,
                selectedRow, setIsEdit, setIsView,
                isEdit, isView, columns
            }}
        >
            <div className="flex h-screen bg-gray-100">
                <ToastContainer />
                <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
                <section className="flex-1 overflow-hidden relative">
                    <div className="sticky top-0 z-10 bg-gray-200 h-10 flex items-center px-2 text-black gap-2">
                        {isOpen ? (
                            <RiMenuFoldLine onClick={toggleSidebar} className="w-5 h-5 cursor-pointer" />
                        ) : (
                            <RiMenuFold2Line onClick={toggleSidebar} className="w-5 h-5 cursor-pointer" />
                        )}
                        <span className="text-sm font-medium">Item</span>
                    </div>

                    <section className="h-full overflow-y-auto px-2 pb-4">
                        {!showEntry && !isView && (
                            <div className="py-2 flex justify-end px-3">
                                <button
                                    className="bg-blue-400 px-4 py-2 rounded hover:bg-blue-500 text-sm font-semibold"
                                    onClick={() => {
                                        setShowEntry(true);
                                        setIsEdit(false);
                                        setIsView(false);
                                        dispatch({ type: "RESET" });
                                    }}
                                >
                                    Add New Item
                                </button>
                            </div>
                        )}

                        {showEntry && <EntryComponent />}

                        {!showEntry && isView && (
                            <ViewCard
                                title="Item Details"
                                onEdit={() => {
                                    if (selectedRow) {
                                        pushSelectedToState(selectedRow);
                                        setIsEdit(true);
                                        setShowEntry(true);
                                        setIsView(false);
                                    }
                                }}
                                onCancel={() => {
                                    setIsView(false);
                                    setselectedRow(null);
                                }}
                                onCreateNew={() => {
                                    setIsEdit(false);
                                    dispatch({ type: "RESET" });
                                    setShowEntry(true);
                                    setIsView(false);
                                }}
                                columns={columns}
                                selectedRow={state}
                            />
                        )}

                        <TableComponent ref={tableRef} />
                    </section>
                </section>
            </div>
        </ItemContext.Provider>
    );
}
