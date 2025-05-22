import  {getDBConnection}  from "../../../lib/db"; 
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';


export default async function handler(req, res) {
    try {
        const { fromDate, toDate, suppliercode } = req.body.data;

        if (!fromDate || !toDate || !suppliercode) {
            return res.status(400).json({
                Output: {
                    status: { code: 400, message: "fromDate, toDate, and suppliercode are required" },
                    data: [],
                },
            });
        }

        const query = `
            SELECT * FROM [dbo].[ms_purchase_new] p
            INNER JOIN [dbo].[ms_suppliermaster] s 
                ON p.suppliercode = s.suppliercode
            WHERE 
                p.purchasedate BETWEEN @fromDate AND @toDate
                AND p.suppliercode = @suppliercode
        `;

        const pool = await getDBConnection();
        const qryExec = await pool
            .request()
            .input("fromDate", fromDate)
            .input("toDate", toDate)
            .input("suppliercode", suppliercode)
            .query(query);

        const records = qryExec.recordset;

        if (records.length === 0) {
            return res.status(404).json({
                Output: {
                    status: { code: 404, message: "No purchase data found" },
                    data: [],
                },
            });
        }

        const html = await template(records, fromDate, toDate, records[0].customername);

        const isVercel = true 

        const browser = await puppeteer.launch({
            args: isVercel ? chromium.args : [],
            executablePath: isVercel ? await chromium.executablePath() : 'C:/Program Files/Google/Chrome/Application/chrome.exe',
            headless: isVercel ? chromium.headless : true,
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({ format: "A4" });

        await browser.close();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=purchase-summary.pdf");

        return res.status(200).json({
            Output: {
                status: { code: 200, message: "Success" },
                data: { pdfBuffer: pdfBuffer.toString("base64") },
            },
        });
    } catch (error) {
        return res.status(500).json({
            Output: {
                status: { code: 500, message: error.message },
                data: { pdfBuffer: "" },
            },
        });
    }
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
}

async function template(data, fromDate, toDate, supplierName) {
    let totalAmount = 0;
    let discountAmount = 0;
    let roundOff = 0;
    let netAmount = 0;

    const rows = data.map((item, index) => {
        const amount = parseFloat(item.totalamount) || 0;
        const discount = parseFloat(item.discountamount) || 0;
        const round = parseFloat(item.roundoff || 0);
        const net = amount - discount + round;

        totalAmount += amount;
        discountAmount += discount;
        roundOff += round;
        netAmount += net;

        return `
            <tr>
                <td>${index + 1}</td>
                <td>${item.purchasenumber}</td>
                <td>${formatDate(item.purchasedate)}</td>
                <td>${item.purchasereferencenumber || "-"}</td>
                <td>${item.customername}</td>
                <td>${amount.toFixed(2)}</td>
                <td>${discount.toFixed(2)}</td>
                <td>${round.toFixed(2)}</td>
                <td>${net.toFixed(2)}</td>
                <td>${item.remark || "-"}</td>
            </tr>
        `;
    });

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Purchase Summary Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          color: #000;
        }
        h2 {
          text-align: center;
          margin-bottom: 20px;
        }
        .filters {
          margin-bottom: 20px;
        }
        .filters span {
          display: inline-block;
          margin-right: 20px;
          font-weight: bold;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        table, th, td {
          border: 1px solid #999;
        }
        th, td {
          padding: 8px 12px;
          text-align: left;
        }
        th {
          background-color: #f0f0f0;
        }
        .total-row td {
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <h2>Purchase Summary Report</h2>
      <div class="filters">
        <span>From Date: ${formatDate(fromDate)}</span>
        <span>To Date: ${formatDate(toDate)}</span>
        <span>Supplier Name: ${supplierName}</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Ref No</th>
            <th>Date</th>
            <th>Supplier Ref No</th>
            <th>Supplier Name</th>
            <th>Total Amount</th>
            <th>Discount Amount</th>
            <th>Round Off</th>
            <th>Net Amount</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          ${rows.join("")}
          <tr class="total-row">
            <td colspan="5">Total</td>
            <td>${totalAmount.toFixed(2)}</td>
            <td>${discountAmount.toFixed(2)}</td>
            <td>${roundOff.toFixed(2)}</td>
            <td>${netAmount.toFixed(2)}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>`;
}

