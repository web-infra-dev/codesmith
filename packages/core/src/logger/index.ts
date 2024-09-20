import { chalk } from '@modern-js/utils';
import { type ILogger, LoggerLevel } from './constants';

export class Logger implements ILogger {
  level: LoggerLevel = LoggerLevel.Info;

  constructor(level: LoggerLevel = LoggerLevel.Info) {
    this.level = level;
  }

  error(...meta: any[]) {
    console.log(chalk.red('[ERROR]'), ...meta);
  }

  warn(...meta: any[]) {
    console.log(chalk.yellow('[WARN]'), ...meta);
  }

  info(...meta: any[]) {
    console.log(chalk.green('[INFO]'), ...meta);
  }

  debug(...meta: any[]) {
    if (this.level === LoggerLevel.Debug) {
      console.log(chalk.blue('[DEBUG]'), ...meta);
    }
  }

  timing(key: string, end?: boolean) {
    if (this.level !== LoggerLevel.Timing) {
      return;
    }
    if (end) {
      console.timeEnd(key);
    } else {
      console.time(key);
    }
  }

  verbose(...meta: any[]) {
    if (this.level === LoggerLevel.Verbose) {
      console.log('[VERBOSE]', ...meta);
    }
  }

  stream(...meta: any[]) {
    if (this.level === LoggerLevel.Stream) {
      console.log('[STREAM]', ...meta);
    }
  }
}
