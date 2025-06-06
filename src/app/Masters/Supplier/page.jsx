"use client";

import { useReducer, useState, useCallback, useRef } from "react";
import EntryComponent from "../../forms/Supplier/Entrycomponent";
import TableComponent from "../../forms/Supplier/Table.component";
import CommonAPISave from "app/Components/CommonAPISave";
import showToast from "../../../utils/toastService";
import { ToastContainer } from "react-toastify";
import { RiMenuFold2Line, RiMenuFoldLine } from "react-icons/ri";
import ViewCard from "../../Components/helperComponents/ViewCard";
import { SupplierContext } from "../../contexts/SupplierContext";
import { Plus } from 'lucide-react';

const initialState = {
    customername: "",
    suppliercode: "",
    address1: "",
    address2: "",
    address3: "",
    phonenumber: "",
    gstnumber: "",
    statecode: "",
    statename: "",
    openingcredit: "",
    openingdebit: "",
    balance: "",
    status: "Active",
};

const reducer = (state, action) => {
    switch (action.type) {
        case "RESET":
            return initialState;
        default:
            return { ...state, [action.type]: action.payload };
    }
};

export default function SupplierMaster() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [isOpen, setIsOpen] = useState(true);
    const [showEntry, setShowEntry] = useState(false);
    const [selectedRow, setselectedRow] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [isView, setIsView] = useState(false);

    const tableRef = useRef(null);

    const columns = [
        { key: "suppliercode", label: "Supplier Code" },
        { key: "customername", label: "Supplier Name" },
        { key: "address1", label: "Address 1" },
        { key: "address2", label: "Address 2" },
        { key: "address3", label: "Address 3" },
        { key: "phonenumber", label: "Phone No" },
        { key: "gstnumber", label: "GST No" },
        { key: "openingcredit", label: "OP Debit Balance" },
        { key: "openingdebit", label: "OP Credit Balance" },
        { key: "balance", label: "Balance" },
    ];

    const toggleSidebar = () => setIsOpen(!isOpen);

    const saveSupplier = useCallback(async () => {
        const res = await CommonAPISave({
            url: "/api/InsertSupplier",
            params: { ...state, isEdit },
        });

        if (res?.Output?.status?.code === 200) {
            showToast(res.Output.status.message, "success");
            dispatch({ type: "RESET" });
            tableRef.current?.Refresh(); // safer
            setShowEntry(false);
        } else {
            showToast(res.Output.status.message || "Error occurred", "warn");
        }
    }, [state, isEdit]);

    return (
        <SupplierContext.Provider
            value={{
                state,
                dispatch,
                saveSupplier,
                setShowEntry,
                setselectedRow,
                selectedRow,
                setIsEdit,
                setIsView,
                isEdit,
                isView,
                columns,
            }}
        >
            <div className="flex h-screen">
                <ToastContainer />
                <section className="flex-1 overflow-hidden relative">
                    <section className="h-full overflow-y-auto px-2 pb-4">
                        {!showEntry && !isView && (
                            <div className="py-2 flex justify-end px-3">
                                <button
                                    className="flex items-center gap-2 border border-gray-800 rounded px-3 py-1 text-sm font-medium hover:bg-gray-100"
                                    onClick={() => {
                                        setShowEntry(true);
                                        setIsEdit(false);
                                        setIsView(false);
                                        dispatch({ type: "RESET" });
                                    }}
                                >
                                    <Plus size={16} /> Add Customer
                                </button>

                            </div>
                        )}

                        {showEntry && <EntryComponent />}

                        {!showEntry && isView && (
                            <ViewCard
                                title="Supplier Details"
                                onEdit={() => {
                                    setIsEdit(true);
                                    setShowEntry(true);
                                    setIsView(false);
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
                                selectedRow={state}
                                columns={columns}
                            />
                        )}

                        <TableComponent ref={tableRef} />
                    </section>
                </section>
            </div>
        </SupplierContext.Provider>
    );
}
