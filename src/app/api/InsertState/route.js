"use server";
import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../lib/db";

export async function POST(request) {
    try {
        const requestBody = await request.json();
        const body = requestBody.data;

        const pool = await getDBConnection();
        const requestDB = pool.request();

        const isUpdate = body.statecode ;

        if (isUpdate) {
            // --- UPDATE ---
            requestDB.input("statecode", body.statecode);
            requestDB.input("statename", body.statename);
            requestDB.input("remarks", body.remarks || null);
            requestDB.input("status", body.status || "Active");
            requestDB.input("createdby", body.createdby);
            requestDB.input("activeby", body.activeby || null);

            const updateQuery = `
                UPDATE ms_state SET
                    statename = @statename,
                    remarks = @remarks,
                    status = @status,
                    createdby = @createdby,
                    activeby = @activeby
                WHERE statecode = @statecode;

                SELECT * FROM ms_state WHERE statecode = @statecode;
            `;

            const updateResult = await requestDB.query(updateQuery);

            return NextResponse.json(
                {
                    Output: {
                        status: {
                            code: 200,
                            message: "Updated successfully",
                        },
                        data: updateResult.recordset,
                    },
                },
                { status: 200 }
            );

        } else {
            // --- INSERT ---
            const getMaxCodeQuery = `SELECT MAX(CAST(statecode AS INT)) AS maxCode FROM ms_state`;
            const maxCodeResult = await requestDB.query(getMaxCodeQuery);

            const nextCode = (parseInt(maxCodeResult.recordset[0].maxCode || "0", 10) + 1)
                .toString()
                .padStart(3, "0"); // e.g. "001", "045"

            requestDB.input("statecode", nextCode);
            requestDB.input("statename", body.statename);
            requestDB.input("remarks", body.remarks || null);
            requestDB.input("status", body.status || "Active");
            requestDB.input("createdby", body.createdby);
            requestDB.input("activeby", body.activeby || null);

            const insertQuery = `
                INSERT INTO ms_state (statecode, statename, remarks, status, createdby, createdtime, activeby)
                OUTPUT INSERTED.statecode
                VALUES (@statecode, @statename, @remarks, @status, @createdby, GETDATE(), @activeby);
            `;

            const insertResult = await requestDB.query(insertQuery);

            return NextResponse.json(
                {
                    Output: {
                        status: {
                            code: 200,
                            message: "Saved successfully",
                        },
                        data: [insertResult.recordset[0]],
                    },
                },
                { status: 200 }
            );
        }

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
