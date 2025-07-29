import { Injectable } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { FileEntity } from "./entity/file.default.entity";
import { FileStoreEntity } from "./entity/file-store.default.entity";
import { FilePermissionEntity } from "./entity/file-permission.default.entity";
import { randomUUID } from "crypto";
import { SearchFileInfoOptions } from "./types/search-file-info-option";
import { CrepenBaseRepository } from "src/module/common/base.repository";
import { FilePermissionType } from "@crepen-nest/lib/types/enum/file-permission-type.enum";
import { DatabaseService } from "@crepen-nest/module/config/database/database.config.service";
import { RepositoryOptions } from "src/interface/repo";
import { FileTrafficLoggerEntity } from "../../common/logger/entity/file-traffic-logger.default.entity";

@Injectable()
export class CrepenFileRouteRepository extends CrepenBaseRepository {
    private repo: Repository<FileEntity>;
    private fileStoreRepo: Repository<FileStoreEntity>



    constructor(
        // private readonly dataSource: DataSource,
        private readonly databaseService: DatabaseService
    ) {
        super(databaseService)
        // this.repo = this.dataSource.getRepository(FileEntity);
        // this.fileStoreRepo = this.dataSource.getRepository(FileStoreEntity);
    }




    getFile = async (uid: string, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(FileEntity) ?? await this.getRepository('default', FileEntity);

        return dataSource.findOne({
            where: {
                uid: uid
            }
        })
    }

    getFolderFiles = async (parentFolderUid: string, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(FileEntity) ?? await this.getRepository('default', FileEntity);

        return dataSource.find({
            where: {
                parentFolderUid: parentFolderUid
            }
        })
    }


    addFile = async (entity: FileEntity, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(FileEntity) ?? await this.getRepository('default', FileEntity);

        return dataSource.save(entity, {
            reload: true
        })
    }

    addFileStore = async (entity: FileStoreEntity, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(FileStoreEntity) ?? await this.getRepository('default', FileStoreEntity);

        return dataSource.save(entity, {
            reload: true
        })
    }

    getFileWithStore = async (uid: string, options?: RepositoryOptions<{ includeRemoveFile?: boolean }>) => {
        const dataSource = options?.manager?.getRepository(FileEntity) ?? await this.getRepository('default', FileEntity);


        return dataSource.findOne({
            where: {
                uid: uid,
                isRemoved: options?.includeRemoveFile === true ? undefined : false
            },
            relations: ['fileStore']
        })
    }


    getPublishedFile = async (uid: string, options?: RepositoryOptions<{ includeStore?: boolean }>) => {

        const dataSource = options?.manager?.getRepository(FileEntity) ?? await this.getRepository('default', FileEntity);

        const relations = [];

        if (options?.includeStore === true) {
            relations.push('fileStore');
        }

        return dataSource.findOne({
            where: {
                uid: uid,
                isPublished: true,
                isRemoved: false
            },
            relations: relations
        })
    }


    removeFile = async (fileEntity: FileEntity, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(FileEntity) ?? await this.getRepository('default', FileEntity);

        fileEntity.isRemoved = true;
        fileEntity.updateDate = new Date();

        return dataSource.update(fileEntity.uid, fileEntity);
    }


    editFile = async (fileUid: string, fileEntity: FileEntity, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(FileEntity) ?? await this.getRepository('default', FileEntity);

        return dataSource.update(fileUid, fileEntity);
    }


    getFilesWithStoreFromFolder = async (folderUid: string, options?: RepositoryOptions<{ includeRemoveFile?: boolean }>) => {
        const dataSource = options?.manager?.getRepository(FileEntity) ?? await this.getRepository('default', FileEntity);

        return dataSource.find({
            where: {
                parentFolderUid: folderUid,
                isRemoved: options?.includeRemoveFile === true ? undefined : false
            },
            relations: ['fileStore']
        })
    }






    /**
     * User UID를 이용한 File 권한 체크 이후 해당 파일 조회
     * 
     * @param fileUid File UID
     * @param userUid Permission Check User UID
     * 
     * @since 2025.07.21
     */
    getFileInfo = async (fileUid: string, options?: RepositoryOptions<SearchFileInfoOptions>) => {

        const dataSource = options?.manager?.getRepository(FileEntity) ?? await this.getRepository('default', FileEntity);

        let builder = dataSource
            .createQueryBuilder('file')
            // .addSelect('file.uid' , 'file_uid')
            .leftJoinAndSelect('file.matchPermissions', 'file_permission');

        if (options?.includeTrafficSize === true) {
            builder = builder.leftJoinAndSelect(
                ((qb: SelectQueryBuilder<FileTrafficLoggerEntity>) => (
                    qb.select('fileTraffic.file_uid', 'traffic_file_uid')
                        .addSelect('SUM(fileTraffic.traffic_size)', 'traffic_size')
                        .from('file-traffic-log', 'fileTraffic')
                        .groupBy('fileTraffic.file_uid')
                ))
                , 'traffic'
                , 'traffic.traffic_file_uid = file.uid'
            )
                .addSelect('COALESCE(traffic.traffic_size, 0)', 'file_trafficSize')
        }

        if (options?.includeStore === true) {
            builder.leftJoinAndSelect('file.fileStore', 'file_store')
        }

        builder = builder.where('file.uid = :fileUid', { fileUid: fileUid })



        if (options?.permission) {
            builder = builder
                .andWhere('file_permission.user_uid = :userUid', { userUid: options.permission.userUid })
                .andWhere('file_permission.permission_type = :permissionType', { permissionType: options.permission.permissionType })
        }



        // console.log(builder.getQueryAndParameters())

        const result = await builder.getRawAndEntities();

        // console.log(await result);
        if (result.entities.length === 0) {
            return null;
        }

        const entity = result.entities[0];

        if (options?.includeTrafficSize) {
            entity.trafficSize = Number((result.raw[0] as { [key: string]: any, file_trafficSize?: string | number })?.['file_trafficSize']) || 0;
        }

        return entity;
    }


    /**
     * File - User Permission 연결
     * 
     * @param fileUid File upload uid
     * @param userUid File upload user uid
     * @param permissionArray File permission type
     * 
     * @since 2025.07.21
     */
    addFilePermission = async (data : {fileUid: string, userUid: string, permissionArray: FilePermissionType[]}  ,options?: RepositoryOptions ) => {

        const dataSource = options?.manager?.getRepository(FileEntity) ?? await this.getRepository('default', FileEntity);

        return dataSource
            .createQueryBuilder('file-permission')
            .insert()
            .into(FilePermissionEntity)
            .values(data.permissionArray.map<FilePermissionEntity>(permission => ({
                uid: randomUUID(),
                createDate: new Date(),
                fileUid: data.fileUid,
                permissionType: permission,
                userUid: data.userUid
            })))
            .execute();
    }


}