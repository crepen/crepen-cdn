import { Entity, PrimaryColumn } from "typeorm";

@Entity('explorer-catalog')
export class ExplorerCatalogEntity {
    @PrimaryColumn({
        type: 'varchar',
        length: 50,
        name: 'catalog_uid',
        nullable: false
    })
    catalogUid: string;

    @PrimaryColumn({
        type: 'varchar',
        length: 50,
        name: 'user_uid',
        nullable: false
    })
    userUid?: string;
}