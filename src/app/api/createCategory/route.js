"use server";
import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../lib/db";

export async function POST(request) {
  try {
    const requestBody = await request.json();
    const body = requestBody.data;

    const pool = await getDBConnection();
    const requestDB = pool.request();

    let categoryCodeToUse = body.CategoryCode;

    if (!categoryCodeToUse) {
      // Auto-generate next 3-digit category code only if CategoryCode not provided
      const getMaxCodeQuery = `SELECT MAX(CAST(categorycode AS INT)) AS maxCode FROM ms_category`;
      const maxCodeResult = await requestDB.query(getMaxCodeQuery);

      categoryCodeToUse = (parseInt(maxCodeResult.recordset[0].maxCode || "0", 10) + 1)
        .toString()
        .padStart(3, "0"); // Format to 3-digit
    }

    // Bind parameters
    requestDB.input("categorycode", categoryCodeToUse);
    requestDB.input("categoryname", body.categoryname);
    requestDB.input("remarks", body.remarks || null);
    requestDB.input("createdby", body.createdby);
    requestDB.input("status", body.status || "Active");
    requestDB.input("activeby", body.activeby || null);

    let queryResult;

    if (body.CategoryCode) {
      // Update case
      const updateQuery = `
        UPDATE ms_category
        SET categoryname = @categoryname,
            remarks = @remarks,
            status = @status,
            activeby = @activeby
        WHERE categorycode = @categorycode;

        SELECT @categorycode AS categorycode; -- return categorycode
      `;
      queryResult = await requestDB.query(updateQuery);
    } else {
      // Insert case
      const insertQuery = `
        INSERT INTO ms_category (categorycode, categoryname, remarks, createdby, createdtime, status, activeby)
        OUTPUT INSERTED.categorycode
        VALUES (@categorycode, @categoryname, @remarks, @createdby, GETDATE(), @status, @activeby);
      `;
      queryResult = await requestDB.query(insertQuery);
    }

    return NextResponse.json(
      {
        Output: {
          status: {
            code: 200,
            message: body.categorycode ? "Updated successfully" : "Saved successfully",
          },
          data: [queryResult.recordset[0]],
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
