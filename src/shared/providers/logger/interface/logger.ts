import { LoggerInput, LoggerOutput } from '../types/logger'

export abstract class ILogger {
  abstract info(data: LoggerInput): LoggerOutput
  abstract warn(data: LoggerInput): LoggerOutput
  abstract debug(data: LoggerInput): LoggerOutput
  abstract error(data: LoggerInput): LoggerOutput
}
