"use server";
import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../lib/db";
import sql from "mssql";

export async function POST(request) {
    try {
        const requestBody = await request.json();
        const body = requestBody.data;

        const searchText = body.search || "";
        const pageNumber = body.pageNumber;
        const pageSize = body.pageSize;

        const pool = await getDBConnection();

        // --- Fetch paginated tax data using stored procedure ---
        const dataRequest = pool.request();
        dataRequest.input("search", sql.VarChar, searchText);
        dataRequest.input("pageNumber", sql.Int, pageNumber);
        dataRequest.input("pageSize", sql.Int, pageSize);

        const dataResult = await dataRequest.query(`
            EXEC GetTaxes @search = @search, @pageNumber = @pageNumber, @pageSize = @pageSize
        `);

        // --- Fetch total count for search (for frontend pagination) ---
        const countRequest = pool.request();
        countRequest.input("search", sql.VarChar, searchText);

        const countQuery = `
            SELECT COUNT(*) AS totalCount
            FROM ms_tax
            WHERE 
                (@search = '' OR taxname LIKE '%' + @search + '%' OR taxcode LIKE '%' + @search + '%')
        `;

        const countResult = await countRequest.query(countQuery);

        const taxData = dataResult.recordset || [];
        const totalCount = countResult.recordset[0]?.totalCount || 0;

        return NextResponse.json(
            {
                Output: {
                    status: {
                        code: 200,
                        message: "Data fetched successfully",
                    },
                    data: taxData,
                    totalCount: totalCount,
                },
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("Error in GetTaxes API:", err.message);
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
