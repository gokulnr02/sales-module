"use server";
import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../lib/db";
import sql from "mssql";

export async function POST(request) {
    try {
        const requestBody = await request.json();
        const body = requestBody.data;
        const pool = await getDBConnection();

        const searchText = body.search || "";

        // Prepare request object with parameters
        const requestWithInput = pool.request();
        requestWithInput.input("search", sql.VarChar, searchText);
        requestWithInput.input("pageNumber", sql.Int, body.pageNumber);
        requestWithInput.input("pageSize", sql.Int, body.pageSize);

        // Execute stored procedure
        const dataQuery = await requestWithInput.query(`
      EXEC GetCategories @search = @search, @pageNumber = @pageNumber, @pageSize = @pageSize
    `);

        // Create a new request object for total count (or reuse, but reset inputs)
        const countRequest = pool.request();
        countRequest.input("search", sql.VarChar, searchText);

        const countQuery = `
      SELECT COUNT(*) AS totalCount 
      FROM ms_category
      WHERE 
        (@search = '' OR categoryname LIKE '%' + @search + '%' OR categorycode LIKE '%' + @search + '%')
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
        console.error("Error in GetCategories API:", err.message);
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
