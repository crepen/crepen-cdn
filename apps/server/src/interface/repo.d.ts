import { EntityManager } from "typeorm";

export interface RepositoryOptions{
    manager? : EntityManager
}