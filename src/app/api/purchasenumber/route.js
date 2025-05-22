"use server";
import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../lib/db";

export async function POST(request) {
    try {
        const requestBody = await request.json();
        const body = requestBody.data;
        const pool = await getDBConnection();
        const requestDB = pool.request();
        requestDB.input("purchasenumber", body.PurchaseRefNo || null);


        const getMaxCodeQuery = `
            SELECT MAX(CAST(purchasenumber AS NVARCHAR)) AS maxCode 
            FROM ms_purchase_new
        `;
        const maxCodeResult = await requestDB.query(getMaxCodeQuery);

       
        let maxCode = maxCodeResult.recordset[0].maxCode || "000"; 
        const numericPart = maxCode.replace(/\D/g, ''); 
        const nextCode = (parseInt(numericPart || "0", 10) + 1)
            .toString()
            .padStart(3, "0");

        return NextResponse.json(
            {
                Output: {
                    status: {
                        code: 200,
                        message: "Successfully generated next purchase reference number",
                    },
                    data: nextCode,
                },
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("Error in PurchaseRefNo API:", err.message);
        return NextResponse.json(
            {
                Output: {
                    status: { code: 500, message: err.message },
                },
            },
            { status: 500 }
        );
    }
}
