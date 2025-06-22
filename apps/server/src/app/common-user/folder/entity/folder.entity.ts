import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { FileEntity } from "../../file/entity/file.entity";

@Entity('folder')
export class FolderEntity {

    @PrimaryColumn({ type: 'varchar', length: 50, name: 'uid', unique: true })
    uid?: string;

    @Column({ type: 'varchar', name: 'parent_folder_uid', nullable: true })
    parentFolderUid?: string;

    @Column({ type: 'varchar', name: 'owner_uid', nullable: false })
    ownerUid?: string;


    @Column({ type: 'varchar', name: 'folder_title' })
    folderTitle?: string;



    @Column({ name: 'state', type: 'boolean', default: () => false })
    state?: boolean;





    @Column({ name: 'create_date', type: "datetime", default: () => 'sysdate()' })
    // @Exclude()
    createDate?: Date;

    @Column({ name: 'update_date', type: 'datetime', default: () => 'sysdate()' })
    // @Exclude()
    updateDate?: Date;


    @OneToMany(() => FileEntity, (obj) => obj.relativeFolder)
    files: FileEntity[]

    @ManyToOne(() => FolderEntity, (obj) => obj.childFolder)
    @JoinColumn({ name: 'parent_folder_uid', referencedColumnName: 'uid' })
    parentFolder: FolderEntity

    @OneToMany(() => FolderEntity, (obj) => obj.parentFolder)
    @JoinColumn({ name: 'uid', referencedColumnName: 'parent_folder_uid' })
    childFolder: FolderEntity[]

}