import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { ExplorerFileStateEnum } from "../enum/file-state.explorer.enum";
import { Exclude, Expose } from "class-transformer";
import { ExplorerFileEncryptState } from "../enum/file-encrypt-state.enum";
import { ExplorerFileQueueState } from "../enum/file-queue-state.enum";
import { ExplorerEncryptFileEntity } from "./encrypt-file.explorer.default.entity";
import { ExplorerFileEncryptQueueEntity } from "./encrypt-queue.file.explorer.default.entity";

@Entity('explorer-file')
@Index('idx_explorer_file_fulltext', ['title'], { fulltext: true })
export class ExplorerFileEntity {
    @PrimaryColumn({ name: 'uid', type: 'varchar', length: 50, unique: true })
    uid: string;


    @Column({ name: 'title', type: 'varchar', length: 100, nullable: false })
    title: string;

    @Column({ name: "file_size", type: 'bigint', nullable: false, default: 0 })
    fileSize: number;

    @Column({ name: 'file_name', type: 'varchar', length: 100, nullable: false })
    fileName: string;

    @Exclude()
    @Column({ name: 'store_file_name', type: 'varchar', length: 100, nullable: false })
    storeFileName: string;

    @Column({ name: 'file_ext', type: 'varchar', length: 20, nullable: true })
    fileExtension?: string;

    @Column({ name: 'file_mime', type: 'varchar', length: 50, nullable: false })
    fileMimeType: string;

    @Exclude()
    @Column({ name: 'file_owner', type: 'varchar', length: 50, nullable: false })
    fileOwnerUid: string;

    @Column({ name: 'file_state', type: 'enum', enum: ExplorerFileStateEnum, nullable: false })
    fileState: ExplorerFileStateEnum;

    @Column({ name: 'publish-state', type: 'boolean', nullable: false, default: false })
    isPublished: boolean;

    @Exclude()
    @Column({ name: 'file_path', type: 'varchar', nullable: false })
    filePath: string;

    @Column({ name: 'create_date', type: "datetime", default: () => 'sysdate()' })
    createDate?: Date;

    @Column({ name: 'update_date', type: 'datetime', default: () => 'sysdate()' })
    updateDate?: Date;



    @OneToMany(() => ExplorerEncryptFileEntity, encryptFile => encryptFile.originFile)
    encryptedFiles: ExplorerEncryptFileEntity[];


    @OneToMany(() => ExplorerFileEncryptQueueEntity , queue => queue.originFile)
    cryptQueueList : ExplorerFileEncryptQueueEntity[]

}