import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { StringUtil } from "@web/lib/util/string.util";
import { randomUUID } from "crypto";
import { I18nService } from "nestjs-i18n";
import { GroupEntity } from "./entity/group.entity";
import { GroupRepository } from "./group.repository";
import { ObjectUtil } from "@web/lib/util/object.util";

@Injectable()
export class GroupService {
    constructor(
        private readonly groupRepo: GroupRepository,
        private readonly i18nService : I18nService
    ) { }



    getUserRootGroup = async (userUid: string): Promise<GroupEntity[]> => {
        return await this.groupRepo.getUserRootGroupList(userUid);
    }


    getUserGroup = async (userUid: string, groupId?: string): Promise<GroupEntity[]> => {

        if (StringUtil.isEmpty(groupId)) {
            return await this.getUserRootGroup(userUid);
        }


        return await this.groupRepo.getUserGroupList(userUid , groupId);



    }


    addGroup = async (userUid: string, groupName: string, parentGroupUid?: string, description?: string): Promise<void> => {

        if (!StringUtil.isEmpty(parentGroupUid)) {

            const getParentGroupData = await this.groupRepo.getUserGroup(userUid, parentGroupUid);

            if (ObjectUtil.isNullOrUndefined(getParentGroupData)) {
                throw new HttpException('Parent group is not found.', HttpStatus.BAD_REQUEST)
            }
        }


        const duplicateList = await this.groupRepo.getDuplicateGroupName(userUid, groupName);

        if (duplicateList.length > 0) {
            throw new HttpException('Duplicate group name.', HttpStatus.BAD_REQUEST);
        }



        const groupUUID = randomUUID();
        const saveEntity: GroupEntity = new GroupEntity();

        saveEntity.uid = groupUUID;
        saveEntity.groupName = groupName;
        saveEntity.ownerUid = userUid;
        if (!StringUtil.isEmpty(parentGroupUid)) {
            saveEntity.parentUid = parentGroupUid;
        }
        saveEntity.createDate = new Date(Date.now());
        saveEntity.description = description;



        try {
            await this.groupRepo.addGroup(saveEntity);
        }
        catch (e) {
            throw new HttpException('Failed Add Group', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}