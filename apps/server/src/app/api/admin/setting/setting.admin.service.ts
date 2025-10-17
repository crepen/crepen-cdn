import { Injectable } from "@nestjs/common";
import { AdminAuthMode } from "../auth/dto/auth.admin.response";
import { DynamicConfigService } from "@crepen-nest/app/config/dynamic-config/dynamic-config.service";
import { CrepenPropertyDataEntity } from "./dto/property.setting.data.entity";
import { DataSource } from "typeorm";

@Injectable()
export class CrepenAdminSettingService {
    constructor(
        private readonly dynamicConfig : DynamicConfigService
    ){}

    getProperties = async (mode : AdminAuthMode) => {

        let isDatabaseConnect : boolean = false;

        try{
            const database = new DataSource({
                type : 'mariadb',
                host : this.dynamicConfig.getConfig().db.host,
                port : this.dynamicConfig.getConfig().db.port,
                username : this.dynamicConfig.getConfig().db.username,
                password : this.dynamicConfig.getConfig().db.password,
                database : this.dynamicConfig.getConfig().db.database,
                synchronize : false,
            })

            await database.initialize();
            await database.destroy();

            isDatabaseConnect = true;
        }
        catch(e){
            isDatabaseConnect = false;
        }


        const propData : CrepenPropertyDataEntity = {
            db : {
                ...this.dynamicConfig.getConfig().db,
                password : 'secret-value',
                connectState : isDatabaseConnect
            }
        }

        return propData;
    }
}