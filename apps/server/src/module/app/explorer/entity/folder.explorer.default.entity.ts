import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity('explorer-folder')
@Index('idx_explorer_folder_fulltext', ['title'], { fulltext: true })
export class ExplorerFolderEntity {
    @PrimaryColumn({ name: 'uid', type: 'varchar', length: 50, unique: true })
    uid: string;


    @Column({ name: 'title', type: 'varchar', length: 100, nullable: false })
    title: string;

    @Column({ name: 'create_date', type: "datetime", default: () => 'sysdate()' })
    createDate?: Date;

    @Column({ name: 'update_date', type: 'datetime', default: () => 'sysdate()' })
    updateDate?: Date;
}