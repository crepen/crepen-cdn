import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { FileEntity } from "./file";
import { FilePermissionType } from "@crepen-nest/lib/types/enum/file-permission-type.enum";

/** @deprecated */
@Entity('file-permission')
export class FilePermissionEntity {
    @PrimaryColumn({ type: 'varchar', name: 'uid' })
    uid: string;


    @Column({ name: 'file_uid', type: 'varchar' })
    fileUid: string;


    @Column({ name: 'user_uid', type: 'varchar' })
    userUid: string;


    @Column({ name: 'permission_type', type: 'enum', enum: FilePermissionType })
    permissionType: FilePermissionType;

    @Column({ name: 'create_date', type: "datetime", default: () => 'sysdate()' })
    // @Exclude()
    createDate?: Date;



    @ManyToOne(() => FileEntity, { createForeignKeyConstraints: false })
    @JoinColumn({ name: 'file_uid', referencedColumnName: 'uid' })
    file?: FileEntity

}