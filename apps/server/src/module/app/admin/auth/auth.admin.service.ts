import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CrepenAdminAuthRepository } from "./auth.admin.repository";
import { RepositoryOptions } from "@crepen-nest/interface/repo";
import * as dateFns from 'date-fns'

@Injectable()
export class CrepenAdminAuthService {
    constructor(
        private readonly repo: CrepenAdminAuthRepository
    ) { }


    initAuthTable = async (options?: RepositoryOptions) => {
        const isAuthTableExist = await this.repo.isAuthTableExist(options);

        if (!isAuthTableExist) {
            await this.repo.createAuthTable(options);
        }


    }

    addPassword = async (password?: string, options?: RepositoryOptions) => {
        return await this.repo.addPasswordItem(password, options);
    }

    isValidPassword = async (password?: string, options?: RepositoryOptions) => {

        const matchPassword = await this.repo.getPassword(password, options);

        const expTime = dateFns.addMinutes(new Date(), -5);
        const time = new Date(matchPassword.timestamp * 1000);

        return expTime <= time;
    }
}