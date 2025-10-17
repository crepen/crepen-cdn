import { CrepenBaseRepository } from "@crepen-nest/lib/common/base.repository";
import { Injectable } from "@nestjs/common";
import { UserEntity } from "./entity/user.default.entity";
import { RepositoryOptions } from "@crepen-nest/interface/repo";
import { FindOptionsWhere } from "typeorm";
import { UserRoleEnum } from "./enum/user-role.enum";
import { UserRoleEntity } from "./entity/user-role.default.entity";
import { UserResetPasswordHistoryEntity } from "./entity/reset-password-history.default.entity";
import { randomUUID } from "crypto";
import * as dateFns from 'date-fns'
import { UserResetPasswordStateEnum } from "./enum/reset-password-state.enum";
import { DatabaseService } from "@crepen-nest/app/config/database/database.config.service";

@Injectable()
export class CrepenUserRepository extends CrepenBaseRepository {
    constructor(
        private readonly databaseService: DatabaseService
    ) { super(databaseService) }


    addUser = async (userEntity: UserEntity, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(UserEntity) ?? await this.getRepository('default', UserEntity);

        return dataSource.save(userEntity, { data: false })
    }

    addUserRole = async (userUid: string, role: UserRoleEnum, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(UserRoleEntity) ?? await this.getRepository('default', UserRoleEntity);

        const entity = new UserRoleEntity();
        entity.userRole = role;
        entity.userUid = userUid;

        return dataSource.save(entity, { data: false });
    }

    removeUserRole = async (userUid: string, role: UserRoleEnum, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(UserRoleEntity) ?? await this.getRepository('default', UserRoleEntity);

        return dataSource.remove({
            userRole: role,
            userUid: userUid
        });
    }

    getUserList = async (findOption: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[], options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(UserEntity) ?? await this.getRepository('default', UserEntity);

        return dataSource.find({
            where: findOption
        })
    }

    getOneUser = async (findOption: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[], options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(UserEntity) ?? await this.getRepository('default', UserEntity);

        return dataSource.findOne({
            where: findOption,
        })
    }

    getUserIncludeRoles = async (findOption: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[], options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(UserEntity) ?? await this.getRepository('default', UserEntity);

        return dataSource.findOne({
            where : findOption,
            relations : ['userRole']
        })
    }





    addResetPasswordHistory = async (expireDurate: dateFns.Duration, userUid: string, resetUid: string, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(UserResetPasswordHistoryEntity) ?? await this.getRepository('default', UserResetPasswordHistoryEntity);

        const entity = new UserResetPasswordHistoryEntity();
        entity.uid = resetUid ?? randomUUID();
        entity.userUid = userUid;
        entity.requestDate = new Date();
        entity.expireDate = dateFns.add(new Date(), expireDurate)
        entity.state = UserResetPasswordStateEnum.STANDBY;

        return dataSource.save(entity, { data: false })
    }

    getResetPasswordHistory = async (uid: string, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(UserResetPasswordHistoryEntity) ?? await this.getRepository('default', UserResetPasswordHistoryEntity);

        return dataSource.findOne({
            where: {
                uid: uid
            }
        })
    }

    editUser = async (editUserEntity : UserEntity, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(UserEntity) ?? await this.getRepository('default', UserEntity);

        return dataSource.save(editUserEntity);
    }
}