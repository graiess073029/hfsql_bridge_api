import { log } from '../utils/log.js';
import { SqlResponse } from '../types/types.js';
import { config } from './../config/config.js';
import odbc, { NodeOdbcError, Pool } from 'odbc'


const connectionString = `DSN=${config.database.dsn};UID=${config.database.user};PWD=${config.database.password}`;
export let DB_STATE: boolean = false;
let pool: Pool | null = null;

/**
 * Gets a connection pool from the ODBC driver manager.
 * @returns {Promise<SqlResponse>} A promise that resolves with a SqlResponse object.
 */
export const getPool = async (): Promise<SqlResponse> => {

    try {
        const pool_ = await odbc.pool(connectionString);
        DB_STATE = true
        pool = pool_

        let response: SqlResponse = {
            state: "success",
            message: "Connected to the database successfully",
        }

        await log("Connected to the database successfully");


        return response


    }

    catch (err) {

        DB_STATE = false

        await log(JSON.stringify((err as NodeOdbcError)), "error");

        if ((err as NodeOdbcError).odbcErrors) {

            let response: SqlResponse = {
                state: "error",
                message: "many errors occurred while connecting to the database",
                data: (err as NodeOdbcError).odbcErrors.map((err) => ({ code: err.code, message: err.message, state: err.state }))
            }

            return response

        }

        let response: SqlResponse = {
            state: "error",
            message: "An error occured while connecting to the database",
            data: { error: (err as NodeOdbcError) }
        }

        return response
    }

};


/**
 * Attempts to re-establish a database connection by calling `getPool` at regular intervals.
 */
export const reconnect = async (): Promise<void> => {
/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Attempts to re-establish a database connection by calling `getPool` at regular intervals.
 * 
 * This function sets up an interval to check the `DB_STATE`. If the database is not connected,
 * it will attempt to reconnect by calling `getPool`. Once the connection is re-established,
 * the interval is cleared.
 * 
 * The interval is set to run every 5000 milliseconds (5 seconds).
 */

/*******  0fff9ffc-0d4b-4f11-9c76-49ce13bac3eb  *******/    const interval = setInterval(
        async () => {

            if (!DB_STATE) {
                await getPool()
                return;
            }

            clearInterval(interval);

        },
        5000
    )
};

/**
 * Retrieves a connection from the pool.
 * @returns {Promise<SqlResponse>} a promise that resolves with a success or error response
 * 
 */
export const getCnx = async (): Promise<SqlResponse> => {

    try {

        if (!DB_STATE) {

            reconnect();
            let response : SqlResponse = {
                state: "error",
                message: "Database is not connected, trying to reconnect..."
            }

            return response;

        }

        const cnx = await pool?.connect();

        if (!cnx) {
            throw new Error("Connection is null");
        }

        let response: SqlResponse = {
            state: "success",
            message: "Connection established successfully",
            data: { cnx }
        }

        return response;


    }

    catch (err) {

        let response: SqlResponse = {
            state: "error",
            message: "An error occured while getting the connection",
            data: { error: JSON.stringify((err as NodeOdbcError)) }
        }

        return response

    }

};


reconnect();