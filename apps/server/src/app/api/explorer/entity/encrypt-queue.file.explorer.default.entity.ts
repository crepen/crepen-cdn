import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { ExplorerFileQueueType } from "../enum/file-queue-type.enum";
import { ExplorerFileQueueState } from "../enum/file-queue-state.enum";
import { ExplorerFileEntity } from "./file.explorer.default.entity";

@Entity('queue-file-crypt')
export class ExplorerFileEncryptQueueEntity {

    @PrimaryColumn({ name: 'queue_uid', type: 'varchar', length: 50 })
    uid: string;

    @Column({ name: 'file_uid', type: 'varchar', length: 50, nullable: false })
    fileUid: string;

    @Column({ name: 'type', type: 'enum', enum: ExplorerFileQueueType })
    queueType: ExplorerFileQueueType;

    @Column({ name: 'create_date', type: "datetime", default: () => 'sysdate()' })
    createDate: Date;

    @Column({name : 'queue_state' , type : 'enum' , enum : ExplorerFileQueueState })
    queueState : ExplorerFileQueueState;

    @Column({name : 'user_uid' , type : 'varchar' , nullable : false})
    userUid: string;

    @ManyToOne(() => ExplorerFileEntity , file => file.cryptQueueList)
    originFile : ExplorerFileEntity
}