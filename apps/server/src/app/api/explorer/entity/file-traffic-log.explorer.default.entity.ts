import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('log-file-traffic')
export class FileTrafficLoggerEntity {
    @PrimaryColumn({type : 'varchar' , length : 50 ,name : 'uid' , unique : true})
    uid : string;

    @Column({ name: 'date', type: "datetime", default: () => 'sysdate()' })
    date?: Date;

    @Column({name : 'traffic_size' , type : 'int'})
    trafficSize : number;

    @Column({name : 'access_user_uid' , type : 'varchar', length : 50})
    accessUserUid : string;

    @Column({name : 'file_uid' , type : 'varchar' , length : 50})
    fileUid : string;
}