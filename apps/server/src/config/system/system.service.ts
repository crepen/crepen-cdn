import { Injectable } from "@nestjs/common";
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { CrepenSystemPathType } from "./interface/system";

@Injectable()
export class CrepenSystemConfigService {

    private readonly DATA_DIR_PATH_LINUX = '/etc/crepen/cdn';
    private readonly DATA_DIR_PATH_WIN = 'C:\\ProgramData\\Crepen\\CDN';
    private readonly DATA_DIR_PATH_MAC = '/Library/Application Support/Crepen/CDN';

    private readonly LOG_DIR_PATH_LINUX = '/var/log/crepen/cdn/';
    private readonly LOG_DIR_PATH_WIN = 'C:\\ProgramData\\Crepen\\CDN\\logs\\';
    private readonly LOG_DIR_PATH_MAC = '/Library/Logs/Crepen/CDN/';

    constructor() { }

    getGlobalPath = (type?: CrepenSystemPathType) => {
        let rootFolder = '';

        if (type !== 'log') {
            if (os.type() === 'Linux') {
                rootFolder = this.DATA_DIR_PATH_LINUX;
            }
            else if (os.type() === 'Windows_NT') {
                rootFolder = this.DATA_DIR_PATH_WIN;
            }
            else if (os.type() === 'Darwin') {
                rootFolder = this.DATA_DIR_PATH_MAC;
            }

            let appendPath: string | undefined = undefined;

            switch (type) {
                case "config": appendPath = 'config'; break;
            }

            if (appendPath) {
                rootFolder = path.join(rootFolder, appendPath);
            }
        }
        else {
            if (os.type() === 'Linux') {
                rootFolder = this.LOG_DIR_PATH_LINUX;
            }
            else if (os.type() === 'Windows_NT') {
                rootFolder = this.LOG_DIR_PATH_WIN;
            }
            else if (os.type() === 'Darwin') {
                rootFolder = this.LOG_DIR_PATH_MAC;
            }
        }


        return rootFolder;
    }
}