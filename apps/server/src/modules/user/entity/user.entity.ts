import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class User {

    @PrimaryGeneratedColumn()
    uid: string;

    @Column({
        name: 'account_id'
    })
    id: string;


    @Column({ name: 'account_password' })
    password: string;
}