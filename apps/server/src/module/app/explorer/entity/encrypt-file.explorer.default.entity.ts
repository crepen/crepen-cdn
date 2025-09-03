import { Exclude } from "class-transformer";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { ExplorerFileEntity } from "./file.explorer.default.entity";

@Entity('explorer-encrypt-file')
export class ExplorerEncryptFileEntity {


    @PrimaryColumn({ name: 'uid', type: 'varchar', length: 50, nullable: false })
    uid: string;

    @Column({ name: 'origin_file_uid', type: 'varchar', length: 50, nullable: false })
    originFileUid: string;

    @Column({ name: 'file_name', type: 'varchar', length: 100, nullable: false })
    fileName: string;


    @Column({ name: 'create_date', type: "datetime", default: () => 'sysdate()' })
    createDate?: Date;


    @ManyToOne(() => ExplorerFileEntity, originFile => originFile.encryptedFiles)
    @JoinColumn({ name: 'origin_file_uid', referencedColumnName: 'uid' })
    originFile: ExplorerFileEntity;
}
