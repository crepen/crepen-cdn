/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RepositoryPaginationResult, RepositoryOptions } from "@crepen-nest/interface/repo";
import { DatabaseService } from "@crepen-nest/module/config/database/database.config.service";
import { Injectable } from "@nestjs/common";
import { ExplorerTreeEntity } from "./entity/tree.explorer.default.entity";
import { CrepenBaseRepository } from "@crepen-nest/lib/common/base.repository";
import { SearchFilterParamOptions } from "@crepen-nest/interface/request-param";
import { ExplorerFolderEntity } from "./entity/folder.explorer.default.entity";
import { Brackets, FindOptionsWhere } from "typeorm";
import { ExplorerFileEntity } from "./entity/file.explorer.default.entity";
import { ExplorerItemType } from "./enum/item-type.explorer.enum";
import { ExplorerLogEntity } from "./entity/log.explorer.default.entity";
import { ExplorerCatalogEntity } from "./entity/catalog.explorer.default.entity";
import { randomUUID } from "crypto";

export interface FolderHierarchy {
    uid: string;
    title: string;
    depth: number;
}

@Injectable()
export class CrepenExplorerRepository extends CrepenBaseRepository {
    constructor(
        private readonly databaseService: DatabaseService
    ) { super(databaseService) }


    //#region TREE

    getChildTreeObject = async (targetUid: string, onwerUid: string, options?: RepositoryOptions<SearchFilterParamOptions>): Promise<RepositoryPaginationResult<ExplorerTreeEntity>> => {

        const dataSource = options?.manager?.getRepository(ExplorerTreeEntity) ?? await this.getRepository('default', ExplorerTreeEntity);

        const query = dataSource.createQueryBuilder('tree')
            // ExplorerFolderEntity를 'folder' 타입일 때만 LEFT JOIN
            .leftJoin('explorer-folder', 'folder', 'tree.child_link_uid = folder.uid AND tree.child_type = :folderType', {
                folderType: ExplorerItemType.FOLDER,
            })
            // ExplorerFileEntity를 'file' 타입일 때만 LEFT JOIN
            .leftJoin('explorer-file', 'file', 'tree.child_link_uid = file.uid AND tree.child_type = :fileType', {
                fileType: ExplorerItemType.FILE,
            })
            .select([
                'tree.targetUid',
                'tree.childLinkUid',
                'tree.childType',
                'tree.createDate',
                'tree.ownerUid',
            ])
            .addSelect(
                // CASE 문을 사용하여 'title' 컬럼 동적 생성
                `CASE tree.child_type 
                    WHEN 'folder' THEN folder.title 
                    WHEN 'file' THEN file.title 
                    ELSE NULL 
                END`,
                'tree_title'
            )
            .addSelect(
                `CASE tree.child_type 
                    WHEN 'folder' THEN folder.update_date
                    WHEN 'file' THEN file.update_date 
                    ELSE NULL 
                END`,
                'tree_update_date'
            )
            .addSelect(
                `CASE tree.child_type 
                    WHEN 'folder' THEN 0
                    WHEN 'file' THEN file.file_size 
                    ELSE NULL 
                END`,
                'tree_file_size'
            )
            .where('tree.ownerUid = :ownerUid', { 'ownerUid': onwerUid })
            .andWhere('tree.targetUid = :targetUid', { 'targetUid': targetUid })
            ;

        if (options.keyword) {
            query.andWhere(
                new Brackets(qb => {
                    qb
                        .where('tree.child_type = :itemType AND MATCH(folder.title) AGAINST (:title IN NATURAL LANGUAGE MODE)', {
                            itemType: ExplorerItemType.FOLDER,
                            title: `+${options.keyword}*`,
                        })
                        .orWhere('tree.child_type = :itemType AND MATCH(file.title) AGAINST (:title IN NATURAL LANGUAGE MODE)', {
                            itemType: ExplorerItemType.FILE,
                            title: `+${options.keyword}*`,
                        })
                        .orWhere(
                            `CASE tree.child_type 
                                WHEN 'folder' THEN folder.title 
                                WHEN 'file' THEN file.title 
                                ELSE NULL 
                            END LIKE :title`,
                            { title: `%${options.keyword}%` }
                        );
                })
            );


        }

        query.andWhere(
            new Brackets(qb => {
                qb
                    .where(
                        new Brackets(inqb => {
                            inqb
                                .where(`tree.child_type = 'folder'`)
                                .andWhere('folder.title is not null')
                                .andWhere(`folder.title <> ''`)
                                .andWhere(`folder.folder_state <> 'delete'`)
                        })
                    )
                    .orWhere(
                        new Brackets(inqb => {
                            inqb
                                .where(`tree.child_type = 'file'`)
                                .andWhere('file.title is not null')
                                .andWhere(`file.title <> ''`)
                                .andWhere(`file.file_state <> 'delete'`)
                        })
                    )
            })
        );

        query.addOrderBy(`FIELD(tree.child_type , 'folder' , 'file')`, 'ASC')

        query.addOrderBy(`tree_${options.sortCategory}`, options.sortType === 'asc' ? 'ASC' : 'DESC')


        const allCount = await query.getCount();


        query.limit(options.pageSize);
        query.offset((options.page - 1) * options.pageSize);

        const result = await query.getRawAndEntities();

        const res = result.entities.map((x, idx) => {
            x.title = result.raw[idx]['tree_title'];
            x.updateDate = result.raw[idx]['tree_update_date'];
            x.fileSize = result.raw[idx]['tree_file_size']
            return x;
        })

        return {
            count: allCount,
            row: res,
            page: options.page,
            pageSize: options.pageSize,
            totalPage: Math.ceil(allCount / options.pageSize),
            keyword: options.keyword
        };
    }

    linkTree = async (ownerUid: string, targetUid: string, childUid: string, type: ExplorerItemType, options?: RepositoryOptions) => {

        const dataSource = options?.manager?.getRepository(ExplorerTreeEntity) ?? await this.getRepository('default', ExplorerTreeEntity);


        const treeEntity = new ExplorerTreeEntity();
        treeEntity.childLinkUid = childUid;
        treeEntity.childType = type;
        treeEntity.targetUid = targetUid;
        treeEntity.ownerUid = ownerUid;

        return dataSource.save(treeEntity, { data: false });
    }


    getFolderHierarchy = async (targetUid: string, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(ExplorerFolderEntity) ?? await this.getRepository('default', ExplorerFolderEntity);

        const rawSQL = `
            WITH RECURSIVE folder_hierarchy AS (
            SELECT f.uid, f.title, t.target_uid AS parent_uid, 1 AS depth
            FROM \`explorer-folder\` f
            LEFT JOIN \`explorer-tree\` t
                ON t.child_link_uid = f.uid AND t.child_type = 'folder'
            WHERE f.uid = ?

            UNION ALL

            SELECT pf.uid, pf.title, pt.target_uid AS parent_uid, fh.depth + 1
            FROM folder_hierarchy fh
            INNER JOIN \`explorer-folder\` pf ON pf.uid = fh.parent_uid
            LEFT JOIN \`explorer-tree\` pt
                ON pt.child_link_uid = pf.uid AND pt.child_type = 'folder'
            )
            SELECT uid, title, depth
            FROM folder_hierarchy
            ORDER BY depth DESC
        `;

        return await dataSource.query(rawSQL, [targetUid]) as FolderHierarchy[];



        const result: { uid: string; title: string; depth: number; }[] = [];
        let currentUid: string | null = targetUid;

        while (currentUid) {
            const folder = await dataSource
                .createQueryBuilder("f")
                .leftJoin(ExplorerTreeEntity, "t", "t.child_link_uid = f.uid AND t.child_type = 'folder'")
                .select(["f.uid", "f.title", "t.target_uid"])
                .where("f.uid = :uid", { uid: currentUid })
                .getRawAndEntities<{ uid: string; title: string; target_uid: string | null }>();

            if (folder.entities.length === 0) break;
            result.push({ uid: folder.entities[0].uid, title: folder.entities[0].title, depth: result.length + 1 });
            currentUid = folder.raw[0].target_uid;
        }

        return result.reverse();
    }

    //#endregion TREE


    //#region FOLDER

    getFolderData = async (fildOption: FindOptionsWhere<ExplorerFolderEntity> | FindOptionsWhere<ExplorerFolderEntity>[], options?: RepositoryOptions): Promise<ExplorerFolderEntity | undefined> => {
        const dataSource = options?.manager?.getRepository(ExplorerFolderEntity) ?? await this.getRepository('default', ExplorerFolderEntity);

        return await dataSource.findOne({
            where: fildOption,
        })
    }

    addFolder = async (ownerUid: string, folderName: string, options?: RepositoryOptions) => {

        const dataSource = options?.manager?.getRepository(ExplorerFolderEntity) ?? await this.getRepository('default', ExplorerFolderEntity);

        const folderEntity = new ExplorerFolderEntity();
        folderEntity.uid = randomUUID();
        folderEntity.title = folderName;
        folderEntity.folderOwnerUid = ownerUid;


        return await dataSource.save(folderEntity, {
            data: false
        })

    }

    getDuplicateFolder = async (parentFolderUid: string, folderName: string, options?: RepositoryOptions) => {

        const dataSource = options?.manager?.getRepository(ExplorerFolderEntity) ?? await this.getRepository('default', ExplorerFolderEntity);

        const query = dataSource
            .createQueryBuilder("ef")
            .leftJoinAndSelect(ExplorerTreeEntity, "et", "et.child_link_uid = ef.uid")
            .where("et.target_uid IS NOT NULL")
            .andWhere("ef.title = :folderName", { folderName })
            .andWhere("et.target_uid = :parentFolderUid", { parentFolderUid });

        return (await query.getRawAndEntities()).entities;
    }

    //#endregion FOLDER




    //#region FILE
    addFile = async (fileEntity: ExplorerFileEntity, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(ExplorerFileEntity) ?? await this.getRepository('default', ExplorerFileEntity);


        return dataSource.save(fileEntity, {
            data: false
        });
    }


    //#endregion FILE


    //#region LOG

    addLog = async (logEntity: ExplorerLogEntity, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(ExplorerLogEntity) ?? await this.getRepository('default', ExplorerLogEntity);

        return dataSource.save(logEntity, {
            data: false
        })
    }

    //#endregion LOG


    //#region CATALOG

    getCatalogFromUid = async (catalogUid: string, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(ExplorerCatalogEntity) ?? await this.getRepository('default', ExplorerCatalogEntity);

        return dataSource.find({
            where: {
                catalogUid: catalogUid
            }
        })
    }

    getCatalogFromUser = async (userUid: string, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(ExplorerCatalogEntity) ?? await this.getRepository('default', ExplorerCatalogEntity);

        return dataSource.find({
            where: {
                userUid: userUid
            }
        })
    }

    getUnfullCatalog = async (options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(ExplorerCatalogEntity) ?? await this.getRepository('default', ExplorerCatalogEntity);

        const query = await dataSource.createQueryBuilder('catalog')
            .select('catalog.catalog_uid', 'catalogUid')
            .addSelect('COUNT(catalog.catalog_uid)', 'catalogCount')
            .groupBy('catalog.catalog_uid')
            .having('COUNT(catalog.catalog_uid) <= :count', { count: 100 })
            .getRawMany<{
                catalogUid: string,
                catalogCount: number
            }>();


        if (query.length > 0) {
            return query[0].catalogUid;
        }
        else {
            return undefined;
        }
    }

    addCatalogLink = async (catelogUid: string, userUid: string, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(ExplorerCatalogEntity) ?? await this.getRepository('default', ExplorerCatalogEntity);

        const entity = new ExplorerCatalogEntity();
        entity.catalogUid = catelogUid;
        entity.userUid = userUid;

        return dataSource.save(entity, {
            data: false
        })
    }



    //#endregion CATALOG
}