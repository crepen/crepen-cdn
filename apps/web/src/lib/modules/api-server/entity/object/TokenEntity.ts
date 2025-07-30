import { AuthSessionProvider, AuthSessionProviderOptions } from "@web/modules/server/service/AuthSessionProvider";

export interface UserTokenEntityInterface {
    accessToken?: string;
    refreshToken?: string;
}

export class UserTokenEntity {
    constructor() { }

    accessToken?: string;
    refreshToken?: string;


    static dataToEntity = (accessToken?: string, refreshToken?: string) => {
        const instance = new UserTokenEntity();
        instance.accessToken = accessToken;
        instance.refreshToken = refreshToken;
        return instance;
    }



    refreshUserToken = async (options?: AuthSessionProviderOptions) => {
        const prov = await AuthSessionProvider.instance(options);
        await prov.refresh();
        const data = prov.sessionData;

        return UserTokenEntity.dataToEntity(data.token?.accessToken , data.token?.refreshToken);
    }
}