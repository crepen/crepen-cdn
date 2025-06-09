import { Injectable, Logger } from "@nestjs/common";
import { CrepenSystemRepository } from "./system.repository";
import { UserEntity } from "../user/entity/user.entity";
import { StringUtil } from "@crepen-nest/lib/util/string.util";
import { CrepenUserRouteService } from "../user/user.service";
import chalk from "chalk";
import { CrepenSystemPathType } from "@crepen-nest/interface/system";
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { ObjectUtil } from "@crepen-nest/lib/util/object.util";

@Injectable()
export class CrepenSystemService {


    private readonly DATA_DIR_PATH_LINUX = '/etc/crepen/cdn';
    private readonly DATA_DIR_PATH_WIN = 'C:\\ProgramData\\Crepen\\CDN';
    private readonly DATA_DIR_PATH_MAC = '/Library/Application Support/Crepen/CDN';

    private readonly LOG_DIR_PATH_LINUX = '/var/log/crepen/cdn/';
    private readonly LOG_DIR_PATH_WIN = 'C:\\ProgramData\\Crepen\\CDN\\logs\\';
    private readonly LOG_DIR_PATH_MAC = '/Library/Logs/Crepen/CDN/';


    constructor(
        private readonly dbRepo?: CrepenSystemRepository,
        private readonly userService?: CrepenUserRouteService
    ) { }

    static instance = (dbRepo?: CrepenSystemRepository, userService?: CrepenUserRouteService) => new CrepenSystemService(dbRepo, userService);




    initDatabase = async () => {

        const programVersion = this.getProgramVersion();
        const lastInitVersion = (await this.dbRepo.get('INIT_DATABASE'))?.value;


        Logger.log(`Program Version : ${chalk.bgGreen(programVersion)}`, 'INIT_DATABASE');
        Logger.log(`Last init version : ${chalk.bgGreen(lastInitVersion)}`, 'INIT_DATABASE');


        if (lastInitVersion !== programVersion) {
            const adminUserEntity: UserEntity = {
                id: 'admin',
                password: StringUtil.randomString(10),
                email: 'admin@admin.admin',
                name : 'Administrator'
            };

            const adminData = await this.userService.getUserDataById('admin');

            if (ObjectUtil.isNullOrUndefined(adminData)) {
                await this.userService.addUser({
                    password: adminUserEntity.password,
                    id: adminUserEntity.id,
                    email: adminUserEntity.email,
                    name : adminUserEntity.name
                })

                Logger.log(`ADMIN PASSWORD :  ${chalk.bgBlueBright(' ' + adminUserEntity.password + ' ')}`, 'INIT_DATABASE');
            }
   

  






            await this.dbRepo.set('INIT_DATABASE', programVersion);

        }


    }


    getProgramVersion = (): string | undefined => {
        try {
            const packageJsonPath = path.join(__dirname, '../../../package.json');
            const packageFile = fs.readFileSync(packageJsonPath, 'utf8')
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const pkg = JSON.parse(packageFile);

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (typeof pkg?.version !== 'string') {
                throw new Error();
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            return pkg.version as string;
        }
        catch (e) {
            return undefined;
        }
    }


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