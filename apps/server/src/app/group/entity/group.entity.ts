import { Exclude } from "class-transformer";
import { Column, Entity, ForeignKey, Index, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('group')
export class GroupEntity {
    @PrimaryGeneratedColumn()
    idx: number;

    @Column({ type: "varchar", length: 50, name: 'uid', unique: true })
    uid: string;

    @Column({ type: 'varchar', name: 'group_name' })
    groupName: string;

    @Exclude()
    @Column({ type: 'varchar', length: 50, name: 'owner_uid' ,primary : true})
    ownerUid: string;

    @Column({ type: 'varchar', name: 'parent_uid', nullable: true })
    parentUid?: string | null;

    @Column({ type: 'timestamp', name: 'create_date' })
    createDate: Date;

    @Column({ type: "varchar", name: 'description', nullable: true, length: 200 })
    description?: string | null;
}