import { Response, Request } from "express";

/**
 * @fileoverview Type definitions
 * Contains interfaces and types used throughout the application
 */

export interface CustomResponse extends Response {
  body?: HttpResponse
}

export interface CustomRequest extends Request {
  startTime?: Date;
  id? : string;
  skipRoute? : boolean;
}

export interface databaseParams {
  dsn : string,
  user: string,
  password : string
}


export interface appConfig {
  database: databaseParams,
  server : {
    origin: Array<string> | string,
    sslOptions: { key: string, cert: string },
    serverPort: number,
    secretKey?: string,
    host : string
  }
}
export interface SqlResponse {
  state: 'success' | "error";
  message: string;
  data?: object[] | object;
}

export interface SqlResponses {
  [key: string]: SqlResponse;
}

export interface HttpResponse {
  state : 'success' | 'error';
  message: string;
  data?: object | any[]
}


