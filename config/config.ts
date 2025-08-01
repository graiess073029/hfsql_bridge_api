import { parseArray } from './../utils/parseArray.js';
import dotenv from 'dotenv';
import { appConfig } from "../types/types.js";
import chalk from 'chalk';

/**
 * This file contains the configuration for the application.
 * The configuration is loaded from the .env file.
 * @module config
 */


dotenv.config()

const originArray = () => {
    const res = parseArray(process.env.ORIGIN as string)

    if (res instanceof Error) {

        console.log(chalk.red("Please write a valid array in the ORIGIN env variable or write a single origin."))
        process.exit(1);

    }

    return res

}

export const config: appConfig = {

    database: {
        user: process.env.USERNAME || "",
        password: process.env.PASSWORD || "",
        dsn: process.env.DSN || "",

    },

    server: {
    origin: process.env.ORIGIN?.startsWith("[") ? originArray() : process.env.ORIGIN as string,
        sslOptions: {
            key: process.env.KEY as string,
            cert: process.env.CERT as string,

        },
        serverPort: Number(process.env.SERVERPORT),
        host: process.env.HOST || "",
        secretKey: process.env.SECRET_KEY || "^AtfVfvjèMybXr(g$P24)"

    }


}

console.log(config.server.serverPort)