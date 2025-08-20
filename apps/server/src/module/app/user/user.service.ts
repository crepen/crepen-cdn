import { Injectable } from "@nestjs/common";
import { CrepenUserRepository } from "./user.repository";

@Injectable()
export class CrepenUserService {
    constructor(
        private readonly userRepo : CrepenUserRepository
    ){}


}