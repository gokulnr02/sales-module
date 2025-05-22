"use server";
import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../lib/db";

export async function POST(request) {
    try {
        const requestBody = await request.json();
        const body = requestBody.data;

        const pool = await getDBConnection();
        const requestDB = pool.request();

        const openingCredit = parseFloat(body.openingcredit) || 0;
        const openingDebit = parseFloat(body.openingdebit) || 0;
        const balance = openingCredit - openingDebit;

        // Common inputs
        requestDB.input("customername", body.customername || "");
        requestDB.input("address1", body.address1 || "");
        requestDB.input("address2", body.address2 || "");
        requestDB.input("address3", body.address3 || "");
        requestDB.input("phonenumber", body.phonenumber || "");
        requestDB.input("gstnumber", body.gstnumber || "");
        requestDB.input("openingcredit", openingCredit);
        requestDB.input("openingdebit", openingDebit);
        requestDB.input("balance", balance);
        requestDB.input("statecode", body.statecode || "");
        requestDB.input("status", 1);
        requestDB.input("createdby", body.createdby || "Admin");
        requestDB.input("createdtime", body.createdtime || "");
        requestDB.input("activeby", body.activeby || "Admin");

        let query = "";
        let result;

        const isEdit = body.isEdit || false;
        requestDB.input("suppliercode", body.suppliercode || "");
        requestDB.input("customername", body.customername);

        if (!isEdit) {
            // Validation for duplicate customername and suppliercode
            const duplicateCheck = await requestDB.query(
                `SELECT suppliercode FROM ms_suppliermaster 
                 WHERE suppliercode = @suppliercode AND customername = @customername`
            );

            if (duplicateCheck.recordset.length > 0) {
                return NextResponse.json(
                    {
                        Output: {
                            status: {
                                code: 400,
                                message: "This customer already exists with the same supplier code.",
                            },
                        },
                    },
                    { status: 400 }
                );
            }
        }

        if (isEdit) {
            // Check if supplier exists (for update scenario)
            const checkResult = await requestDB.query(
                `SELECT suppliercode FROM ms_suppliermaster WHERE suppliercode = @suppliercode`
            );

            if (checkResult.recordset.length > 0) {
                // UPDATE
                query = `
                    UPDATE ms_suppliermaster SET
                        customername = @customername,
                        address1 = @address1,
                        address2 = @address2,
                        address3 = @address3,
                        phonenumber = @phonenumber,
                        gstnumber = @gstnumber,
                        openingcredit = @openingcredit,
                        openingdebit = @openingdebit,
                        balance = @balance,
                        statecode = @statecode,
                        status = @status,
                        createdby = @createdby
                    WHERE suppliercode = @suppliercode;

                    SELECT * FROM ms_suppliermaster WHERE suppliercode = @suppliercode;
                `;
                result = await requestDB.query(query);
            } else {
                // INSERT with supplied suppliercode
                query = `
                    INSERT INTO ms_suppliermaster 
                        (suppliercode, customername, address1, address2, address3, phonenumber, gstnumber, openingcredit, openingdebit, balance, statecode, status, createdby)
                    OUTPUT INSERTED.suppliercode
                    VALUES 
                        (@suppliercode, @customername, @address1, @address2, @address3, @phonenumber, @gstnumber, @openingcredit, @openingdebit, @balance, @statecode, @status, @createdby);
                `;
                result = await requestDB.query(query);
            }
        } else {
            // INSERT without suppliercode (auto-generate or DB trigger assumed)
            query = `
                INSERT INTO ms_suppliermaster 
                    (customername, address1, address2, address3, phonenumber, gstnumber, openingcredit, openingdebit, balance, statecode, status, createdby)
                OUTPUT INSERTED.suppliercode
                VALUES 
                    (@customername, @address1, @address2, @address3, @phonenumber, @gstnumber, @openingcredit, @openingdebit, @balance, @statecode, @status, @createdby);
            `;
            result = await requestDB.query(query);
        }

        return NextResponse.json(
            {
                Output: {
                    status: {
                        code: 200,
                        message: isEdit ? "Updated successfully" : "Saved successfully",
                    },
                    data: result.recordset || [],
                },
            },
            { status: 200 }
        );

    } catch (err) {
        console.error("Error in Save/Update Supplier:", err.message);
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
