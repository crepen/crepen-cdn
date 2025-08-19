import { Column, Entity, Index, PrimaryColumn } from "typeorm";
import { ExplorerFileStateEnum } from "../enum/file-state.explorer.enum";

@Entity('explorer-file')
@Index('idx_explorer_file_fulltext', ['title'], { fulltext: true })
export class ExplorerFileEntity {
    @PrimaryColumn({ name: 'uid', type: 'varchar', length: 50, unique: true })
    uid: string;


    @Column({ name: 'title', type: 'varchar', length: 100, nullable: false })
    title: string;

    @Column({name :"file_size" , type : 'int' , nullable : false , default : 0 })
    fileSize : number;

    @Column({name : 'file_name' , type : 'varchar' , length : 100 , nullable : false})
    fileName : string;

    @Column({name : 'file_ext' , type : 'varchar' , length : 20 , nullable : true})
    fileExtension?  : string;

    @Column({ name : 'file_mime' , type : 'varchar' , length : 50 , nullable : false})
    fileMimeType : string;

    @Column({name : 'file_owner' , type : 'varchar' , length : 50 , nullable : false})
    fileOwnerUid : string;

    @Column({name : 'file_enc' , type : 'varchar' , length : 20 , nullable : true})
    fileEncIv : string;

    @Column({name : 'file_state' , type : 'enum' , enum : ExplorerFileStateEnum , nullable : false})
    fileState : ExplorerFileStateEnum;


    @Column({ name: 'create_date', type: "datetime", default: () => 'sysdate()' })
    createDate?: Date;

    @Column({ name: 'update_date', type: 'datetime', default: () => 'sysdate()' })
    updateDate?: Date;
}