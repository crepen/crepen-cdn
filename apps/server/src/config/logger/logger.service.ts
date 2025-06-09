import { Injectable } from "@nestjs/common";
import { WinstonModule } from 'nest-winston';
import * as Winston from 'winston';
import * as path from "path";
import { ConfigService } from "@nestjs/config";
import 'winston-daily-rotate-file';
import chalk from "chalk";
import { CrepenSystemService } from "@crepen-nest/app/system/system.service";

@Injectable()
export class CrepenLoggerConfigService {

    IGNORE_LOG_CONTEXT = ['RoutesResolver', 'RouterExplorer', 'NestApplication', 'InstanceLoader']

    constructor(
        private readonly configService: ConfigService,
        private readonly envConfig: CrepenSystemService
    ) { }


    getWinstonLogger = () => WinstonModule.createLogger(this.getWinstonOptions())

    private getWinstonOptions = (): Winston.LoggerOptions => {

        const logPath = this.envConfig.getGlobalPath('log');

        return {
            level: 'info',
            format: Winston.format.combine(
                Winston.format((info) => {
                    try {
                        if (process.env.NODE_ENV !== 'dev') {
                            if (this.IGNORE_LOG_CONTEXT.indexOf(info.context as string) > -1) {
                                return false;
                            }
                        }
                    }
                    catch (e) { }

                    return info;
                })(),
                Winston.format.timestamp(),
                Winston.format.errors({ stack: false }),
                // Winston.format.json()
                Winston.format.printf((info) => {
                    return JSON.stringify({
                        time: info.timestamp,
                        level: info.level.toUpperCase(),
                        context: info.context || null,
                        message: info.message
                    })
                })
            ),
            transports: [
                new Winston.transports.Console({
                    format: Winston.format.combine(
                        Winston.format.timestamp(),
                        // Winston.format.colorize({all : true}),
                        Winston.format.errors({ stack: false }),
                        // NestWinston.utilities.format.nestLike('Crepen-CDN', {
                        //     prettyPrint: true,
                        //     appName: false,
                        // })
                        Winston.format.printf((info) => {
                            // console.log("131" , info)  
                            let levelColor = chalk.bold(info.level.toUpperCase().padStart(6).padEnd(7));
                            switch (info.level.toUpperCase()) {
                                case 'INFO': levelColor = chalk.green(levelColor); break;
                                case 'ERROR': levelColor = chalk.red(levelColor); break;
                                case 'WARN': levelColor = chalk.yellow(levelColor); break;
                                // default : levelColor = chalk.reset(levelColor);break;
                            }

                            return `[${info.timestamp as string}] ${levelColor} [${chalk.yellow(info.context ?? '')}]  ${info.message  as string}`
                        })
                    )
                }),
                new Winston.transports.DailyRotateFile({
                    filename: path.join(logPath, 'error-%DATE%.json'),
                    datePattern: "YYYY-MM-DD",
                    maxFiles: '15d',
                    level: 'error',
                }),
                new Winston.transports.DailyRotateFile({
                    filename: path.join(logPath, 'error-%DATE%.log'),
                    level: 'error',
                    datePattern: "YYYY-MM-DD",
                    maxFiles: '15d',
                    format: Winston.format.printf((info) => {
                        return `[${info.timestamp as string}] ${info.message as string}`
                    })
                }),
                new Winston.transports.DailyRotateFile({
                    filename: path.join(logPath, 'all-%DATE%.json'),
                    datePattern: "YYYY-MM-DD",
                    maxFiles: '15d',
                }),
                new Winston.transports.DailyRotateFile({
                    filename: path.join(logPath, 'all-%DATE%.log'),
                    datePattern: "YYYY-MM-DD",
                    maxFiles: '15d',
                    format: Winston.format.printf((info) => {
                        return `[${info.timestamp as string}] ${info.level.toUpperCase()}\t ${info.message as string}`
                    })
                }),
            ]
        }

    }
}