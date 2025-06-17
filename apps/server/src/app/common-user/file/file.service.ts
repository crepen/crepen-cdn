import { Injectable } from "@nestjs/common";
import { CrepenFileRouteRepository } from "./file.repository";
import { FileEntity } from "./entity/file.entity";

@Injectable()
export class CrepenFileRouteService {
    constructor(
        private readonly repo : CrepenFileRouteRepository
    ) { }




    getFileInfo = async (uid : string) : Promise<FileEntity | undefined> => {
        
        const fileData = await this.repo.getFile(uid);

        return fileData;
    }


    getFolderFiles = async (parentFolderUid : string) : Promise<FileEntity[]> => {
        const files = await this.repo.getFolderFiles(parentFolderUid);

        return files;
    }
}