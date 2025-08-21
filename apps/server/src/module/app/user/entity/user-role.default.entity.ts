import { Column, Entity, PrimaryColumn } from "typeorm";
import { UserRoleEnum } from "../enum/user-role.enum";

@Entity('user-role')
export class UserRoleEntity {
    @PrimaryColumn({ name: 'user_uid', type: 'varchar', length: 50 })
    userUid: string;

    @PrimaryColumn({ name: 'role', type: 'enum', enum: UserRoleEnum })
    userRole: UserRoleEnum;

    @Column({ name: 'create_date', type: "datetime", default: () => 'sysdate()' })
    createDate?: Date;
}