import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('explorer-encrypt-file')
export class ExplorerEncryptFileEntity {


    @PrimaryColumn({name : 'uid' , type : 'varchar' , length : 50 , nullable : false})
    uid: string;

    @Column({ name: 'origin_file_uid', type: 'varchar', length: 50, nullable: false })
    originFileUid: string;

    @Column({ name: 'file_name', type: 'varchar', length: 100, nullable: false })
    fileName: string;


    @Column({ name: 'create_date', type: "datetime", default: () => 'sysdate()' })
    createDate?: Date;

}
