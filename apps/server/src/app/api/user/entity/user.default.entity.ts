import { Exclude } from "class-transformer";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { UserStateEnum } from "../enum/user-state.enum";
import { UserSupportLanguageEnum } from "../enum/user-language.enum";
import { UserRoleEntity } from "./user-role.default.entity";

@Entity('user')
export class UserEntity {
    @Exclude()
    @PrimaryColumn({ name: 'uid', type: 'varchar', length: 50, unique: true })
    uid: string;

    @Column({ name: 'account_id', type: 'varchar', length: 255, unique: true })
    accountId: string;

    @Column({ name: "account_password", type: 'varchar', length: 255 })
    @Exclude()
    accountPassword: string;

    @Column({  name: 'email' , type: 'varchar', length : 50})
    email: string;

    @Column({ name: 'name', type: 'varchar', length: 20 })
    name: string;

    @Column({name : 'account_state' , type : 'enum' , enum : UserStateEnum })
    accountState : UserStateEnum;

    @Column({name : 'account_language' , type : 'enum' , enum : UserSupportLanguageEnum, nullable : true})
    accountLanguage? : UserSupportLanguageEnum;

    @Column({ name: 'account_lock', type: 'boolean', default: () => false })
    isLock? : boolean;

    @Column({ name: 'create_date', type: "datetime", default: () => 'sysdate()' })
    createDate?: Date;

    @Column({ name: 'update_date', type: 'datetime', default: () => 'sysdate()' })
    updateDate?: Date;

    @OneToMany(() => UserRoleEntity , role => role.user)
    @JoinColumn({foreignKeyConstraintName : 'conn-user-userrole' , name : 'uid' , referencedColumnName : 'user_uid'})
    userRole?: UserRoleEntity[]
}