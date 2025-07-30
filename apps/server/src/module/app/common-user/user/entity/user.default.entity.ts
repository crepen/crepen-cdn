import { StringUtil } from "@crepen-nest/lib/util/string.util";
import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    @Exclude()
    idx?: number;

    @PrimaryColumn()
    @Column({ type: "varchar", length: 50, name: 'uid', unique: true })
    uid?: string;

    @Column({ name: 'account_id' })
    id?: string;

    @Column({ name: 'account_password' })
    @Exclude()
    password?: string;

    @Column({ name: 'account_name', type: 'varchar' })
    name?: string;

    @Column({ type: 'varchar', name: 'email' })
    email?: string;

    @Column({ type: 'varchar', name: 'language' , nullable : true })
    language?: string;


    @Column({ name: 'create_date', type: "datetime", default: () => 'sysdate()' })
    // @Exclude()
    createDate?: Date;

    @Column({ name: 'update_date', type: 'datetime', default: () => 'sysdate()' })
    // @Exclude()
    updateDate?: Date;

    @Column({ name: 'account_lock', type: 'boolean', default: () => false })
    isLock?: boolean;


    @Column({
        name: 'account_role', type: 'varchar',
        transformer: {
            to: (value: string[]) => value?.join(','),
            from: (value: string) => {
                return (value?.split(',') ?? [])
                    .filter(x => !StringUtil.isEmpty(x))
                    .map(x => x.trim())
            }
        },
        default: ''
    })
    roles?: string[];
}