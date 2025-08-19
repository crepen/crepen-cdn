import { Injectable } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { CrepenExplorerRepository } from "./explorer.repository";
import { ExplorerFolderEntity } from "./entity/folder.explorer.default.entity";

@Injectable()
export class CrepenExplorerFolderService {
    constructor(
        private readonly explorerRepo: CrepenExplorerRepository,
        private readonly i18n: I18nService
    ) { }

    getFolderData = async (folderUid?: string) : Promise<ExplorerFolderEntity | undefined> => {
        const data = await this.explorerRepo.getFolderData(folderUid);

        return data ?? undefined;
    }
}