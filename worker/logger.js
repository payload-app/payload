const winston = require('winston')

const logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: './worker.log',
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false,
    }),
    new winston.transports.Console({
      level: 'debug',
      json: false,
      colorize: true,
    }),
  ],
  exitOnError: false,
})

let loggerMetadata = {}

const mergeLoggerMetadata = ({ metadata = {} }) => {
  loggerMetadata = {
    ...loggerMetadata,
    ...metadata,
  }
}

const resetLoggerMetadata = () => (loggerMetadata = {})

const log = ({ level, message, data = {} }) =>
  logger.log(level, message, { ...loggerMetadata, ...data })

const error = ({ message, data }) => log({ level: 'error', message, data })
const warn = ({ message, data }) => log({ level: 'warn', message, data })
const info = ({ message, data }) => log({ level: 'info', message, data })
const verbose = ({ message, data }) => log({ level: 'verbose', message, data })
const debug = ({ message, data }) => log({ level: 'debug', message, data })
const silly = ({ message, data }) => log({ level: 'silly', message, data })

module.exports = {
  logger: {
    mergeLoggerMetadata,
    resetLoggerMetadata,
    log,
    error,
    warn,
    info,
    verbose,
    debug,
    silly,
  },
}
