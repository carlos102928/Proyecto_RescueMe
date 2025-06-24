
import mysql from "mysql2/promise";

export const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Trollface12345",
    database: "proyecto2",
    waitForConnections: true,
    connectionLimit: 10,
})