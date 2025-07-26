import { logger2 } from './logs/loggers/logger_part2';
import { logger1 } from './logs/loggers/logger_part1.js';
import { createServer, Server } from 'http';
import { errorLogger } from './logs/loggers/errorLogger.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import express, { Application, NextFunction, Request } from "express"
import { HttpResponse } from './types/types.js';
import { CustomResponse } from './types/types.js';
import { config } from './config/config.js';
import { existsSync, readFileSync } from 'fs'
import { createServer as createHttpsServer, Server as HttpsServer } from 'https';
import { log } from './utils/log.js';
import { execute_query, } from './routes/execute.js';
import { dbAvailable } from './middleware/dbAvailable';
import path from 'path';

// Initializing the express application and the server
const app: Application = express()
let server: Server | HttpsServer;

// Choosing the protocol (http | https)
const sslCertPath = path.join(process.cwd() , "/config/ssl/" , config.server.sslOptions.cert);
const sslKeyPath = path.join(process.cwd() , "/config/ssl/" , config.server.sslOptions.key);
if (!existsSync(sslKeyPath) || !existsSync(sslCertPath) || !config.server.sslOptions.cert || !config.server.sslOptions.key) {
    ( async() =>await log("SSL certificate or key file not found. The server will run as 'http' server."));
    server = createServer(app)
}

else {

    const sslConfig = {
        key: readFileSync(sslKeyPath, { encoding: "utf-8" }),
        cert: readFileSync(sslCertPath, { encoding: "utf-8" })
    }
    server = createHttpsServer(sslConfig, app)
}

// Setting up middlewares options

const corsOptions = {
    origin: config.server.origin,
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
    optionsSuccessStatus: 200
};

const rateLimitOptions = {
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { state: 'error', message: 'Too many requests from this IP, please try again after 15 minutes', statusCode: 401, link: "" },
    standardHeaders: true,
    legacyHeaders: false,
}

// Setting up middlewares

app.use(logger1)
app.use(helmet())
app.use(rateLimit(rateLimitOptions))
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

// Setting up routes

app.get("/", async (req: Request, res: CustomResponse, next: NextFunction): Promise<any> => {

    let response: HttpResponse = {
        state: "success",
        message: "Api working without isssues"
    }

    res.body = response
    res.json(response)
    next()
    return;
})

app.use(dbAvailable)

app.post("/execute",execute_query)

// Error and response logging middleweare

app.use(errorLogger)
app.use(logger2)

export default server;

