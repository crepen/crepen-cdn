import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('config')
export class SystemConfigEntity {
    @PrimaryColumn({type : 'varchar' , unique : true})
    key : string;

    @Column({type : 'varchar'})
    value : string;
}