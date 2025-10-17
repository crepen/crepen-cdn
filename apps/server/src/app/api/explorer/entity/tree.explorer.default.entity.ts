import { Column, Entity, PrimaryColumn, ViewColumn, VirtualColumn } from "typeorm";
import { ExplorerItemType } from "../enum/item-type.explorer.enum";

@Entity('explorer-tree')
export class ExplorerTreeEntity {
    @PrimaryColumn({
        type: 'varchar',
        length: 50,
        name: 'target_uid',
        nullable: false
    })
    targetUid?: string;

    @PrimaryColumn({
        type: 'varchar',
        length: 50,
        name: 'child_link_uid',
        nullable: false
    })
    childLinkUid?: string;

    @Column({
        type: 'enum',
        name: 'child_type',
        enum: ExplorerItemType,
        nullable: false
    })
    childType?: ExplorerItemType;


    @Column({
        type : "varchar",
        name : 'owner_uid',
        nullable : false
    })
    ownerUid?: string

    @Column({ name: 'create_date', type: "datetime", default: () => 'sysdate()' })
    // @Exclude()
    createDate?: Date;


    title?: string;
    updateDate?: string;
    fileSize?: string;
}