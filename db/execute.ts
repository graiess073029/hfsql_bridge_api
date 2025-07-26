import { getCnx } from './connect.js';
import { SqlResponse } from "../types/types.js";
import  {Connection} from 'odbc';


/**
 * Executes a SQL query on the database.
 * 
 * @param {string} query The SQL query to be executed
 * @returns {Promise<SqlResponse>} A promise that resolves with the result of the query.
 */
export const execute = async (query : string) : Promise<SqlResponse> => {

    const {cnx} = (await getCnx()).data as { cnx?: Connection };


    try{

        
        if (!cnx) {
            throw new Error("Connection is null");
        }

        const result = await cnx?.query(query);

        let response: SqlResponse = {
            state: "success",
            message: "Query executed successfully",
            data: { res : JSON.stringify(result) }
        }

        cnx?.close();
        return response;

    }

    catch(err) {

        let response: SqlResponse = {
            state: "error",
            message: "An error occurred while executing the query",
            data: { error: err }
        }

        cnx?.close();
        return response;

    }


}