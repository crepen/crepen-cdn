import { Injectable } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { CrepenExplorerRepository } from "./explorer.repository";
import { ExplorerFolderEntity } from "./entity/folder.explorer.default.entity";
import { DatabaseService } from "@crepen-nest/module/config/database/database.config.service";
import { CrepenExplorerDefaultService } from "./explorer.service";
import { DuplicateFolderError } from "@crepen-nest/lib/error/api/explorer/folder_duplicate.folder.error";
import { RepositoryOptions } from "@crepen-nest/interface/repo";
import { UserEntity } from "../user/entity/user.default.entity";

@Injectable()
export class CrepenExplorerFolderService {
    constructor(
        private readonly explorerRepo: CrepenExplorerRepository,
        private readonly databaseService: DatabaseService,
        private readonly explorerService: CrepenExplorerDefaultService,
        private readonly i18n: I18nService
    ) { }

    getFolderDataByUid = async (folderUid: string): Promise<ExplorerFolderEntity | undefined> => {
        const data = await this.explorerRepo.getFolderData({ uid: folderUid ?? 'NFD' });
        return data ?? undefined;
    }


    addFolder = async (user: UserEntity, parentFolderUid: string, folderName: string) => {
        return (await this.databaseService.getDefault()).transaction(async (manager) => {

            const duplicateFolderData = await this.explorerRepo.getDuplicateFolder(parentFolderUid, folderName, { manager: manager });

            if (duplicateFolderData.length > 0) {
                throw new DuplicateFolderError();
            }

            const addFolderRepo = await this.explorerRepo.addFolder(user.uid, folderName.trim(), { manager: manager });

            const linkFolder = await this.explorerService.linkFolder(user.uid, parentFolderUid, addFolderRepo.uid);

            return addFolderRepo;
        })
    }

    getFolderHierarchy = async (targetFolderUid: string, options?: RepositoryOptions) => {
        return this.explorerRepo.getFolderHierarchy(targetFolderUid, options)
    }
}