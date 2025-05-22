"use server";
import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../lib/db";
import sql from "mssql";

export async function POST(request) {
    try {
        const requestBody = await request.json();
        const body = requestBody.data;

        const searchText = body.search || "";

        const pool = await getDBConnection();

        // Prepare request object for item data
        const dataRequest = pool.request();
        dataRequest.input("search", sql.VarChar, searchText);
        dataRequest.input("pageNumber", sql.Int, body.pageNumber);
        dataRequest.input("pageSize", sql.Int, body.pageSize);

        const dataQuery = await dataRequest.query(`
            EXEC GetItems 
                @search = @search,
                @pageNumber = @pageNumber, 
                @pageSize = @pageSize
        `);

        // Prepare request object for total count
        const countRequest = pool.request();
        countRequest.input("search", sql.VarChar, searchText);

        const countQuery = `
            SELECT COUNT(*) AS totalCount 
            FROM ms_item 
            WHERE 
                (@search = '' 
                OR itemname LIKE '%' + @search + '%' 
                OR itemcode LIKE '%' + @search + '%')
        `;

        const totalCountResult = await countRequest.query(countQuery);

        return NextResponse.json(
            {
                Output: {
                    status: {
                        code: 200,
                        message: "Data fetched successfully",
                    },
                    data: dataQuery.recordset,
                    totalCount: totalCountResult.recordset[0]?.totalCount || 0,
                },
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("Error in GetItems API:", err.message);
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
