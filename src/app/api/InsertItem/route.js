"use server";
import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../lib/db";

export async function POST(request) {
    try {
        const requestBody = await request.json();
        const body = requestBody.data;
        const isEdit = body.isEdit;
        console.log(isEdit, "isEdit flag in InsertItem API");
        const pool = await getDBConnection();
        const requestDB = pool.request();

        const {
            itemcode,
            itemname,
            hsncode,
            uomname,
            categorycode,
            taxcode,
            status,
            createdby
        } = body;

        if (!itemcode || !itemname) {
            return NextResponse.json(
                {
                    Output: {
                        status: {
                            code: 400,
                            message: "Item code and item name are required.",
                        },
                    },
                },
                { status: 400 }
            );
        }

        requestDB.input("itemcode", itemcode);
        requestDB.input("itemname", itemname);
   
        if (!isEdit) {
        
            const duplicateCheck = await requestDB.query(`
                SELECT itemcode FROM ms_item 
                WHERE itemcode = @itemcode AND itemname = @itemname
            `);
            if (duplicateCheck.recordset.length > 0) {
                return NextResponse.json(
                    {
                        Output: {
                            status: {
                                code: 400,
                                message: "This item code and item name already exists.",
                            },
                        },
                    },
                    { status: 400 }
                );
            }
        }

 
        requestDB.input("hsncode", hsncode);
        requestDB.input("uomname", uomname);
        requestDB.input("categorycode", categorycode);
        requestDB.input("taxcode", taxcode);
        requestDB.input("status", status);
        requestDB.input("createdby", createdby);

        if (isEdit) {
            // UPDATE scenario
            const updateQuery = `
                UPDATE ms_item
                SET itemname = @itemname,
                    hsncode = @hsncode,
                    uomname = @uomname,
                    categorycode = @categorycode,
                    taxcode = @taxcode,
                    status = @status,
                    createdby = @createdby
                WHERE itemcode = @itemcode;
            `;
            await requestDB.query(updateQuery);

            return NextResponse.json(
                {
                    Output: {
                        status: {
                            code: 200,
                            message: "Updated Successfully",
                        },
                        data: [body],
                    },
                },
                { status: 200 }
            );
        } else {
            // INSERT scenario
            const query = `INSERT INTO ms_item (itemcode, itemname, hsncode, uomname, categorycode, taxcode, status, createdby)
            OUTPUT INSERTED.itemcode  -- Return the inserted itemcode
        VALUES (@itemcode, @itemname, @hsncode, @uomname, @categorycode, @taxcode, @status, @createdby);
`;
            const result = await requestDB.query(query);
           console.log(result, "Insert result");
            return NextResponse.json(
                {
                    Output: {
                        status: {
                            code: 200,
                            message: "Saved Successfully",
                        },
                        data: result.recordset || [],
                    },
                },
                { status: 200 }
            );
        }
    } catch (err) {
        console.error("Error in saving/updating item:", err.message);
        return NextResponse.json(
            {
                Output: {
                    status: {
                        code: 500,
                        message: err.message,
                    },
                },
            },
            { status: 500 }
        );
    }
}
