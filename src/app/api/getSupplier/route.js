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
        const pageNumber = body.pageNumber || 1;
        const pageSize = body.pageSize || 10;

        const offset = (pageNumber - 1) * pageSize;

        // Data query with pagination and search
        const dataRequest = pool.request();
        dataRequest.input("search", sql.VarChar, searchText);
        dataRequest.input("offset", sql.Int, offset);
        dataRequest.input("pageSize", sql.Int, pageSize);

        const dataQuery = `
            SELECT *
            FROM ms_suppliermaster
            WHERE (@search = '' OR customername LIKE '%' + @search + '%' OR suppliercode LIKE '%' + @search + '%')
            ORDER BY suppliercode OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
        `;

        const result = await dataRequest.query(dataQuery);

        // Total count query
        const countRequest = pool.request();
        countRequest.input("search", sql.VarChar, searchText);

        const countQuery = `
            SELECT COUNT(*) AS totalCount
            FROM ms_suppliermaster
            WHERE (@search = '' OR customername LIKE '%' + @search + '%' OR suppliercode LIKE '%' + @search + '%')
        `;

        const totalCountResult = await countRequest.query(countQuery);

        return NextResponse.json(
            {
                Output: {
                    status: {
                        code: 200,
                        message: "Data fetched successfully",
                    },
                    data: result.recordset,
                    totalCount: totalCountResult.recordset[0]?.totalCount || 0,
                },
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("Error in SupplierMaster API:", err.message);
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
