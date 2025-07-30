import { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies"
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"

export interface CommonStateDTO {
    state : boolean,
    message? : string,
    innerError? : Error
}


export interface CommonServiceCookieOptions {
    cookie? : ResponseCookies | ReadonlyRequestCookies
}