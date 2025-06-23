import { Column, Entity, OneToOne, PrimaryColumn } from "typeorm";
import { FileEntity } from "./file.entity";

@Entity('file-store')
export class FileStoreEntity {
    @PrimaryColumn({ type: 'varchar', length: 50, name: 'uid', unique: true })
    uid?: string;

    @Column({ type: 'varchar', name: 'uploader_uid' })
    uploaderUid?: string;

    @Column({ type: 'varchar', name: 'file_name' })
    fileName: string;

    @Column({type : 'varchar' , name : 'file_type'})
    fileType : string;

    @Column({type : 'int' , name :'file_size'})
    fileSize : number;

    @Column({ type: 'varchar', name: 'origin_file_mine', length: 2000 })
    originFileMine: string;

    @Column({ type: 'varchar', name: 'hash' })
    hash: string;

    @Column({ type: 'datetime', name: 'expire_date', default: () => 'DATE_ADD(sysdate(), INTERVAL 1 HOUR)' })
    expireDate?: Date;

    @Column({ name: 'create_date', type: "datetime", default: () => 'sysdate()' })
    // @Exclude()
    createDate?: Date;

    @Column({ name: 'update_date', type: 'datetime', default: () => 'sysdate()' })
    // @Exclude()
    updateDate?: Date;


    @OneToOne(() => FileEntity, (file) => file.fileStore, {createForeignKeyConstraints : false})
    file: FileEntity;

}