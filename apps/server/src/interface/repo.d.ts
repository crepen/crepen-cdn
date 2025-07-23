import { EntityManager } from "typeorm";

export type RepositoryOptions<T = unknown> = {
    manager?: EntityManager,
} & T