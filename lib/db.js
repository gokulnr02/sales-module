import sql from 'mssql';

const config = {
    user: 'db_9e515d_latha_admin',
    password: 'Password123',
    database:'db_9e515d_latha',
    server: 'sql5113.site4now.net',
    port:1433,
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  };
  

let poolPromise;

export async function getDBConnection() {
  if (!poolPromise) {
    try {
        //console.log(config,'config')
      poolPromise = await sql.connect(config);
      console.log('✅ MSSQL Connected');
    } catch (error) {
      console.log(error,'db connection error');
    }
    
  }
  return poolPromise;
}


