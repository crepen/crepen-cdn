import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    idx?: number;

    @PrimaryColumn()
    @Column({ type: "varchar", length: 50, name: 'uid', unique: true })
    uid?: string;

    @Column({ name: 'account_id' })
    id?: string;


    @Column({ name: 'account_password' })
    password?: string;

    @Column({ type: 'varchar', name: 'email' })
    email?: string;


    @Column({ name: 'create_date', type: "datetime", default: () => 'sysdate()' })
    createDate?: Date;

    @Column({name : 'update_date' , type : 'datetime', default: () => 'sysdate()' })
    updateDate? : Date;
}