"use server";
import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../lib/db";

export async function POST(req) {
    try {
        const body = await req.json();
        const { fromDate, toDate, suppliercode } = body.data;

        if (!fromDate || !toDate || !suppliercode) {
            return NextResponse.json(
                {
                    Output: {
                        status: {
                            code: 400,
                            message: "fromDate, toDate, and suppliercode are required",
                        },
                        data: [],
                    },
                },
                { status: 400 }
            );
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

        if (qryExec.recordsets && qryExec.recordsets.length > 0) {
            const result = qryExec.recordsets[0];
            return NextResponse.json(
                {
                    Output: {
                        status: {
                            code: 200,
                            message: "Fetched Successfully",
                        },
                        data: result,
                    },
                },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                {
                    Output: {
                        status: {
                            code: 404,
                            message: "No records found",
                        },
                        data: [],
                    },
                },
                { status: 200 }
            );
        }

    } catch (err) {
        console.error("Error in fetch purchase API:", err.message);
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
