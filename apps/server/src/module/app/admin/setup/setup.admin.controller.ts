import { BaseResponse } from "@crepen-nest/lib/common/base.response";
import { DisableValidDBDeco } from "@crepen-nest/lib/extensions/decorator/chk-conn-db.decorator";
import { Body, Controller, Header, Headers, HttpCode, HttpStatus, Post, Query, Req } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { I18n, I18nContext } from "nestjs-i18n";
import { AdminSetupDatabaseRequest } from "./dto/database.setup.admin.request";
import { CrepenAdminSetupService } from "./setup.admin.service";
import { CrepenAdminAuthService } from "../auth/auth.admin.service";
import { ExpireAdminPasswordError } from "@crepen-nest/lib/error/api/admin/auth/expire_password.auth.admin.error";
import { DynamicConfigService } from "@crepen-nest/module/config/dynamic-config/dynamic-config.service";

@Controller('admin/setup')
export class CrepenAdminSetupController {
    constructor(
        // private readonly configService: ConfigService,
        private readonly setupService: CrepenAdminSetupService,
        private readonly authService: CrepenAdminAuthService,
        private readonly dynamicConfig : DynamicConfigService
    ) { }


    @Post('/database')
    @HttpCode(HttpStatus.OK)
    @DisableValidDBDeco.getMethodDeco()
    async setupDatabase(
        @Req() req: Request,
        @I18n() i18n: I18nContext,
        @Body() reqBody: AdminSetupDatabaseRequest,
        @Headers('x-cp-admin-sp') password?: string,
        @Query('mode') appendMode: 'current' | 'only-apply' = 'current'
    ) {
        const isValidPassword = await this.authService.isValidPassword(password);
        if (!isValidPassword) {
            throw new ExpireAdminPasswordError();
        }

        const dataSource = await this.setupService.checkDatabase(
            reqBody.host,
            reqBody.port,
            reqBody.userName,
            reqBody.password,
            reqBody.database,
            appendMode === 'only-apply'
        );

        if (appendMode !== 'only-apply') {
            await this.setupService.syncronizeTable(dataSource);
        }

        void await dataSource.destroy()

        const connStr = `mariadb://${reqBody.userName}:${reqBody.password}@${reqBody.host}:${reqBody.port}/${reqBody.database}`;

        void await this.setupService.addDBConnConfig(connStr)

        // this.configService.set('db.conn_str', connStr);
        this.dynamicConfig.set('db.conn_str' , connStr);

        return BaseResponse.ok(
            undefined,
            HttpStatus.OK,
            i18n.t('common.SUCCESS')
        )
    }
}