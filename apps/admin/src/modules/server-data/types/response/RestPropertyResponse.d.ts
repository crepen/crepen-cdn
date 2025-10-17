import { DatabaseEntity } from "@web/types/DatabaseEntity";

export interface RestAdminSitePropretiesResult {
    db? : DatabaseEntity & {connectState : boolean}
}