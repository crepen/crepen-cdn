export interface RestListResult<T=unknown> {
    row: T[],
    count: number,
    page: number,
    pageSize: number,
    totalPage : number
}


export type RestSearchFilterOptions = {
    sortType? : string,
    sortCategory? : string,
    page? : number,
    pageSize? : number,
    keyword? : string
}