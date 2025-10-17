export interface ExplorerSearchFilterData {
    sort : {
        category : {key : string , text : string}[],
        defaultCategory : {key : string , text : string},
        defaultSortType : 'asc' | 'desc'
    },
    pagination : {
        defaultPage : number,
        defaultPageSize : number
    }
}