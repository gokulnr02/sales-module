"use client";
import { useState, useReducer, useEffect, useCallback } from "react";
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
import { SlHome } from "react-icons/sl";
import CommonAPISave from "../../Components/CommonAPISave";
import { RiMenuFold2Line } from "react-icons/ri";
import { RiMenuFoldLine } from "react-icons/ri";
import { RiResetRightFill } from "react-icons/ri";


const Sidebar = ({ isOpen, toggleSidebar }) => {

    const [openSection, setOpenSection] = useState(null);


    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <div className={`bg-gray-900 text-white w-[230px] min-h-screen p-5 transition-all ${isOpen ? "block" : "hidden"}`}>
            <div className="flex justify-between items-center">
                <Image src="/images/BrandLogo.jpg" alt="Brand Logo" width={170} height={0} className="w-[120px] sm:w-[140px] md:w-[170px]" />
                <button onClick={toggleSidebar} className="md:hidden">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <ul className="mt-5 space-y-2">
                <li>
                    <Link href="/dashboard"
                        className="flex items-center font-light text-[14px] p-2 hover:bg-gray-700 rounded">
                        <SlHome className="w-5 h-5 mr-2" /> Dashboard
                    </Link>
                </li>

                {/* Masters Section */}
                <li>
                    <button onClick={() => toggleSection("Masters")} className="flex justify-between w-full p-2 hover:bg-gray-700 rounded">
                        <span className="flex items-center font-light text-[14px]"><IoFolderOutline className="w-5 h-5 mr-2" /> Masters</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${openSection === "Masters" ? "rotate-180" : ""}`} />
                    </button>
                    {openSection === "Masters" && (
                        <ul className="mt-1 space-y-1">
                            <li><Link href="/Masters/Category"
                                className="flex items-center font-light text-[14px] p-2 hover:bg-gray-700 rounded activeBar">
                                <HiBars3BottomLeft className="w-4 h-4 mr-3" /> Category</Link></li>

                            <li><Link href="/Masters/Item"
                                className="flex items-center font-light text-[14px] p-2 hover:bg-gray-700 rounded">
                                <HiBars3BottomLeft className="w-4 h-4 mr-3" /> Item</Link></li>

                            <li><Link href="/Masters/Supplier"
                                className="flex items-center font-light text-[14px] p-2 hover:bg-gray-700 rounded">
                                <HiBars3BottomLeft className="w-4 h-4 mr-3" /> Supplier</Link></li>

                            <li><Link href="/Masters/State"
                                className="flex items-center font-light text-[14px] p-2 hover:bg-gray-700 rounded">
                                <HiBars3BottomLeft className="w-4 h-4 mr-3" /> State</Link></li>

                            <li><Link href="/Masters/Tax"
                                className="flex items-center font-light text-[14px] p-2 hover:bg-gray-700 rounded">
                                <HiBars3BottomLeft className="w-4 h-4 mr-3" /> Tax</Link></li>
                        </ul>
                    )}
                </li>

                <li>
                    <button onClick={() => toggleSection("Transaction")} className="flex justify-between w-full p-2 hover:bg-gray-700 rounded">
                        <span className="flex items-center font-light text-[14px]"><IoFolderOutline className="w-5 h-5 mr-2" /> Transaction</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${openSection === "Transaction" ? "rotate-180" : ""}`} />
                    </button>
                    {openSection === "Transaction" && (
                        <ul className="mt-1 space-y-1">
                            <li><Link href="/Transaction/Purchase"
                                className="flex items-center font-light text-[14px] p-2 hover:bg-gray-700 rounded">
                                <HiBars3BottomLeft className="w-4 h-4 mr-3" /> Purchase</Link></li>
                        </ul>
                    )}
                </li>

                <li>
                    <button onClick={() => toggleSection("Reports")} className="flex justify-between w-full p-2 hover:bg-gray-700 rounded">
                        <span className="flex items-center font-light text-[14px]"><IoFolderOutline className="w-5 h-5 mr-2" /> Reports</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${openSection === "Reports" ? "rotate-180" : ""}`} />
                    </button>
                    {openSection === "Reports" && (
                        <ul className="mt-1 space-y-1">
                            <li><Link href="/Reports/PurchaseSummary"
                                className="flex items-center font-light text-[14px] p-2 hover:bg-gray-700 rounded">
                                <HiBars3BottomLeft className="w-4 h-4 mr-3" /> Purchase Summary</Link></li>
                        </ul>
                    )}
                </li>

                <li>
                    <button onClick={() => toggleSection("Purchase Register")} className="flex justify-between w-full p-2 hover:bg-gray-700 rounded">
                        <span className="flex items-center font-light text-[14px]"><IoFolderOutline className="w-5 h-5 mr-2" /> Purchase Register</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${openSection === "Purchase Register" ? "rotate-180" : ""}`} />
                    </button>
                    {openSection === "Purchase Register" && (
                        <ul className="mt-1 space-y-1">
                        </ul>
                    )}
                </li>

                <li>
                    <button onClick={() => toggleSection("Utilities")} className="flex justify-between w-full p-2 hover:bg-gray-700 rounded">
                        <span className="flex items-center font-light text-[14px]"><IoFolderOutline className="w-5 h-5 mr-2" /> Utilities</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${openSection === "Utilities" ? "rotate-180" : ""}`} />
                    </button>
                    {openSection === "Utilities" && (
                        <ul className="mt-1 space-y-1">
                        </ul>
                    )}
                </li>
            </ul>

            <button className="mt-4 w-full flex items-center p-2 bg-red-600 hover:bg-red-700 rounded text-white">
                <LogOut className="w-4 h-4 mr-2" /> Logout
            </button>
        </div>
    );
};

const CategoryMasterReducers = (state, action) => {
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
    FromDate: "",
    ToDate: "",
    SupplierCode: "",
    SupplierName: ""
};

const CategoryMaster = () => {
    const [isOpen, setIsOpen] = useState(true);
    const toggleSidebar = () => setIsOpen(!isOpen);
    const [state, dispatch] = useReducer(CategoryMasterReducers, initialState);
    const [tableData, setTableData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [CustomerSelect, setCustomerSelect] = useState([]);

    const [totalAmountSum, setTotalAmountSum] = useState(0);
    const [discountAmountSum, setDiscountAmountSum] = useState(0);
    const [roundOffSum, setRoundOffSum] = useState(0);
    const [netAmountSum, setNetAmountSum] = useState(0);



    const tableSelect = async() => {
        if (!state.FromDate) {
            window.alert("Kindly select the From Date");
            return;
        }
        else if (!state.ToDate) {
            window.alert("Kindly select the To Date");
            return;
        }
        else if (!state.SupplierName) {
            window.alert("Kindly select the Supplier Name");
            return;
        }
        const url = '/api/getPurchase';
        const params = {
            fromDate: state.FromDate, 
            toDate: state.ToDate,
            suppliercode: state.SupplierCode,
            status: 'Active',
            pageNumber: 1,
            pageSize: 10
        }
        console.log("params", params)
        await CommonAPISave({ url, params }).then((res) => {
            if (res.Output.status.code && res.Output.data.length > 0) {
                const data = res.Output.data
                setTableData(data)
                if (data.length > 0) {
                    const total = data.reduce((sum, row) => sum + (row.totalamount || 0), 0);
                    const discount = data.reduce((sum, row) => sum + (row.discountamount || 0), 0);
                    const roundoff = data.reduce((sum, row) => sum + (row.roundoff || 0), 0);
                    const net = data.reduce((sum, row) => {
                        const total = row.totalamount || 0;
                        const discount = row.discountamount || 0;
                        const round = row.roundoff || 0;
                        return sum + (total - discount + round);
                    }, 0);

                    setTotalAmountSum(total);
                    setDiscountAmountSum(discount);
                    setRoundOffSum(roundoff);
                    setNetAmountSum(net);
                }
            }
        })
    }

    const printpreview = async() => {
        if (!state.FromDate) {
            window.alert("Kindly select the From Date");
            return;
        }
        else if (!state.ToDate) {
            window.alert("Kindly select the To Date");
            return;
        }
        else if (!state.SupplierName) {
            window.alert("Kindly select the Supplier Name");
            return;
        }
        const url = '/api/Purchasesummary';
        const params = {
            fromDate: state.FromDate, 
            toDate: state.ToDate,
            suppliercode: state.SupplierCode,
            status: 'Active',
            pageNumber: 1,
            pageSize: 10
        }
        console.log("params", params)
        await CommonAPISave({ url, params }).then((res) => {
            if (res.Output.status.code == 200 && res.Output.data.pdfBuffer) {
                let pdfbuffer = res.Output.data.pdfBuffer;
                if (typeof pdfbuffer === "string") {
                    pdfbuffer = pdfbuffer.split(",").map(Number);
                }

                const byteArray = new Uint8Array(pdfbuffer);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const pdfUrl = URL.createObjectURL(blob);
                const uniqueFileName = `PurchaseSummaryReport${Date.now()}.pdf`;

                window.open(pdfUrl, '_blank');
            } else {
                console.error('PDF buffer is missing or response is incorrect');
            }
        })
    }

 

    const handleCancel = useCallback(() => {
         setTableData([]);
         setTotalAmountSum(0);
         setDiscountAmountSum(0);
         setRoundOffSum(0);
         setNetAmountSum(0);
         dispatch({ type: "RESET" });
    }, [state]);

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
                if (endPoint == 'getSupplier') {
                    setCustomerSelect(data)
                }
            }
        })
    }

   

    return (
        <div className="flex h-screen">
            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
            <section className="flex-1 h-full">
                <div className="w-full h-10 bg-gray-200 flex items-center px-2 text-black gap-2">
                    {isOpen ? <RiMenuFoldLine onClick={toggleSidebar} className="w-5 h-5 cursor-pointer" /> :
                        <RiMenuFold2Line onClick={toggleSidebar} className="w-5 h-5 cursor-pointer" />}
                    <span className="text-sm font-medium">Purchase Summary Report</span>
                </div>
                <div className="w-full h-[110px] p-2 pt-4">
                    <div className="w-full flex justify-start items-center flex-wrap gap-[10px]">
                        <div className="relative w-[calc(25%-10px)] h-auto flex flex-col justify-start items-start gap-[6px]">
                            <label className="w-full text-xs">From Date:</label>
                            <div className="relative w-full">
                                <input
                                    type="date"
                                    className="EntryInputField100 pr-8"
                                    placeholder="Enter From Date"
                                    value={state.FromDate}
                                    onChange={(e) => dispatch({ type: "FromDate", payload: e.target.value })}
                                />
                                {state.FromDate && (
                                    <span
                                        // onClick={() => dispatch({ type: "FromDate", payload: null })}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 cursor-pointer"
                                    >
                                        <MdClear />
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="relative w-[calc(25%-10px)] h-auto flex flex-col justify-start items-start gap-[6px]">
                            <label className="w-full text-xs">To Date:</label>
                            <div className="relative w-full">
                                <input
                                    type="date"
                                    className="EntryInputField100 pr-8"
                                    placeholder="Enter To Date"
                                    value={state.ToDate}
                                    onChange={(e) => dispatch({ type: "ToDate", payload: e.target.value })}
                                />
                                {state.ToDate && (
                                    <span
                                        onClick={() => dispatch({ type: "ToDate", payload: "" })}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 cursor-pointer"
                                    >
                                        <MdClear />
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="relative w-[calc(25%-10px)] h-auto flex flex-col justify-start items-start gap-[4px]">
                            <label className="w-full text-sm">Supplier Name:</label>
                            <div className="relative w-full">
                                <select
                                    className="InputStyle w-full pr-8 appearance-none"
                                    value={state.SupplierName}
                                    onClick={() => { dropDownSelect('getSupplier', { pageNumber: 1, pageSize: 10 }) }}
                                    onChange={(e) => {
                                        const selectedCustomer = CustomerSelect.find(item => item.customername === e.target.value);
                                        dispatch({ type: "SupplierName", payload: e.target.value });
                                        dispatch({ type: "SupplierCode", payload: selectedCustomer ? selectedCustomer.suppliercode : "" });

                                    }}
                                >
                                    <option value="">Select Supplier</option>
                                    {CustomerSelect.map((item) => (
                                        <option key={item.SupplierCode} value={item.customername}>
                                            {item.customername}
                                        </option>
                                    ))}
                                </select>

                                {state.SupplierName && (
                                    <span
                                        onClick={() => {
                                            dispatch({ type: "SupplierName", payload: "" });
                                            dispatch({ type: "SupplierCode", payload: "" });
                                        }}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 cursor-pointer"
                                    >
                                        <MdClear />
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex justify-end items-center gap-[10px] pt-2">
                        <button
                            onClick={() => { handleCancel() }} title="Reset"
                            className="w-[auto] px-2 h-[30px] text-sm rounded outline-none bg-[#f7f7f7] font-light text-[#4b4b4b] hover:bg-[#eaeaea]"
                        >
                            <RiResetRightFill className="w-4 h-4" />
                        </button>

                        <button
                            onClick={tableSelect}
                            className="w-[90px] h-[30px] text-sm rounded outline-none bg-sky-600 font-light text-white hover:bg-sky-800"
                        >
                            View
                        </button>

                        <button
                            onClick={printpreview}
                            className="w-[90px] h-[30px] text-sm rounded outline-none bg-sky-600 font-light text-white hover:bg-sky-800"
                        >
                            Print
                        </button>
                    </div>
                </div>
                {/* Table Section */}
                <div className="w-full p-2 overflow-auto height145">
                    <TableContainer component={Paper}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>S.No</TableCell>
                                    <TableCell>Ref No</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Supplier Ref No</TableCell>
                                    <TableCell>Supplier Name</TableCell>
                                    <TableCell>Total Amount</TableCell>
                                    <TableCell>Discount Amount</TableCell>
                                    <TableCell>Round Off</TableCell>
                                    <TableCell>Net Amount</TableCell>
                                    <TableCell>Remarks</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(tableData && tableData.length > 0) && tableData
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                            <TableCell>{row.purchasenumber}</TableCell>
                                            <TableCell>{new Date(row.purchasedate).toLocaleDateString()}</TableCell>
                                            <TableCell>{row.purchasereferencenumber}</TableCell>
                                            <TableCell>{row.customername}</TableCell>
                                            <TableCell>{row.totalamount}</TableCell>
                                            <TableCell>{row.discountamount || 0}</TableCell>
                                            <TableCell>{row.roundoff || 0}</TableCell>
                                            <TableCell>{(row.totalamount - (row.discountamount || 0) + (row.roundoff || 0)).toFixed(2)}</TableCell>
                                            <TableCell>{row.remark || '-'}</TableCell>
                                        </TableRow>
                                    ))}

                                <TableRow>
                                    <TableCell colSpan={5} className="TableInputTDtotal">
                                        Total
                                    </TableCell>
                                    <TableCell className="TableInputTDtotal">
                                        {totalAmountSum.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="TableInputTDtotal">
                                        {discountAmountSum.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="TableInputTDtotal">
                                        {roundOffSum.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="TableInputTDtotal">
                                        {netAmountSum.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="TableInputTDtotal"></TableCell>
                                </TableRow>

                            </TableBody>
                        </Table>

                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={tableData.length}
                        page={page}
                        onPageChange={(e, newPage) => setPage(newPage)}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10));
                            setPage(0);
                        }}
                    />
                </div>
            </section>
        </div>
    );
};

export default CategoryMaster;
