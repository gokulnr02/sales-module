"use server";
import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../lib/db";

export async function POST() {
  try {

    const pool = await getDBConnection();

    const query = `sp_helptext2 UserLogin`;

    const qryExec = await pool.request().query(query);

    const result = qryExec.recordset[0] || null;
    
    const loginStatus = result?.LoginStatus || 0; 
    return NextResponse.json(
      {
        Output: {
          status: {
            code:  200 ,
            message: " Success" ,
          },
          data: { LoginStatus: loginStatus },
        },
      },
      { status: 200 }
    );
   
  } catch (err) {
    // console.error("Error in login API:", err.message);
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
