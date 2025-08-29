import { BaseResponse } from "@crepen-nest/lib/common/base.response";
import { DisableValidDBDeco } from "@crepen-nest/lib/extensions/decorator/chk-conn-db.decorator";
import { Controller, Get, HttpStatus, Logger, Req } from "@nestjs/common";
import { I18n, I18nContext } from "nestjs-i18n";
import { CrepenAdminAuthService } from "./auth.admin.service";
import { DatabaseService } from "@crepen-nest/module/config/database/database.config.service";
import { CryptoUtil, StringUtil } from "@crepen-nest/lib/util";
import { ConfigService } from "@nestjs/config";

@Controller('admin/auth')
export class CrepenAdminAuthController {
    constructor(
        private readonly adminAuthService: CrepenAdminAuthService,
        private readonly dataService: DatabaseService,
        private readonly configService : ConfigService
    ) { }

    @Get('/password')
    @DisableValidDBDeco.getMethodDeco()
    async requestAdminPassword(
        @Req() req: Request,
        @I18n() i18n: I18nContext
    ) {

        return (await this.dataService.getLocal()).transaction(async manager => {

            await this.adminAuthService.initAuthTable({ manager: manager });
            const password = StringUtil.randomString(16);

            await this.adminAuthService.addPassword(password , {manager : manager});

            Logger.log(`Request Sign-in Password : ${password}`, 'MAIN_REQ_PASSWORD')

            


            return BaseResponse.ok(
                undefined,
                HttpStatus.OK,
                i18n.t('common.SUCCESS')
            )
        })


    }
}