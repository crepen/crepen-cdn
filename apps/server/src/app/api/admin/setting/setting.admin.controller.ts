import { Body, Controller, Get, HttpCode, HttpStatus, Put, UseGuards } from "@nestjs/common";
import { UserRoleEnum } from "../../user/enum/user-role.enum";
import { BaseResponse } from "@crepen-nest/lib/common/base.response";
import { I18n, I18nContext } from "nestjs-i18n";
import { TokenTypeEnum } from "../../auth/enum/token-type.auth.request";
import { AuthUser } from "@crepen-nest/lib/extensions/decorator/param/auth-user.param.decorator";
import { UserEntity } from "../../user/entity/user.default.entity";
import { DataSource } from "typeorm";
import { SetDatabaseRequest } from "./dto/database.setting.admin.request";
import { CrepenAdminSettingService } from "./setting.admin.service";
import { DynamicConfigService } from "@crepen-nest/app/config/dynamic-config/dynamic-config.service";
import { CommonJwtGuard } from "@crepen-nest/app/config/passport/guards/common-jwt/common-jwt.guard";
import { AllowTokenTypeGuard } from "@crepen-nest/modules/token/allow-token-type.guard";
import { AllowTokenType } from "@crepen-nest/modules/token/allow-token-type.decorator";
import { CrepenTokenContext, CrepenTokenType } from "@crepen-nest/interface/common-jwt";
import { TokenContext } from "@crepen-nest/modules/token/token-data.decorator";
import { AllowRoles } from "@crepen-nest/modules/token/allow-role.decorator";
import { AllowRoleGuard } from "@crepen-nest/modules/token/allow-role.guard";
import { CommonError } from "@crepen-nest/lib/error/common.error";
import { CheckDatabaseConnectionError } from "@crepen-nest/lib/error/api/admin/setup/chk_conn_failed.setup.admin.error";

@Controller('admin/setting')
@UseGuards(CommonJwtGuard, AllowTokenTypeGuard, AllowRoleGuard)
export class CrepenAdminSettingController {

    constructor(
        private readonly dynamicConfig: DynamicConfigService,
        private readonly settingService: CrepenAdminSettingService
    ) { }


    @Get('properties')
    @HttpCode(HttpStatus.OK)
    @AllowTokenType(CrepenTokenType.ACCESS_TOKEN)
    @AllowRoles(UserRoleEnum.ROLE_ADMIN)
    async getAllProperty(
        @I18n() i18n: I18nContext,
        @TokenContext() payload: CrepenTokenContext
    ) {

        const prop =  await this.settingService.getProperties(payload.payload.mode);

        return BaseResponse.ok(
            prop,
            HttpStatus.OK,
            i18n.t('common.SUCCESS')
        )
    }


    @Get('database')
    @HttpCode(HttpStatus.OK)
    @AllowTokenType(CrepenTokenType.ACCESS_TOKEN)
    @AllowRoles(UserRoleEnum.ROLE_ADMIN)
    async getDatabaseConfig(
        @I18n() i18n: I18nContext,
        @AuthUser() user: UserEntity
    ) {

        const ss = new DataSource({
            type: 'mariadb',
            url: this.dynamicConfig.get('db.conn_str')
        })


        return BaseResponse.ok(
            {
                host: this.dynamicConfig.get('db.host'),
                port: Number(this.dynamicConfig.get('db.port')),
                username: this.dynamicConfig.get('db.username'),
                password: 'secret-value',
                database: this.dynamicConfig.get('db.database'),
            },
            HttpStatus.OK,
            i18n.t('common.SUCCESS')
        )
    }

    @Put('database')
    @HttpCode(HttpStatus.OK)
    @AllowTokenType(CrepenTokenType.ACCESS_TOKEN)
    @AllowRoles(UserRoleEnum.ROLE_ADMIN)
    async setDatabaseConfig(
        @I18n() i18n: I18nContext,
        @AuthUser() user: UserEntity,
        @Body() reqBody: SetDatabaseRequest
    ) {

        let isConnect: boolean = false;

        let dataSource: DataSource;

        try {
            dataSource = new DataSource({
                type: 'mariadb',
                host: reqBody.host,
                port: reqBody.port,
                username: reqBody.username,
                password: reqBody.password,
                database: reqBody.database
            })

            await dataSource.initialize();

            if (dataSource.isInitialized) {
                isConnect = true;

                this.dynamicConfig.set('db.host', reqBody.host);
                this.dynamicConfig.set('db.port', Number(reqBody.port));
                this.dynamicConfig.set('db.username', reqBody.username);
                this.dynamicConfig.set('db.password', reqBody.password);
                this.dynamicConfig.set('db.database', reqBody.database);

                this.dynamicConfig.saveStore();
            }
            else {
                isConnect = false;
            }
        }
        catch (e) {

            try {
                if (dataSource.isInitialized) {
                    await dataSource.destroy();
                }
            }
            catch (e) {
                
            }

            throw new CheckDatabaseConnectionError();
        }




        return BaseResponse.ok(
            {
                connectState: isConnect
            },
            HttpStatus.OK,
            i18n.t('common.SUCCESS')
        )
    }
}