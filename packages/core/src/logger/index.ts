import { chalk } from '@modern-js/codesmith-utils/chalk';
import { type Debugger, debug } from 'debug';
import { type ILogger, LoggerLevel } from './constants';

export { LoggerLevel };
export class Logger implements ILogger {
  level: LoggerLevel = LoggerLevel.Info;
  errorLogger: Debugger;
  warningLogger: Debugger;
  debugLogger: Debugger;
  timingLogger: Debugger;
  verboseLogger: Debugger;
  streamLogger: Debugger;

  constructor(level: LoggerLevel = LoggerLevel.Info, namespace = 'codesmith') {
    if (!process.env.DEBUG) {
      process.env.DEBUG = `${namespace}:*`;
      debug.enable(process.env.DEBUG);
    }
    this.level = level;
    this.warningLogger = debug(`${namespace}:warn`);
    this.errorLogger = debug(`${namespace}:error`);
    this.debugLogger = debug(`${namespace}:debug`);
    this.timingLogger = debug(`${namespace}:timing`);
    this.verboseLogger = debug(`${namespace}:verbose`);
    this.streamLogger = debug(`${namespace}:stream`);
  }

  info(...meta: any[]) {
    console.log(chalk.green('[INFO]'), ...meta);
  }

  error(message: string, ...args: any[]) {
    this.errorLogger(message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.warningLogger(message, ...args);
  }

  debug(message: string, ...args: any[]) {
    if (this.level === LoggerLevel.Timing) {
      return;
    }
    if (this.level === LoggerLevel.Debug) {
      this.debugLogger(message, ...args);
    }
  }

  timing(key: string, end?: boolean) {
    if (this.level !== LoggerLevel.Timing) {
      return;
    }
    if (end) {
      this.timingLogger(`[Time   End] ${key}`);
      console.timeEnd(key);
    } else {
      this.timingLogger(`[Time Start] ${key}`);
      console.time(key);
    }
  }

  verbose(message: string, ...args: any[]) {
    if (this.level === LoggerLevel.Verbose) {
      this.verboseLogger(message, ...args);
    }
  }

  stream(message: string, ...args: any[]) {
    if (this.level === LoggerLevel.Stream) {
      this.streamLogger(message, ...args);
    }
  }
}
