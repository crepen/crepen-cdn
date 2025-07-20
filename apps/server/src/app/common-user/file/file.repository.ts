import { Injectable } from "@nestjs/common";
import { DataSource, EntityManager, Repository } from "typeorm";
import { FileEntity } from "./entity/file.entity";
import { ObjectUtil } from "@crepen-nest/lib/util/object.util";
import { FileStoreEntity } from "./entity/file-store.entity";
import { UserEntity } from "../user/entity/user.entity";
import { FilePermissionType } from "@crepen-nest/lib/enum/file-permission-type.enum";
import { FilePermissionEntity } from "./entity/file-permission.entity";
import { randomUUID } from "crypto";

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

    getSharedFileWithStore = (uid: string) => {
        return this.repo.findOne({
            where: {
                uid: uid,
                isPublished: true,
                isRemoved: false
            },
            relations: ['fileStore']
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
    getFileInfoWithPermissionCheck = async (fileUid : string , userUid : string) => {
        return  this.repo
            .createQueryBuilder('file')
            .leftJoinAndSelect('file.matchPermissions', 'file_permission')
            .select()
            .where('file.uid = :fileUid' , {fileUid : fileUid})
            .andWhere('file_permission.user_uid = :userUid' , {userUid : userUid})
            .getOne();
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