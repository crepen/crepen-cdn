import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('folder')
export class FolderEntity {

    @PrimaryColumn({ type: 'varchar', length: 50, name: 'uid', unique: true })
    uid?: string;

    @Column({ type: 'varchar', name: 'parent_folder_uid' , nullable : true })
    parentFolderUid?: string;

    @Column({ type: 'varchar', name: 'owner_uid' , nullable : false})
    ownerUid?: string;


    @Column({type : 'varchar' , name : 'folder_title'})
    folderTitle? : string;



    @Column({ name: 'state', type: 'boolean', default: () => false })
    state?: boolean;





    @Column({ name: 'create_date', type: "datetime", default: () => 'sysdate()' })
    // @Exclude()
    createDate?: Date;

    @Column({ name: 'update_date', type: 'datetime', default: () => 'sysdate()' })
    // @Exclude()
    updateDate?: Date;

}