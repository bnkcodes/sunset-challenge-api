import { Injectable } from '@nestjs/common'
import { Logger, createLogger, format } from 'winston'

import { ILogger } from '../interface/logger'
import { LoggerInput, LoggerOutput } from '../types/logger'

@Injectable()
export class LoggerService implements ILogger {
  private logger: Logger

  constructor(private readonly service: string) {
    this.logger = createLogger({
      format: format.combine(format.timestamp(), format.json()),
      defaultMeta: { service },
    })
  }

  private createLogFunction = (level: string, code: string, message: string, data?: any) => {
    this.logger[level]({ code, message, data })
  }

  public info = ({ code, message, data }: LoggerInput): LoggerOutput => {
    this.createLogFunction('info', code, message, data)
  }

  public warn = ({ code, message, data }: LoggerInput): LoggerOutput => {
    this.createLogFunction('warn', code, message, data)
  }

  public debug = ({ code, message, data }: LoggerInput): LoggerOutput => {
    this.createLogFunction('debug', code, message, data)
  }

  public error = ({ code, message, data }: LoggerInput): LoggerOutput => {
    this.createLogFunction('error', code, message, data)
  }
}
