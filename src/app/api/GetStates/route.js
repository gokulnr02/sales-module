"use server";
import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../lib/db";
import sql from "mssql";

export async function POST(request) {
    try {
        const requestBody = await request.json();
        const body = requestBody.data;

        const searchText = body.search || "";
        const pageNumber = body.pageNumber || 1;
        const pageSize = body.pageSize || 10;

        const pool = await getDBConnection();

        // --- Fetch paginated state records using stored procedure ---
        const dataRequest = pool.request();
        dataRequest.input("search", sql.VarChar, searchText);
        dataRequest.input("pageNumber", sql.Int, pageNumber);
        dataRequest.input("pageSize", sql.Int, pageSize);

        const dataQuery = await dataRequest.query(`
            EXEC GetStates 
                @search = @search,
                @pageNumber = @pageNumber, 
                @pageSize = @pageSize
        `);

        // --- Fetch total count with search condition ---
        const countRequest = pool.request();
        countRequest.input("search", sql.VarChar, searchText);

        const countQuery = `
            SELECT COUNT(*) AS totalCount 
            FROM ms_state 
            WHERE 
                (@search = '' 
                OR statename LIKE '%' + @search + '%' 
                OR statecode LIKE '%' + @search + '%')
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
        console.error("Error in GetStates API:", err.message);
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
