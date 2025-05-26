"use client";
import { useReducer, useState, useCallback, useRef } from "react";
import EntryComponent from '../../forms/Category/Entrycomponent';
import TableComponent from "../../forms/Category/Table.component";
import CommonAPISave from "app/Components/CommonAPISave";
import showToast from '../../../utils/toastService';
import { ToastContainer } from "react-toastify";
import { RiMenuFold2Line, RiMenuFoldLine } from "react-icons/ri";
import ViewCard from "../../Components/helperComponents/ViewCard";
import { CategoryContext } from "../../contexts/CategoryContext"; 

const initialState = {
    categorycode: "",
    categoryname: "",
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

export default function CategoryMaster() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [isOpen, setIsOpen] = useState(true);
    const [showEntry, setShowEntry] = useState(false);
    const [selectedRow, setselectedRow] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [isView, setIsView] = useState(false);

    const columns = [
        { key: "categorycode", label: "Category Code" },
        { key: "categoryname", label: "Category Name" },
      ];

    const tableRef = useRef(null);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const saveCategory = useCallback(async () => {
        const res = await CommonAPISave({
            url: "/api/createCategory",
            params: state,
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
        <CategoryContext.Provider
            value={{
                state, dispatch, saveCategory,
                setShowEntry, setselectedRow,
                selectedRow, setIsEdit, setIsView,
                isEdit, isView,columns
            }}
        >
            <div className="flex h-screen bg-gray-100">
                <ToastContainer />
                <section className="flex-1 overflow-hidden relative">
                    

                    <section className="h-full overflow-y-auto px-2 pb-4">
                        {!showEntry && !isView && (
                            <div className="py-2 flex justify-end px-3">
                                <button
                                    className="bg-blue-400  px-4 py-2 rounded hover:bg-blue-500 text-sm font-semibold"
                                    onClick={() => {
                                        setShowEntry(true);
                                        setIsEdit(false);
                                        setIsView(false);
                                        dispatch({ type: "RESET" });
                                    }}
                                >
                                    Add New Category
                                </button>
                            </div>
                        )}

                        {showEntry && <EntryComponent />}
                        {!showEntry && isView && (
                            <ViewCard
                                title="Category Details"
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
        </CategoryContext.Provider>
    );
}
