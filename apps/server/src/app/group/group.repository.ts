import { Injectable } from "@nestjs/common";
import { Repository, DataSource, IsNull } from "typeorm";
import { GroupEntity } from "./entity/group.entity";


@Injectable()
export class GroupRepository {

    private groupRepo: Repository<GroupEntity>;


    constructor(private readonly dataSource: DataSource) {
        this.groupRepo = this.dataSource.getRepository(GroupEntity);
    }

    getUserRootGroupList = async (ownerUid : string) => {
        return await this.groupRepo.find({
            where : {
                ownerUid : ownerUid,
                parentUid : IsNull()
            }
        })
    }

    getUserGroupList = async (ownerUid : string , parentGroupUid : string) => {
        return await this.groupRepo.find({
            where : {
                ownerUid : ownerUid,
                parentUid : parentGroupUid
            }
        })
    }

    getDuplicateGroupName = async (ownerUid : string , groupName : string , parentUid? : string | null) : Promise<GroupEntity[]> => {
        return await this.groupRepo.find({
            where : {
                ownerUid : ownerUid,
                groupName : groupName,
                parentUid : parentUid ?? IsNull()
            }
        })
    }

    addGroup = async (groupEntity : GroupEntity) => {
        return await this.groupRepo.save(groupEntity);
    }

    getUserGroup = async (ownerUid : string , groupUid : string) => {
        return await this.groupRepo.findOne({
            where : {
                ownerUid : ownerUid,
                uid : groupUid
            }
        })
    }

}