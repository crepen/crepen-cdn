export interface SearchFilterParamOptions<T=unknown> extends T {
    sortType?: 'asc' | 'desc',
    sortCategory? : string,
    pageSize? : number,
    page?: number,
    keyword?: string
}
