import { Column, Entity } from "typeorm";

@Entity('system')
export class CrepenSystemEntity {
    @Column({ type: 'varchar', name: 'key', unique: true , primary : true})
    key?: string;

    @Column({ type: 'varchar', name: 'value' })
    value?: string;
}