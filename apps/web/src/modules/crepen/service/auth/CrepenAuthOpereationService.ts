import { CrepenToken } from "@web/services/types/object/auth.object";
import { NextRequest } from "next/server";
import { CrepenCookieOperationService } from "@web/services/operation/cookie.operation.service";
import { CrepenAuthApiService } from "@web/services/api/auth.api.service";
import { CrepenUserOperationService } from "@web/services/operation/user.operation.service";
import { CrepenBaseError } from "@web/modules/common-1/error/CrepenBaseError";
import { CrepenServiceResult } from "@web/modules/common-1/result/CrepenServiceResult";
import { CrepenServiceError } from "@web/modules/common-1/error/CrepenServiceError";
import { CommonOperationService } from "../../common/CommonOperationService";

export class CrepenAuthOpereationService extends CommonOperationService{


    static renewTokenInEdge = async (req: NextRequest, isForce?: boolean): Promise<CrepenServiceResult<CrepenToken>> => {
        const tokenGroup = await CrepenCookieOperationService.getTokenDataInEdge(req)
        return this.baseRenewToken(tokenGroup.data ?? undefined, isForce)
    }

    static renewToken = async (isForce?: boolean): Promise<CrepenServiceResult<CrepenToken | undefined>> => {
        const tokenGroup = await CrepenCookieOperationService.getTokenData();
        return this.baseRenewToken(tokenGroup.data ?? undefined, isForce)
    }

    private static baseRenewToken = async (tokenGroup?: CrepenToken, isForce?: boolean): Promise<CrepenServiceResult<CrepenToken>> => {
        let allowRenew = isForce ?? false;

        try {
            if (allowRenew === false) {
                const checkTokenRequest = await CrepenAuthOpereationService.isAccessTokenExpired(tokenGroup?.accessToken)

                if (checkTokenRequest.success === false) allowRenew = true;
            }

            if (allowRenew === true) {
                const refreshTokenRequest = await CrepenAuthApiService.refreshToken(tokenGroup?.refreshToken);

                return CrepenServiceResult.applyApiResult(refreshTokenRequest);
            }

            return new CrepenServiceResult({
                success: true,
                data: tokenGroup
            })
        }
        catch (e) {
            return this.getDefaultUnkownResult(e as Error);
            // let err = new CrepenServiceResult<CrepenToken | undefined>({
            //     success: false,
            //     message: '알 수 없는 오류입니다.',
            //     innerError: e as Error
            // })

            // if (e instanceof CrepenBaseError) {
            //     err = new CrepenServiceResult<CrepenToken | undefined>({
            //         ...e.toResult()
            //     })
            // }

            // return err;
        }
    }

    static loginUser = async (id?: string, password?: string): Promise<CrepenServiceResult<CrepenToken | undefined>> => {

        try {
            const loginToken = await CrepenAuthApiService.loginUser(id, password);
            if (loginToken.success !== true) {
                throw new CrepenServiceError(loginToken.message, loginToken.statusCode , loginToken.innerError)
            }


            const insertCookie = await CrepenCookieOperationService.insertTokenData(loginToken.data ?? undefined);
            if (insertCookie.success !== true) {
                throw new CrepenServiceError(insertCookie.message, insertCookie.statusCode, insertCookie.innerError)
            }



            const loginUserData = await CrepenUserOperationService.getLoginUserData();
            if (loginUserData.success !== true) {
                throw new CrepenServiceError(loginUserData.message, loginUserData.statusCode, loginUserData.innerError)
            }

            return {
                success: true,
                data: loginToken.data
            }
        }
        catch (e) {
            let err = new CrepenServiceResult<CrepenToken | undefined>({
                success: false,
                message: '알 수 없는 오류입니다.',
                innerError: e as Error
            })

            if (e instanceof CrepenBaseError) {
                err = new CrepenServiceResult<CrepenToken | undefined>({
                    ...e.toResult()
                })
            }

            return err;
        }

    }


    static isAccessTokenExpired = async (accessToken?: string): Promise<CrepenServiceResult<{ expired: boolean; }>> => {
        return CrepenAuthApiService.checkTokenExpired('access_token', accessToken)
    }

    static isRefreshTokenExpired = async (accessToken?: string): Promise<CrepenServiceResult<{ expired: boolean; }>> => {
        return CrepenAuthApiService.checkTokenExpired('refresh_token', accessToken)
    }



}