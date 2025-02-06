import { createLogger, format, transports, addColors } from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: 'blue',
        debug: 'white',
    },
};

addColors(logLevels.colors);

const devLogger = createLogger({
    levels: logLevels.levels,
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`)
    ),
    transports: [
        new transports.Console({
            level: 'debug',
        }),
    ],
});

const prodLogger = createLogger({
    levels: logLevels.levels,
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console({
            level: 'info',
        }),
        new transports.File({
            filename: path.resolve(__dirname, '../../logs/errors.log'), 
            level: 'error',
        }),
    ],
});

const logger = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;

export default logger;
