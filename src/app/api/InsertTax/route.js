"use server";
import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../lib/db";

export async function POST(request) {
    try {
        const requestBody = await request.json();
        const body = requestBody.data;

        const pool = await getDBConnection();
        const requestDB = pool.request();

        let query = "";
        let result;

        if (body.taxcode) {
            // --- Update existing record ---
            requestDB.input("taxcode", body.taxcode);
            requestDB.input("taxname", body.taxname);
            requestDB.input("taxpercentage", body.taxpercentage);
            requestDB.input("status", body.status || "Active");
            requestDB.input("createdby", body.createdby || "Admin");

            query = `
                UPDATE ms_tax
                SET 
                    taxname = @taxname,
                    taxpercentage = @taxpercentage,
                    status = @status,
                    createdby = @createdby
                WHERE taxcode = @taxcode;

                SELECT @taxcode AS taxcode;
            `;
            result = await requestDB.query(query);
        } else {
            // --- Insert new record ---
            const getMaxCodeQuery = `SELECT MAX(CAST(taxcode AS INT)) AS maxCode FROM ms_tax`;
            const maxCodeResult = await requestDB.query(getMaxCodeQuery);

            const nextCode = (parseInt(maxCodeResult.recordset[0].maxCode || "0", 10) + 1)
                .toString()
                .padStart(3, "0");

            requestDB.input("taxcode", nextCode);
            requestDB.input("taxname", body.taxname);
            requestDB.input("taxpercentage", body.taxpercentage);
            requestDB.input("status", "Active");
            requestDB.input("createdby", body.createdby || "Admin");

            query = `
                INSERT INTO ms_tax (taxcode, taxname, taxpercentage, status, createdby)
                OUTPUT INSERTED.taxcode
                VALUES (@taxcode, @taxname, @taxpercentage, @status, @createdby);
            `;
            result = await requestDB.query(query);
        }

        return NextResponse.json(
            {
                Output: {
                    status: {
                        code: 200,
                        message: body.taxcode ? "Updated successfully" : "Saved successfully",
                    },
                    data: result.recordset || [],
                },
            },
            { status: 200 }
        );
    } catch (err) {
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
