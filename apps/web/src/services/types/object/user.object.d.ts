export interface CrepenUser {
    uid?: string,
    id?: string,
    name?: string,
    email?: string,
    createDate?: Date,
    updateDate?: Date,
    isLock?: boolean,
    roles?: string[],
}