import { Column, Entity, PrimaryColumn, Tree, TreeChildren, TreeParent } from "typeorm";

@Entity()
@Tree('nested-set')
export class FolderTreeEntity {
    @PrimaryColumn({name : 'uid'})
    uid? : string;

    @Column({name : 'folder_title'})
    folderTitle? : string;

    @TreeChildren()
    children: FolderTreeEntity[];

    @TreeParent()
    parent : FolderTreeEntity[];
}