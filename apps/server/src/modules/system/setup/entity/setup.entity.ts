import { Exclude } from "class-transformer";
import { Column, Entity, ForeignKey, Index, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('setup')
export class SetupEntity {

    @Column({ type: "varchar", name: 'key', unique: true , primary : true})
    key: string;

    @Column({ type: 'varchar', name: 'value' })
    value: string; 
}