import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('config')
export class LocalConfigEntity {

    

    @PrimaryColumn({type : 'varchar' , name : 'key' , unique : true})
    key : string;


    @Column({type : 'varchar' , name : 'value'})
    value : string;


   


    static data = (key : string , value : string) => {
        const instance = new LocalConfigEntity();
        instance.key = key;
        instance.value = value;
        return instance;
    }
}