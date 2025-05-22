import sql from "mssql";


const config = 'Server=sql5113.site4now.net,1433;Database=db_9e515d_latha;User Id=db_9e515d_latha_admin;Password=Password123;Encrypt=false;TrustServerCertificate=true;';
let dbPool;

export async function connectDB() {
  try {
    if (!dbPool) {
      dbPool = await sql.connect(config);
      console.log("✅ Connected to MSSQL database");
    }
    return dbPool;
  } catch (error) {
   console.log(error,'Db connection error')
  }
}
