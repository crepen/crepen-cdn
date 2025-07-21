import { ConsoleLogger, Injectable } from "@nestjs/common";
import { DataSource, EntityManager, Repository, SelectQueryBuilder } from "typeorm";
import { FileEntity } from "./entity/file.entity";
import { ObjectUtil } from "@crepen-nest/lib/util/object.util";
import { FileStoreEntity } from "./entity/file-store.entity";
import { UserEntity } from "../user/entity/user.entity";
import { FilePermissionType } from "@crepen-nest/lib/enum/file-permission-type.enum";
import { FilePermissionEntity } from "./entity/file-permission.entity";
import { randomUUID } from "crypto";
import { SearchFileInfoOptions } from "./types/search-file-info-option";
import { FileTrafficLoggerEntity } from "@crepen-nest/app/common/logger/entity/file-traffic-logger.entity";

@Injectable()
export class CrepenFileRouteRepository {
    private repo: Repository<FileEntity>;
    private fileStoreRepo: Repository<FileStoreEntity>

    constructor(
        private readonly dataSource: DataSource
    ) {
        this.repo = this.dataSource.getRepository(FileEntity);
        this.fileStoreRepo = this.dataSource.getRepository(FileStoreEntity);
    }


    setManager = (manager: EntityManager) => {
        this.repo = manager.getRepository(FileEntity);
        return this;
    }

    defaultManager = () => {
        this.repo = this.dataSource.getRepository(FileEntity);
        return this;
    }


    getFile = (uid: string) => {
        return this.repo.findOne({
            where: {
                uid: uid
            }
        })
    }

    getFolderFiles = (parentFolderUid: string) => {
        return this.repo.find({
            where: {
                parentFolderUid: parentFolderUid
            }
        })
    }


    addFile = (entity: FileEntity) => {
        return this.repo.save(entity, {
            reload: true
        })
    }

    addFileStore = (entity: FileStoreEntity) => {
        return this.fileStoreRepo.save(entity, {
            reload: true
        })
    }

    getFileWithStore = (uid: string, includeRemoveFile?: boolean) => {
        return this.repo.findOne({
            where: {
                uid: uid,
                isRemoved: includeRemoveFile === true ? undefined : false
            },
            relations: ['fileStore']
        })
    }


    getPublishedFile = (uid: string, includeStore?: boolean) => {

        const relations = [];

        if (includeStore === true) {
            relations.push('fileStore');
        }

        return this.repo.findOne({
            where: {
                uid: uid,
                isPublished: true,
                isRemoved: false
            },
            relations: relations
        })
    }


    removeFile = (fileEntity: FileEntity) => {
        fileEntity.isRemoved = true;
        fileEntity.updateDate = new Date();

        return this.repo.update(fileEntity.uid, fileEntity);
    }


    editFile = (fileUid: string, fileEntity: FileEntity) => {
        return this.repo.update(fileUid, fileEntity);
    }


    getFilesWithStoreFromFolder = (folderUid: string, includeRemoveFile?: boolean) => {
        return this.repo.find({
            where: {
                parentFolderUid: folderUid,
                isRemoved: includeRemoveFile === true ? undefined : false
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
    getFileInfo = async (fileUid: string, options?: SearchFileInfoOptions) => {

        let builder = this.repo
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
    addFilePermission = (fileUid: string, userUid: string, ...permissionArray: FilePermissionType[]) => {

        return this.repo
            .createQueryBuilder('file-permission')
            .insert()
            .into(FilePermissionEntity)
            .values(permissionArray.map<FilePermissionEntity>(permission => ({
                uid: randomUUID(),
                createDate: new Date(),
                fileUid: fileUid,
                permissionType: permission,
                userUid: userUid
            })))
            .execute();
    }


}