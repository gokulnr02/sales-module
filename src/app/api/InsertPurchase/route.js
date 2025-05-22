"use server";
import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../lib/db";

export async function POST(request) {
    try {
        const requestBody = await request.json();
        const body = requestBody.data;

        const pool = await getDBConnection();
        const requestDB = pool.request();

        // Header input bindings
        requestDB.input("suppliercode", body.state.CustomerCode || null);
        requestDB.input("purchasenumber", body.state.PurchaseNo);
        requestDB.input("purchasedate", body.state.PurchaseDate);
        requestDB.input("purchasereferencenumber", body.state.PurchaseRefNo || null);
        requestDB.input("remark", body.state.Remarks || null);
        requestDB.input("totalamount", body.state.GrandTotal || 0);
        requestDB.input("status", "Active");
        requestDB.input("createdby", body.createdby);
        requestDB.input("createdtime", body.createdtime);

        // Insert header
        const insertPurchaseQuery = `
            INSERT INTO ms_purchase_new (
                suppliercode, purchasenumber, purchasedate, purchasereferencenumber,
                remark, totalamount, status, createdby, createdtime
            )
            OUTPUT INSERTED.purchaseid
            VALUES (
                @suppliercode, @purchasenumber, @purchasedate, @purchasereferencenumber,
                @remark, @totalamount, @status, @createdby, @createdtime
            );
        `;

        const purchaseResult = await requestDB.query(insertPurchaseQuery);
        const purchaseId = purchaseResult.recordset[0]?.purchaseid;

        if (!purchaseId) {
            throw new Error("Purchase header not inserted.");
        }

        // Insert details
        for (const item of body.tableData) {
            const detailRequest = pool.request();

            detailRequest.input("purchaseid", purchaseId);
            detailRequest.input("itemcode", item.ItemCode);
            detailRequest.input("description", item.Description || null);
            detailRequest.input("qty", item.Qty || 0);
            detailRequest.input("uom", item.UOM || null);
            detailRequest.input("rate", item.Rate || 0);
            detailRequest.input("uomname", item.uomname || null);
            detailRequest.input("total", item.Total || 0);

            const insertDetailQuery = `
                INSERT INTO ms_purchasedetails_new (
                    purchaseid, itemcode, description, qty, uom, rate, uomname
                )
                OUTPUT INSERTED.detailid
                VALUES (
                    @purchaseid, @itemcode, @description, @qty, @uom, @rate, @uomname
                );
            `;

            await detailRequest.query(insertDetailQuery);
        }

        return NextResponse.json(
            {
                Output: {
                    status: { code: 200, message: "Purchase saved successfully" },
                    data: [{ purchaseId: purchaseId }],
                },
            },
            { status: 200 }
        );

    } catch (err) {
      
        let errorMessage = err.message;
        if (
            errorMessage.includes("UNIQUE KEY constraint") &&
            errorMessage.includes("ms_purchase_new")
        ) {
            errorMessage = "Purchase number must be unique.";
        }

        return NextResponse.json(
            {
                Output: {
                    status: { code: 400, message: errorMessage },
                },
            },
            { status: 400 }
        );
    }

}
