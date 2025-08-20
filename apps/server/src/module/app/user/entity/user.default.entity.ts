import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class UserEntity {
    @PrimaryColumn({ name: 'uid', type: 'varchar', length: 50, unique: true })
    uid: string;

    @Column({ name: 'account_id', type: 'varchar', length: 255, unique: true })
    accountId: string;

    @Column({ name: "account_password", type: 'varchar', length: 255 })
    accountPassword: string;

    @Column({  name: 'email' , type: 'varchar', length : 50})
    email: string;

    @Column({ name: 'name', type: 'varchar', length: 20 })
    name: string;

    @Column({ name: 'account_lock', type: 'boolean', default: () => false })
    isLock? : boolean;

    @Column({ name: 'create_date', type: "datetime", default: () => 'sysdate()' })
    createDate?: Date;

    @Column({ name: 'update_date', type: 'datetime', default: () => 'sysdate()' })
    updateDate?: Date;
}