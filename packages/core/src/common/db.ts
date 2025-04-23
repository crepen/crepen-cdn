import mariadb from 'mysql2/promise';

export const getPool = () => {

    return mariadb.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
        connectionLimit: 5,
        connectTimeout: 1000
    })
}