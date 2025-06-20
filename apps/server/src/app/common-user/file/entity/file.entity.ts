import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('file')
export class FileEntity {
    @PrimaryColumn({ type: 'varchar', length: 50, name: 'uid', unique: true })
    uid?: string;

    @Column({ type: 'varchar', name: 'file_title' })
    fileTitle?: string;

    @Column({ type: 'varchar', name: 'owner_uid' })
    ownerUid?: string;


    @Column({ type: 'varchar', name: 'parent_folder_uid' })
    parentFolderUid?: string;

    @Column({ type: 'boolean', name: 'is_shared' })
    isShared?: boolean;

    @Column({ type: 'varchar', name: 'file_name' })
    fileName: string


    @Column({type : 'varchar' , name : 'origin_file_mine' , length : 1000})
    originFileMine : string


    @Column({ name: 'create_date', type: "datetime", default: () => 'sysdate()' })
    // @Exclude()
    createDate?: Date;

    @Column({ name: 'update_date', type: 'datetime', default: () => 'sysdate()' })
    // @Exclude()
    updateDate?: Date;

}