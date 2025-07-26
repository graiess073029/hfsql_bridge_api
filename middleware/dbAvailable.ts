import { CustomRequest, HttpResponse } from '../types/types.js';
import { DB_STATE, reconnect } from './../db/connect';
import { NextFunction } from "express";
import { CustomResponse } from "../types/types";

/**
 * Middleware to check the availability of the database connection.
 * Gives the user the ability to access to the execution route only if the database is connected.
 * @param {CustomRequest} req - The request object with custom properties.
 * @param {CustomResponse} res - The response object with custom properties.
 * @param {NextFunction} next - The function to call the next middleware or route handler.
 * @returns {Promise<any>} - A promise that resolves once the middleware processing is complete.
 */

export const dbAvailable = async (req: CustomRequest, res: CustomResponse, next: NextFunction): Promise<any> => {

    try {

        if (DB_STATE) {
            req.skipRoute = false;
            next();
            return
        }
        
        const response : HttpResponse = {
            state: 'error',
            message: "Database is not connected, trying to reconnect..."
        }

        reconnect();

        req.skipRoute = true;
        res.status(503).json(response);
        res.body = response;
        next();

    }

    catch (err) {

        next(err)
    
    }
    }