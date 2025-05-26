"use client";

import {
  FileText,
  DollarSign,
  Users
} from "lucide-react";

const SalesDashboardLayout = () => {
  return (
    <div className="flex">
      <div className="flex-1">
        <main className="p-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Sales Invoices */}
            <div className="bg-blue-600 p-5 rounded-lg text-white flex items-center space-x-4 shadow-md">
              <FileText className="w-10 h-10" />
              <div>
                <h2 className="text-lg font-bold">Total Invoices</h2>
                <p>312 Issued</p>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-green-600 p-5 rounded-lg text-white flex items-center space-x-4 shadow-md">
              <DollarSign className="w-10 h-10" />
              <div>
                <h2 className="text-lg font-bold">Total Revenue</h2>
                <p>$85,250</p>
              </div>
            </div>

            {/* Active Customers */}
            <div className="bg-purple-600 p-5 rounded-lg text-white flex items-center space-x-4 shadow-md">
              <Users className="w-10 h-10" />
              <div>
                <h2 className="text-lg font-bold">Active Customers</h2>
                <p>1,024 Accounts</p>
              </div>
            </div>
          </div>

          {/* You can extend this with charts, sales summaries, recent transactions, etc */}
        </main>
      </div>
    </div>
  );
};

export default SalesDashboardLayout;
