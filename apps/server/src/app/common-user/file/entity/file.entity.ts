import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('file')
export class FileEntity {
    @PrimaryColumn({type : 'varchar' , length : 50 , name : 'uid' , unique : true})
    uid? : string;

    @Column({type : 'varchar' , name : 'owner_uid'})
    ownerUid? : string;


    @Column({type : 'varchar' , name : 'parent_folder_uid'})
    parentFolderUid? : string
}