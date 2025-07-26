import { config } from './../config/config';
import { CustomRequest } from '../types/types.js';
import { execute } from './../db/execute';
import { NextFunction } from "express"
import { HttpResponse } from '../types/types.js';
import { CustomResponse } from '../types/types.js';


/**
 * A middleware that executes a query given in the body of the request
 * @param {CustomRequest} req - the request object
 * @param {CustomResponse} res - the response object
 * @param {NextFunction} next - the next function
 * @returns {Promise<any>} - a promise that resolves with the result of the request
 * 
 * This middleware expects a sql query to be given in the body of the request
 * as a string. This will be executed by the database and the result will be returned
 * in the response.
 */
export const execute_query = async (req: CustomRequest, res: CustomResponse, next: NextFunction): Promise<any> => {

    try {

        if (req.skipRoute) {
            next();
            return;
        }

        if (req.body?.secretKey !==  config.server.secretKey) {

            let response: HttpResponse = {
                state: 'error',
                message: "Invalid secret key"
            };

            res.status(401).json(response);
            res.body = response;
            next();
            return;

        }

        const query : string = req.body?.query;

        if (!query) {

            let response : HttpResponse = {
                state: 'error',
                message: "Query is required"
            };

            res.status(400).json(response);

            res.body = response;
            next();
            return;
        }

        const result = await execute(query);

        let response : HttpResponse = {
            state: result.state,
            message: result.message,
            data: result.data
        };

        res.status(200).json(response);
        res.body = response;
        next();
        

    }

    catch (err) {
        next(err); 
    }
    }