import { EntityManager } from "typeorm";

export type RepositoryOptions<T = unknown> = {
    manager?: EntityManager,
} & T


/** @deprecated */
export type RepositorySortOptions = {
    sortType? : ('asc' | 'desc')[],
    sortCategory?: string[]
}






// SEARCH RESULT



export interface RepositoryPaginationResult<T> {
    row : T[],
    count : number,
    page : number,
    pageSize : number,
    totalPage : number,
    keyword?: string
}