import { Injectable } from "@nestjs/common";
import { CrepenExplorerEncryptFileRepository } from "../repository/encrypt-file.explorer.repository";
import { ExplorerEncryptFileEntity } from "../entity/encrypt-file.explorer.default.entity";
import * as path from 'path'
import { RepositoryOptions } from "@crepen-nest/interface/repo";

@Injectable()
export class CrepenExplorerEncryptFileService {
    constructor(
        private readonly repo : CrepenExplorerEncryptFileRepository
    ){}

    addItem = async (encryptUid : string , fileUid : string , options? : RepositoryOptions) => {


        const entity = new ExplorerEncryptFileEntity();
        entity.uid = crypto.randomUUID();
        entity.createDate = new Date();
        entity.fileName = path.format({
            name : encryptUid,
            ext : 'CPCDNENC'
        })
        entity.originFileUid = fileUid;

        await this.repo.addItem(entity , options);
    }


    getEncryptFileDataByLinkFileUid = async (linkFileUid : string , options? : RepositoryOptions) => {
        return this.repo.getItem({
            originFileUid : linkFileUid,
        } , options)
    }

    removeItem = async (uid : string , options? : RepositoryOptions) => {
        return this.repo.removeItem(uid , options);
    }
    
}