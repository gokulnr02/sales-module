"use client";
import { useState } from "react";
import Image from "next/image";
import { Menu, X, LogOut, ShoppingCart, CreditCard, BarChart, ChevronDown } from "lucide-react";
import Link from "next/link";
import { SlHome } from "react-icons/sl";
import { IoFolderOutline } from "react-icons/io5";
import { HiBars3BottomLeft } from "react-icons/hi2";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className={`bg-gray-900 text-white w-64 min-h-screen p-5 transition-all ${isOpen ? "block" : "hidden"} md:block`}>
      <div className="flex justify-between items-center">
        <Image
          src="/images/BrandLogo.jpg"
          alt="Brand Logo"
          width={170}
          height={0}
          className="w-[120px] sm:w-[140px] md:w-[170px]"
        />
        <button onClick={toggleSidebar} className="md:hidden">
          <X className="w-6 h-6" />
        </button>
      </div>
      <ul className="mt-5 space-y-2">
        <li>
          <Link href="/dashboard"
            className="flex items-center font-light text-[14px] p-2 hover:bg-gray-700 rounded activeBar">
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
                className="flex items-center font-light text-[14px] p-2 hover:bg-gray-700 rounded">
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
      <button className="mt-5 w-full flex items-center p-2 bg-red-600 hover:bg-red-700 rounded text-white">
        <LogOut className="w-5 h-5 mr-2" /> Logout
      </button>
    </div>
  );
};

const Header = ({ toggleSidebar }) => {
  return (
    // <header className="bg-gray-100 p-4 flex justify-between items-center shadow-md">
    //   <button onClick={toggleSidebar} className="md:hidden">
    //     <Menu className="w-6 h-6" />
    //   </button>
    //   <h1 className="text-lg font-bold">Dashboard</h1>
    //   <div className="flex items-center space-x-4">
    //     <span className="text-gray-700">Admin</span>
    //   </div>
    // </header>

    <div className="w-full h-10 bg-gray-200 flex justify-between items-center px-2">
      <span className="text-sm font-medium">Dashboard</span>
      <span className="text-sm font-medium">Admin</span>
    </div>

  );
};

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1">
        <Header toggleSidebar={toggleSidebar} />
        <main className="p-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
            <div className="bg-blue-500 p-5 rounded-lg text-white flex items-center space-x-3">
              <ShoppingCart className="w-10 h-10" />
              <div>
                <h2 className="text-lg font-bold">Purchase History</h2>
                <p>120 Orders</p>
              </div>
            </div>
            <div className="bg-green-500 p-5 rounded-lg text-white flex items-center space-x-3">
              <CreditCard className="w-10 h-10" />
              <div>
                <h2 className="text-lg font-bold">Total Transactions</h2>
                <p>$25,000</p>
              </div>
            </div>
            <div className="bg-purple-500 p-5 rounded-lg text-white flex items-center space-x-3">
              <BarChart className="w-10 h-10" />
              <div>
                <h2 className="text-lg font-bold">Analytics</h2>
                <p>450 Visitors</p>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

