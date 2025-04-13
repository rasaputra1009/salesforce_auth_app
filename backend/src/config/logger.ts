import winston from 'winston';
import 'winston-daily-rotate-file';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

// Setup daily rotation for logs
const dailyRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/%DATE%-combined.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d', // Keeps logs for 14 days
  level: 'info',
});

const errorDailyRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/%DATE%-error.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d', // Keeps error logs for 14 days
  level: 'error',
});

// Logger instance
const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      ),
    }),
    dailyRotateTransport,
    errorDailyRotateTransport,
  ],
});

// Example log levels with colors and different output
winston.addColors({
  info: 'green',
  warn: 'yellow',
  error: 'red',
  debug: 'blue',
});

export default logger;
