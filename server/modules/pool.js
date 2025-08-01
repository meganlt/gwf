const pg = require('pg');
let pool;


// When our app is deployed to the internet, we'll use the
// DATABASE_URL environment variable to set the connection info.
// Example of a valid DATABASE_URL: 
  //  DATABASE_URL=postgresql://jDoe354:secretPw123@some.db.com/prime_app
if (process.env.DATABASE_URL) {
  pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
}
// When we're running this app on our own computer we'll connect to the
// postgres database that is also running on localhost:5432.
else {
  pool = new pg.Pool({
    host: 'localhost',
    port: 5432,
    database: 'grow-with-flora',   // 👈 Change this to the name of your database!
  });
}


module.exports = pool;
