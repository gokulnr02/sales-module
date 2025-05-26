"use client";
import { useState, useReducer, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { X, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";
import { MdClear } from "react-icons/md";
import { IoFolderOutline } from "react-icons/io5";
import { HiBars3BottomLeft } from "react-icons/hi2";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import showToast from '../../../utils/toastService';
import { ToastContainer } from "react-toastify";
import { SlHome } from "react-icons/sl";
import CommonAPISave from "app/Components/CommonAPISave";
import { RiMenuFold2Line } from "react-icons/ri";
import { RiMenuFoldLine } from "react-icons/ri";
import Sidebar from "../../Components/Sidebar";

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

const initialState = {
    CustomerCode: "",
    CustomerName: "",
    Address1: "",
    Address2: "",
    PhoneNo: "",
    PurchaseNo: "",
    PurchaseDate: new Date().toISOString().split("T")[0],
    PurchaseRefNo: "",
    ItemCode: "",
    ItemName: "",
    Description: "",
    Qty: "",
    UOM: "",
    Rate: "",
    Total: "",
    GrandTotal: "",
    Remarks: "",
    TaxCode: "",
    TaxName: "",
    TaxValue: "",
    RoundOff: "",
    FreightCharge: "",
    InvoiceTotal: "",
};

const ItemMaster = () => {
    const [isOpen, setIsOpen] = useState(true);
    const toggleSidebar = () => setIsOpen(!isOpen);
    const supplierRef = useRef();

    const [state, dispatch] = useReducer(ItemMasterReducers, initialState);

    const [tableData, setTableData] = useState([]);
    console.log(tableData, 'tableData')

    const [ItemSelect, setItemSelect] = useState([])
    const [CustomerSelect, setCustomerSelect] = useState([]);
    const [TaxSelect, setTaxSelect] = useState([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleAddRow = () => {
        const newRow = {
            id: tableData.length + 1,
            ItemName: "",
            ItemCode: "",
            Description: "",
            Qty: "",
            UOM: "",
            Rate: "",
            Total: ""
        };
        setTableData([...tableData, newRow]);
    };


    const dropDownSelect = async (endPoint, TablePagination, index) => {
        const url = `/api/${endPoint}`;
        const params = {
            status: 'Active',
            pageNumber: TablePagination.pageNumber,
            pageSize: TablePagination.pageSize
        }
        await CommonAPISave({ url, params }).then((res) => {
            if (res.Output.status.code && res.Output.data.length > 0) {
                const data = res.Output.data
                if (endPoint == 'GetItems') {
                    setItemSelect(data)
                } else if (endPoint == 'getSupplier') {
                    setCustomerSelect(data)
                } else if (endPoint == 'GetTaxes') {
                    setTaxSelect(data)
                }
            }
        })
    }
    useEffect(() => {
        const GrandTotal = tableData.reduce((acc, row) =>
            row.Total ? acc + Number(row.Total) : acc, 0
        );

        dispatch({ type: "GrandTotal", payload: GrandTotal || "" });
    }, [tableData]);


    const handleFileGenerate = async (type) => {
        const url = '/api/fileGenerate';
        const stateValues = { CustomerCode: state.CustomerCode, CustomerName: state.CustomerName, Address1: state.Address1, Address2: state.Address2, PhoneNo: state.PhoneNo, PurchaseNo: state.PurchaseNo, PurchaseDate: state.PurchaseDate, PurchaseRefNo: state.PurchaseRefNo, GrandTotal: state.GrandTotal, Remarks: state.Remarks, TaxValue: state.TaxValue, FreightCharge: state.FreightCharge, RoundOff: state.RoundOff, InvoiceTotal: state.InvoiceTotal }
        const params = { state: stateValues, tableData, type };

        try {
            const res = await CommonAPISave({ url, params });

            if (res.Output.status.code == 200 && res.Output.data.pdfBuffer) {
                let pdfbuffer = res.Output.data.pdfBuffer;

                // Convert from a stringified array if necessary
                if (typeof pdfbuffer === "string") {
                    pdfbuffer = pdfbuffer.split(",").map(Number);
                }

                const byteArray = new Uint8Array(pdfbuffer);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const pdfUrl = URL.createObjectURL(blob);
                const uniqueFileName = `invoice_${Date.now()}.pdf`;

                if (type === 'print') {
                    window.open(pdfUrl, '_blank');
                } else if (type === 'download') {
                    const link = document.createElement('a');
                    link.href = pdfUrl;
                    link.download = uniqueFileName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            } else {
                console.error('PDF buffer is missing or response is incorrect');
            }
        } catch (error) {
            console.error('Error generating file:', error);
        }
    };


    const ValidateFunction = () => {
        saveFunction();
        supplierRef.current?.focus();
  
    }

    const getPurchaseNo = async () => {
        const url = '/api/purchasenumber';
        const params = {}
        await CommonAPISave({ url, params }).then((res) => {
            if (res.Output.status.code && res.Output.data.length > 0) {
                const data = res.Output.data
                dispatch({ type: "PurchaseNo", payload: data })
            }
        })
    }
    useEffect(() => {
        getPurchaseNo();
    }, [])

    const saveFunction = useCallback(async () => {
        const url = '/api/InsertPurchase';
        const stateValues = { CustomerCode: state.CustomerCode, CustomerName: state.CustomerName, Address1: state.Address1, Address2: state.Address2, PhoneNo: state.PhoneNo, PurchaseNo: state.PurchaseNo, PurchaseDate: state.PurchaseDate, PurchaseRefNo: state.PurchaseRefNo, GrandTotal: state.GrandTotal, Remarks: state.Remarks }
        const params = { state: stateValues, tableData };
        await CommonAPISave({ url, params }).then((res) => {
            if (res.Output && res.Output.status.code == 200 && res.Output.data.length > 0) {
                // const data = res.Output.data
                showToast(res.Output.status.message, "success");
                dispatch({type:"RESET"})
                setTableData([]);
                getPurchaseNo();
            } else {
                showToast(res.Output.status.message, "warn")
            }
        })

    }, [state]);

    useEffect(() => {
        const grandTotal = tableData.reduce((sum, row) => {
            const qty = parseFloat(row.Qty) || 0;
            const rate = parseFloat(row.Rate) || 0;
            const total = qty * rate;
            return sum + total;
        }, 0);

        const taxValue = parseFloat(state.TaxValue) || 0;
        const freight = parseFloat(state.FreightCharge) || 0;

        const taxAmount = (grandTotal * taxValue) / 100;
        const rawTotal = grandTotal + taxAmount + freight;

        const roundedInvoice = Math.round(rawTotal);
        const roundOff = (roundedInvoice - rawTotal).toFixed(2);
        const invoiceTotal = (rawTotal + parseFloat(roundOff)).toFixed(2);

        dispatch({ type: "GrandTotal", payload: grandTotal.toFixed(2) });
        dispatch({ type: "RoundOff", payload: roundOff });
        dispatch({ type: "InvoiceTotal", payload: invoiceTotal });
    }, [tableData, state.TaxValue, state.FreightCharge]);

    useEffect(() => {
        supplierRef.current?.focus();
    }, []);

    return (
        <div className="flex h-screen">
            <ToastContainer />
           
            {/* Main Content Area */}
            <section className="flex-1 h-full">
               
                <div className="w-full h-36 flex justify-between items-start p-2">
                    <div className="w-[280px] h-full flex flex-col gap-2 justify-start items-start">
                        <div className="relative w-full h-[28px] flex justify-start items-center">
                            <label className="w-[100px] h-full flex justify-start items-center text-xs">Supplier :</label>
                            <div className="relative w-full">
                                <select
                                    ref={supplierRef}
                                    className="InputStyle w-full pr-8 appearance-none"
                                    value={state.CustomerName}
                                    onClick={() => { dropDownSelect('getSupplier', { pageNumber: 1, pageSize: 10 }) }}
                                    onChange={(e) => {
                                        const selectedCustomer = CustomerSelect.find(item => item.customername === e.target.value);
                                        dispatch({ type: "CustomerName", payload: e.target.value });
                                        dispatch({ type: "CustomerCode", payload: selectedCustomer ? selectedCustomer.suppliercode : "" });
                                        dispatch({ type: "Address1", payload: selectedCustomer ? selectedCustomer.address1 : "" });
                                        dispatch({ type: "Address2", payload: selectedCustomer ? selectedCustomer.address2 : "" });
                                        dispatch({ type: "Address3", payload: selectedCustomer ? selectedCustomer.address3 : "" });
                                        dispatch({ type: "PhoneNo", payload: selectedCustomer ? selectedCustomer.phonenumber : "" });

                                    }}
                                >
                                    <option value="">Select Supplier</option>
                                    {CustomerSelect.map((item, index) => (
                                        <option key={index} value={item.customername}>
                                            {item.customername}
                                        </option>
                                    ))}
                                </select>

                                {state.CustomerName && (
                                    <span
                                        onClick={() => {
                                            dispatch({ type: "CustomerName", payload: "" });
                                            dispatch({ type: "CustomerCode", payload: "" });
                                            dispatch({ type: "Address1", payload: "" });
                                            dispatch({ type: "Address2", payload: "" });
                                            dispatch({ type: "Address3", payload: "" });
                                            dispatch({ type: "PhoneNo", payload: "" });
                                        }}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 cursor-pointer"
                                    >
                                        <MdClear />
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="relative w-full h-[28px] flex justify-start items-center">
                            <label className="w-[100px] h-full flex justify-start items-center text-xs">Address 1 :</label>
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    className="EntryInput2Field100 pr-8"
                                    value={state.Address1}
                                    readOnly
                                    onChange={(e) => dispatch({ type: "Address1", payload: e.target.value })}
                                />
                                {state.Address1 && (
                                    <span
                                        onClick={() => dispatch({ type: "Address1", payload: "" })}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 cursor-pointer"
                                    >
                                        <MdClear />
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="relative w-full h-[28px] flex justify-start items-center">
                            <label className="w-[100px] h-full flex justify-start items-center text-xs">Address 2 :</label>
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    className="EntryInput2Field100 pr-8"
                                    value={state.Address2}
                                    readOnly
                                    onChange={(e) => dispatch({ type: "Address2", payload: e.target.value })}
                                />
                                {state.Address2 && (
                                    <span
                                        onClick={() => dispatch({ type: "Address2", payload: "" })}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 cursor-pointer"
                                    >
                                        <MdClear />
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="relative w-full h-[28px] flex justify-start items-center">
                            <label className="w-[100px] h-full flex justify-start items-center text-xs">Phone No :</label>
                            <div className="relative w-full">
                                <input
                                    type="number"
                                    className="EntryInput2Field100 pr-8"
                                    value={state.PhoneNo}
                                    readOnly
                                    onChange={(e) => dispatch({ type: "PhoneNo", payload: e.target.value })}
                                />
                                {state.PhoneNo && (
                                    <span
                                        onClick={() => dispatch({ type: "PhoneNo", payload: "" })}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 cursor-pointer"
                                    >
                                        <MdClear />
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>


                    <div className="w-[320px] h-full flex flex-col gap-2 justify-start items-start">
                        <div className="w-full h-[28px] flex justify-start items-center">
                            <label className="w-[170px] h-full flex justify-start items-center text-xs">Purchase No :</label>
                            <div className="w-full">
                                <input
                                    type="number"
                                    className="EntryInput2Field100 pr-8"
                                    value={state.PurchaseNo}
                                    onChange={(e) => dispatch({ type: "PurchaseNo", payload: e.target.value })}
                                // readOnly
                                />
                            </div>
                        </div>

                        <div className="w-full h-[28px] flex justify-start items-center">
                            <label className="w-[170px] h-full flex justify-start items-center text-xs">Purchase Date :</label>
                            <div className="w-full">
                                <input
                                    type="date"
                                    className="EntryInput2Field100 pr-8"
                                    value={state.PurchaseDate}
                                    onChange={(e) => dispatch({ type: "PurchaseDate", payload: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="w-full h-[28px] flex justify-start items-center">
                            <label className="w-[170px] h-full flex justify-start items-center text-xs">Purchase Ref No :</label>
                            <div className="w-full">
                                <input
                                    type="number"
                                    className="EntryInput2Field100 pr-8"
                                    value={state.PurchaseRefNo}
                                    onChange={(e) => dispatch({ type: "PurchaseRefNo", payload: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>


                {/* Table Section */}
                <div className="w-full p-2 overflow-auto height330">
                    <TableContainer component={Paper}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>S.No</TableCell>
                                    <TableCell>Item Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Qty</TableCell>
                                    <TableCell>UOM</TableCell>
                                    <TableCell>Rate</TableCell>
                                    <TableCell>Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableData.map((row, index) => (
                                    <TableRow key={row.id}>
                                        <TableCell className="px-10">{index + 1}</TableCell>
                                        <TableCell className="TableInputTD">
                                            <select
                                                className="TableItemInput"
                                                value={row.ItemName}
                                                onClick={() => { dropDownSelect('GetItems', { pageNumber: 1, pageSize: 10 }, index) }}
                                                onChange={(e) => {
                                                    const selectedItem = ItemSelect.find(item => item.itemname === e.target.value);
                                                    const updatedData = [...tableData];
                                                    updatedData[index] = {
                                                        ...updatedData[index],
                                                        ItemName: e.target.value,
                                                        ItemCode: selectedItem ? selectedItem.itemcode : "",
                                                        UOM: selectedItem ? selectedItem.uomname : ""
                                                    };
                                                    setTableData(updatedData);
                                                }}
                                            >
                                                <option value="">Select Item</option>
                                                {ItemSelect.map((item) => (
                                                    <option key={item.itemcode} value={item.itemname}>
                                                        {item.itemname}
                                                    </option>
                                                ))}
                                            </select>
                                        </TableCell>
                                        <TableCell className="TableInputTD">
                                            <input
                                                type="text"
                                                className="TableInput"
                                                value={row.Description}
                                                onChange={(e) => {
                                                    const updatedData = [...tableData];
                                                    updatedData[index].Description = e.target.value;
                                                    setTableData(updatedData);
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell className="TableInputTD">
                                            <input
                                                type="text"
                                                className="TableInput"
                                                value={row.Qty}
                                                onChange={(e) => {
                                                    const updatedData = [...tableData];
                                                    updatedData[index].Qty = e.target.value;
                                                    setTableData(updatedData);
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell className="TableInputTD">
                                            <input
                                                type="text"
                                                className="TableInput"
                                                value={row.UOM}
                                            // onChange={(e) => {
                                            //     const updatedData = [...tableData];
                                            //     updatedData[index].UOM = e.target.value;
                                            //     setTableData(updatedData);
                                            // }}
                                            />
                                        </TableCell>
                                        <TableCell className="TableInputTD">
                                            <input
                                                type="text"
                                                className="TableInput"
                                                value={row.Rate}
                                                onChange={(e) => {
                                                    const updatedData = [...tableData];
                                                    updatedData[index].Rate = e.target.value;
                                                    updatedData[index].Total = (row.Qty && row.Rate) ? Number(row.Qty || 0) * Number(row.Rate || 0) : 0;
                                                    setTableData(updatedData);
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell className="TableInputTD">
                                            <input
                                                type="text"
                                                className="TableInput"
                                                value={row.Total}
                                                readOnly
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}

                                <TableRow>

                                </TableRow>
                                <TableCell colSpan={7}>
                                    <button onClick={handleAddRow} className="bg-blue-500 text-white px-4 py-1 rounded">
                                        Add Items</button>
                                </TableCell>
                                <TableRow>
                                    <TableCell colSpan={2} className="TableInputTDtotal">
                                        Total
                                    </TableCell>
                                    <TableCell className="TableInputTDtotal">
                                        <input
                                            type="text"
                                            value={state.GrandTotal}
                                            readOnly
                                            className="TableInput1" />
                                    </TableCell>
                                    <TableCell className="TableInputTDtotal">
                                        <input
                                            type="text"
                                            className="TableInput1" />
                                    </TableCell>
                                    <TableCell className="TableInputTDtotal">
                                        <input
                                            type="text"
                                            className="TableInput1" />
                                    </TableCell>
                                    <TableCell className="TableInputTDtotal">
                                        <input
                                            type="text"
                                            className="TableInput1" />
                                    </TableCell>
                                    <TableCell className="TableInputTDtotal">
                                        <input
                                            type="text"
                                            className="TableInput1" />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 50, 100]}
                        component="div"
                        count={tableData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(event, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(event) => {
                            setRowsPerPage(parseInt(event.target.value, 10));
                            setPage(0);
                        }}
                    />
                </div>

                <div className="w-full h-36 flex justify-between items-start p-2">
                    <div className="w-[280px] h-full flex flex-col gap-2 justify-start items-start">
                        <div className="w-full h-full flex justify-start items-start">
                            <label className="w-[100px] h-full flex justify-start items-start text-xs pt-1">Remarks :</label>
                            <textarea
                                type="number"
                                className="TextAreaForPurchase pr-8"
                                value={state.Remarks}
                                onChange={(e) => dispatch({ type: "Remarks", payload: e.target.value })}
                            ></textarea>
                        </div>
                    </div>
                    <div className="w-auto flex justify-center items-end h-full gap-4">
                        {/* print and Download */}
                        <div className="w-full flex justify-end items-center gap-[10px]">
                            <button
                                onClick={ValidateFunction}
                                className="w-[90px] h-[30px] text-sm rounded outline-none bg-green-700 font-light text-white hover:bg-green-800"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => { handleFileGenerate('print') }}
                                className="w-[90px] h-[30px] text-sm rounded outline-none bg-sky-600 font-light text-white hover:bg-sky-800"
                            >
                                Print
                            </button>
                            <button
                                onClick={() => { handleFileGenerate('download') }}
                                className="w-[90px] h-[30px] text-sm rounded outline-none bg-sky-600 font-light text-white hover:bg-sky-800"
                            >
                                Download
                            </button>
                        </div>
                        <div className="w-[400px] h-full flex flex-col gap-2 justify-start items-start">
                            <div className="w-full h-[28px] flex justify-start items-center">
                                <div className="w-[170px] h-full flex justify-start items-center">
                                    <label className="h-full flex justify-start items-center text-xs w-[27px]">Tax : </label>
                                    <select
                                        className="TaxInputForPurchase flex-1 pr-8 appearance-none"
                                        value={state.TaxName}
                                        onClick={() => { dropDownSelect('GetTaxes', { pageNumber: 1, pageSize: 10 }) }}
                                        onChange={(e) => {
                                            const selectedTax = TaxSelect.find(item => item.taxname === e.target.value);
                                            dispatch({ type: "TaxName", payload: e.target.value });
                                            dispatch({ type: "TaxValue", payload: selectedTax ? selectedTax.taxpercentage : "" });
                                        }}
                                    >
                                        <option value=""></option>
                                        {TaxSelect.map((item, i) => (
                                            <option key={i} value={item.taxname}>
                                                {item.taxname}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <input
                                    type="number"
                                    className="EntryInput2Field100 pr-8"
                                    value={state.TaxValue}
                                    onChange={(e) => dispatch({ type: "TaxValue", payload: e.target.value })}
                                />
                            </div>

                            <div className="w-full h-[28px] flex justify-start items-center">
                                <label className="w-[170px] h-full flex justify-start items-center text-xs">Freight Charge :</label>
                                <input
                                    type="number"
                                    className="EntryInput2Field100 pr-8"
                                    value={state.FreightCharge}
                                    onChange={(e) => dispatch({ type: "FreightCharge", payload: e.target.value })}
                                />
                            </div>

                            <div className="w-full h-[28px] flex justify-start items-center">
                                <label className="w-[170px] h-full flex justify-start items-center text-xs">Round Off :</label>
                                <input
                                    type="number"
                                    className="EntryInput2Field100 pr-8"
                                    value={state.RoundOff}
                                    onChange={(e) => dispatch({ type: "RoundOff", payload: e.target.value })}
                                />
                            </div>

                            <div className="w-full h-[28px] flex justify-start items-center">
                                <label className="w-[170px] h-full flex justify-start items-center text-xs">Invoice Total :</label>
                                <input
                                    type="number"
                                    className="EntryInput2Field100 pr-8"
                                    value={state.InvoiceTotal}
                                    onChange={(e) => dispatch({ type: "InvoiceTotal", payload: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div >
            </section >
        </div >
    );
};

export default ItemMaster;
