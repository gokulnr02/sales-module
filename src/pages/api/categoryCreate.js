import { connectDB } from "../../utils/db";
import sql from "mssql";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    await connectDB();
    const { categorycode, categoryname, remarks, createdby, createdtime, status, activeby } = req.body; // Use req.body instead of req.json()

    const result = await sql.query`
      EXEC InsertCategory 
        ${categorycode}, 
        ${categoryname},
        ${remarks},
        ${createdby},
        ${createdtime},${status},${activeby}`;
    return res.status(200).json({ success: true, data: result.recordset });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
}
