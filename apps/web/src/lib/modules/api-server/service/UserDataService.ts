import { CommonApiOptions } from "../entity/CommonApi";
import { UserRepository } from "../repository/UserRepository";
import { UserInfoEntity } from "../entity/object/UserInfoEntity";
import { CommonServiceCookieOptions } from "../entity/CommonService";
import { AuthSessionProvider } from "@web/modules/server/service/AuthSessionProvider";
import { UserDataServiceError } from "@web/modules/common/error/data-service/UserDataServiceError";

export class UserDataService {
    static getUserInfo = async (options?: CommonApiOptions & CommonServiceCookieOptions): Promise<UserInfoEntity | undefined> => {

        const tokenData = options?.token ?? (await AuthSessionProvider.getSessionData({ cookie: options?.cookie })).token?.accessToken


        const request = await UserRepository.getUserInfo({
            language : options?.language,
            token : tokenData
        });

        if (!request.success) {
            throw UserDataServiceError.errorResult(request.message);
        }


        // const instance = new UserInfoEntity();
        const instance = UserInfoEntity.recordToEntity(request.data)



        return instance;
    }
}