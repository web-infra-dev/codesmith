export enum LoggerLevel {
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug',
  Verbose = 'verbose',
  Stream = 'stream',
  Timing = 'timing',
}

// define log lever priprity
export const LevelPriority = [
  LoggerLevel.Error,
  LoggerLevel.Warn,
  LoggerLevel.Info,
  LoggerLevel.Timing,
  LoggerLevel.Debug,
  LoggerLevel.Verbose,
  LoggerLevel.Stream,
];

type LeveledLogMethod = (...meta: any[]) => void;

type TimingMethod = (key: string, end?: boolean) => void;

export interface ILogger {
  level: LoggerLevel;
  // for cli and npm levels
  [LoggerLevel.Error]: LeveledLogMethod;
  [LoggerLevel.Warn]: LeveledLogMethod;
  [LoggerLevel.Info]: LeveledLogMethod;
  [LoggerLevel.Timing]: TimingMethod;
  [LoggerLevel.Debug]: LeveledLogMethod;
  [LoggerLevel.Verbose]: LeveledLogMethod;
  [LoggerLevel.Stream]: LeveledLogMethod;
}
