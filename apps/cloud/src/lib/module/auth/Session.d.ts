import { TokenGroup } from "@web/lib/types/TokenGroup"

export type SessionUser = {

}

export type SessionRootFolder = {

}

export type SessionData = { 
    token? : TokenGroup,
    user? : SessionUser,
    rootFolder? : SessionRootFolder
}