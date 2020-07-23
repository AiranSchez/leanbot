import { File } from "../file/file";

export enum LogFiles {
  log = "historic.log",
  error = "errors.log"
}

export class Logger {
  private static info = (message: String, showInConsole: boolean = true) => {
    const log = `${currentTime()} ${message}`;
    if (showInConsole) console.info(log);
    File.write(log, LogFiles.log);
  }

  private static error = (message: String, error: any) => {
    const log = `${currentTime()} ${message}: ` + error;
    console.error(log);
    File.write(log, LogFiles.error);
    Logger.info(`${message} (see "${LogFiles.error}" file for more info)`, false);
  }

  static onBotStart = () => Logger.info(`Bot started`);
  static onBotStop = () => Logger.info(`Bot stopped`);
  static onApiStart = (port: number) => Logger.info(`API started in port ${port}`);
  static onScheduleStart = () => Logger.info(`Scheduler started`);
  static onRestartGratitude = () => Logger.info(`Weekly points have been restarted`);
  static onRegisterGratitude = () => Logger.info(`Monthly points have been registered`);
  static onHelp = () => Logger.info(`Someone asked for help`);
  static onLogs = () => Logger.info(`Someone looked at the logs`);
  static onLogsError = (error: any) => Logger.error(`Oops! There was an error when asked for the logs`, error);
  static onGratitude = (userFrom: string, userTo: string, points: number) => Logger.info(`${userTo} have been given ${points} points of gratitude from ${userFrom}`);
  static onRetrievePoints = (user: string) => Logger.info(`${user} has retrieve their points`);
  static onFileWriteError = (file: string, error: any) => Logger.error(`Oops! There was an error when write in ${file} file`, error);
  static onFileReadError = (file: string, error: any) => Logger.error(`Oops! There was an error when read ${file} file`, error);
  static onError = (error: any) => Logger.error(`Oops! There was an error`, error);
}

const currentTime = () => {
  const now: Date = new Date();
  const days = now.getDate();
  const months = now.getMonth() + 1;
  const years = now.getFullYear();
  const hours = now.getHours();
  const mins = now.getMinutes();
  const seconds = now.getSeconds();
  return `[${days}/${months}/${years} ${hours}:${mins}:${seconds}]`
}