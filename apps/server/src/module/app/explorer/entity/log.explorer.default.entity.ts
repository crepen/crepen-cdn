import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { ExplorerItemType } from "../enum/item-type.explorer.enum";
import { ExplorerLogTypeEnum } from "../enum/log-type.explorer.enum";

@Entity('explorer-log')
export class ExplorerLogEntity {
    @PrimaryGeneratedColumn({ name: 'idx', type: 'int', unsigned: true })
    idx: number;

    @Column({ name: 'item_uid', length: 50, nullable: false })
    itemUid: string;

    @Column({
        type: 'enum',
        name: 'type',
        enum: ExplorerItemType,
        nullable: false
    })
    type: ExplorerItemType;

    @Column({
        type: 'enum',
        name: 'action',
        enum: ExplorerLogTypeEnum,
        nullable: false
    })
    action: ExplorerLogTypeEnum;

    @Column({ type: 'varchar', name: 'action_user_uid', length: 50, nullable: false })
    actionUserUid : string;


    @Column({ name: 'create_date', type: "datetime", default: () => 'sysdate()' })
    createDate?: Date;

    @Column({ name: 'update_date', type: 'datetime', default: () => 'sysdate()' })
    updateDate?: Date;
}