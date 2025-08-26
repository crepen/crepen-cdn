import { Column, Entity, PrimaryColumn } from "typeorm";
import { UserResetPasswordStateEnum } from "../enum/reset-password-state.enum";

@Entity('log-reset-password')
export class UserResetPasswordHistoryEntity {

    @PrimaryColumn({ name: 'uid', type: 'varchar', length: 50 })
    uid: string;


    @Column({name : "user_uid" , type : 'varchar' , length : 50})
    userUid : string;


    @Column({ name: 'request_date', type: "datetime", default: () => 'sysdate()' })
    requestDate: Date;

    @Column({ name: 'expire_date', type: "datetime", default: () => 'sysdate()' })
    expireDate: Date;


    @Column({name :'state' , type : 'enum' , enum : UserResetPasswordStateEnum ,default : UserResetPasswordStateEnum.STANDBY})
    state : UserResetPasswordStateEnum;


}