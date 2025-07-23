import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('state')
export class LocalStateEntity {

    @PrimaryColumn({type : 'varchar' , name : 'key' , unique : true})
    key : string;


    @Column({type : 'varchar' , name : 'value'})
    value : string;
}