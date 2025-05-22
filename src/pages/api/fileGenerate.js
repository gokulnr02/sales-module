import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';



export default async function handler(req, res) {
    try {
        const { state, tableData } = req.body.data;
        console.log("Request Data:", req.body);

        const html = await template(state, tableData); // Your HTML generation logic here

        const isVercel = true // AWS_REGION is set in Vercel serverless functions

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
        res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");

        return res.status(200).json({
            Output: {
                status: { code: 200, message: "Success" },
                data: { pdfBuffer: pdfBuffer.toString("base64") }
            }
        });
    } catch (error) {
        console.error("PDF generation error:", error);
        return res.status(400).json({
            Output: {
                status: { code: 400, message: error.message },
                data: { pdfBuffer: "" }
            }
        });
    }
}


const style = `<style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
        }
        .invoice-container {
            background: white;
            padding: 20px;
            max-width: 800px;
            margin: auto;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .customer-details, .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
        }
        .table th, .table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
        }
        .table th {
            background-color: #f2f2f2;
        }
        .totals {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
        }
        .totals table {
            width: 300px;
        }
        .totals td {
            padding: 8px;
            border: 1px solid #ddd;
        }
        .remarks {
            margin-top: 20px;
        }
       .p-2 {
    display: inline-block;
    width: 100px;
}

.p-3 {
    display: inline-block;
    width: 150px;
}


    </style>`

async function template(state, tableData) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice Template</title>
        ${style}
    </head>
    <body>
        <div class="invoice-container">
            <div class="header">Invoice</div>
            
            <div class="customer-details">
    <div>
        <p><span class="p-2"><strong>Customer:</strong></span> ${state.CustomerName || ''}</p>
        <p><span class="p-2"><strong>Address 1:</strong></span> ${state.Address1 || ''}</p>
        <p><span class="p-2"><strong>Address 2:</strong></span> ${state.Address2 || ''}</p>
        <p><span class="p-2"><strong>Phone No:</strong></span> ${state.PhoneNo || ''}</p>
    </div>
    <div>
        <p><span class="p-3"><strong>Purchase No:</strong></span> ${state.PurchaseNo || ''}</p>
        <p><span class="p-3"><strong>Purchase Date:</strong></span> ${state.PurchaseDate || ''}</p>
        <p><span class="p-3"><strong>Purchase Ref No:</strong></span> ${state.PurchaseRefNo || ''}</p>
    </div>
</div>

            
            <table class="table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Item Name</th>
                        <th>Description</th>
                        <th>Qty</th>
                        <th>UOM</th>
                        <th>Rate</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${await generateTableRows(tableData)}
                </tbody>
            </table>
            
            <div class="totals">
                <table>
                    <tr>
                        <td><strong>Tax:</strong></td>
                        <td>${state.TaxValue || ''}</td>
                    </tr>
                    <tr>
                        <td><strong>Freight Charge:</strong></td>
                        <td>${state.FreightCharge || ''}</td>
                    </tr>
                    <tr>
                        <td><strong>Round Off:</strong></td>
                        <td>${state.RoundOff || ''}</td>
                    </tr>
                    <tr>
                        <td><strong>Invoice Total:</strong></td>
                        <td>${state.InvoiceTotal || ''}</td>
                    </tr>
                </table>
            </div>
            
            <div class="remarks">
                <strong>Remarks:</strong>
                <p>${state.Remarks || ''}</p>
            </div>
        </div>
    </body>
    </html>`;
}


async function generateTableRows(tableData) {
    return `<tbody>
        ${tableData.map((val, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${val['ItemName'] || ''}</td>
                <td>${val['Description'] || ''}</td>
                <td>${val['Qty'] || ''}</td>
                <td>${val['UOM'] || ''}</td>
                <td>${val['Rate'] || ''}</td>
                <td>${val['Total'] || ''}</td>
            </tr>
        `).join('')}
    </tbody>`;
}
