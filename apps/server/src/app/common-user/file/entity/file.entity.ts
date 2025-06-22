import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { FileStoreEntity } from "./file-store.entity";
import { FolderEntity } from "../../folder/entity/folder.entity";

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

    @Column({ type: 'boolean', name: 'is_shared', default: () => false })
    isShared?: boolean;

    @Column({ type: 'varchar', name: 'file_uid' })
    fileUid: string


    @Column({ name: 'create_date', type: "datetime", default: () => 'sysdate()' })
    // @Exclude()
    createDate?: Date;

    @Column({ name: 'update_date', type: 'datetime', default: () => 'sysdate()' })
    // @Exclude()
    updateDate?: Date;


    @OneToOne(() => FileStoreEntity)
    @JoinColumn({ name: 'file_uid', referencedColumnName: 'uid' })
    fileStore: FileStoreEntity;

    @ManyToOne(() => FolderEntity , (obj) => obj.files)
    @JoinColumn({ name: 'parent_folder_uid', referencedColumnName: 'uid' })
    relativeFolder : FolderEntity
    
}